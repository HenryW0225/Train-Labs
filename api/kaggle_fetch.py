from kaggle.api.kaggle_api_extended import KaggleApi
import kagglehub
from kagglehub import KaggleDatasetAdapter
from fastapi import APIRouter, FastAPI, HTTPException
from typing import Any
from pathlib import Path
import traceback
import json
from dotenv import load_dotenv


from fastapi.middleware.cors import CORSMiddleware


API_PREFIX = "/api/v1"
DATASET_CACHE: dict[str, dict[str, Any]] = {}
# search datasets, get preview of dataset, schema

PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(Path(__file__).resolve().parent / ".env")

app = FastAPI()
router = APIRouter(prefix=API_PREFIX)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["null"],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

kaggle_api: KaggleApi | None = None
try:
    kaggle_api = KaggleApi()
    kaggle_api.authenticate()
except Exception as e:
    print("Error authenticating: {}".format(e))


def require_kaggle_api() -> KaggleApi:
    if kaggle_api is None:
        raise HTTPException(
            status_code=503,
            detail="Kaggle API is not authenticated. Configure kaggle.json locally and restart the API server.",
        )
    return kaggle_api


@router.get("/datasets/search")
async def read_datasets(q: str, page: int = 1):
    if not q:
        raise HTTPException(status_code = 400, detail = "Search query is required") #bad request

    datasets = require_kaggle_api().dataset_list(search=q, page=page)

    out_body = []
    try: 
        for dataset in datasets:
            ref_str = getattr(dataset, "ref", "None")
            title_str = getattr(dataset, "title", "None")
            
            out_body.append({
                "title": title_str,
                "ref": ref_str,
                "downloadCount": getattr(dataset, "downloadCount", getattr(dataset, "download_count", "None")),
                "usabilityRating": getattr(dataset, "usabilityRating", getattr(dataset, "usability_rating", "None")),
            })
            
            
            if ref_str != "None":
                DATASET_CACHE.setdefault(ref_str, {})["title"] = title_str
        return {"datasets": out_body}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Kaggle api error: {}".format(e)) #bad request
        
@router.get("/datasets/{ref:path}/files")
async def read_dataset_files(ref: str):
    if not ref or ref == "None":
        raise HTTPException(status_code=400, detail="Reference to dataset is required")
        
    try:
        files_list_obj = require_kaggle_api().dataset_list_files(ref)

        files = [f.name for f in files_list_obj.files] if hasattr(files_list_obj, "files") else []
        
        return {"files": files}
        
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Kaggle API error: {e}")


@router.get("/datasets/{ref:path}/preview")
async def read_dataset_preview(ref: str, file: str | None = None, lines: int = 10):
   
    if not ref:
        raise HTTPException(status_code=400, detail="Reference to dataset is required")

    # try to populate file list via Kaggle API (best-effort)
    files = None
    if kaggle_api is not None:
        try:
            files_list_obj = kaggle_api.dataset_list_files(ref)
            files = [f.name for f in files_list_obj.files] if hasattr(files_list_obj, "files") else None
            if files:
                DATASET_CACHE.setdefault(ref, {})["files"] = files
        except Exception:
            # non-fatal; proceed to kagglehub load which may still work
            files = DATASET_CACHE.get(ref, {}).get("files")

    target_file = file
    if not target_file and files:
        csvs = [f for f in files if f.lower().endswith(".csv")]
        target_file = csvs[0] if csvs else files[0]

    try:
        # file -> df
        df_obj = kagglehub.dataset_load(KaggleDatasetAdapter.PANDAS, ref, target_file)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"KaggleHub error: {e}")

    if df_obj is None:
        raise HTTPException(status_code=404, detail="Dataset or file not found")

    try:
        # if kagglehub returned a mapping of files, pick requested file or the first available.
        chosen_file = target_file
        df = None
        if isinstance(df_obj, dict):
            if chosen_file and chosen_file in df_obj:
                df = df_obj[chosen_file]
            else:
                # pick first dataframe
                chosen_file, df = next(iter(df_obj.items()))
        else:
            df = df_obj
            # if no explicit file and files list exists, set chosen_file to first csv-like file
            if not chosen_file and files:
                csvs = [f for f in files if f.lower().endswith(".csv")]
                chosen_file = csvs[0] if csvs else files[0]
        if hasattr(df, "head") and hasattr(df, "to_dict"):
            preview_df = df.head(lines)
            records = preview_df.to_dict(orient="records")
            columns = list(preview_df.columns)
            resp = {"ref": ref, "file": chosen_file, "columns": columns, "preview": records}
            if files:
                resp["files"] = files
            return resp
        # fallback for non-pandas iterables: coerce rows to lists
        rows = []
        cols = list(df.columns) if hasattr(df, "columns") else None
        for i, row in enumerate(df):
            if i >= lines:
                break
            # row may be a Series or tuple
            if hasattr(row, "to_list"):
                rows.append(row.to_list())
            elif isinstance(row, (list, tuple)):
                rows.append(list(row))
            elif isinstance(row, dict):
                rows.append(row)
            else:
                rows.append(str(row))
        resp = {"ref": ref, "file": chosen_file, "columns": cols, "preview": rows}
        if files:
            resp["files"] = files
        return resp
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error preparing preview: {e}")
    
@router.get("/datasets/{ref:path}")
async def read_dataset(ref: str, file: str | None = None):
    try:
        target_file = file
        if not target_file and kaggle_api is not None:
            try:
                files_list_obj = kaggle_api.dataset_list_files(ref)
                files = [f.name for f in files_list_obj.files] if hasattr(files_list_obj, "files") else []
                if files:
                    csvs = [f for f in files if f.lower().endswith(".csv")]
                    target_file = csvs[0] if csvs else files[0]
            except Exception:
                target_file = file

        df_obj = kagglehub.dataset_load(KaggleDatasetAdapter.PANDAS, ref, target_file)
        


        if isinstance(df_obj, dict):
            df = df_obj.get(target_file, next(iter(df_obj.values())))
        else:
            df = df_obj
        
        headers = list(df.columns)

        data_arrays = json.loads(df.to_json(orient="values"))

        dataset_name = DATASET_CACHE.get(ref, {}).get("title", ref.split("/")[-1])

        return {"dataset": {
            "name": dataset_name,
            "headers": headers,
            "data": data_arrays

        }}
    except HTTPException:
        raise
    except Exception as e:
        # This will print the exact line that failed in your server terminal!
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=f"Error formatting dataset: {str(e)}")


app.include_router(router)
