from kaggle.api.kaggle_api_extended import KaggleApi
import kagglehub
from kagglehub import KaggleDatasetAdapter
from fastapi import FastAPI, HTTPException
from typing import Any
import traceback


"""
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
"""

DATASET_CACHE: dict[str, dict] = {}
#search datasets, get preview of dataset, schema

app = FastAPI(root_path = "/api/v1")


try:
    kaggle_api = KaggleApi()
    kaggle_api.authenticate()
except Exception as e:
    print("Error authenticating: {}".format(e))



@app.get("/datasets/search")
async def read_datasets(q: str, page: int = 1):
    if not q:
        raise HTTPException(status_code = 400, detail = "Search query is required") #bad request

    datasets = kaggle_api.dataset_list(search=q, page=page)

    out_body = []
    try: 
        for dataset in datasets:
            print(f"{dataset.ref} - {dataset.title}")
            out_body.append({
                "title": getattr(dataset, "title", "None"),
                "ref": getattr(dataset, "ref", "None"),
                "downloadCount": getattr(dataset, "downloadCount", getattr(dataset, "download_count", "None")),
                "usabilityRating": getattr(dataset, "usabilityRating", getattr(dataset, "usability_rating", "None")),
                
            })

        return {"datasets": out_body}
    except Exception as e:
        raise HTTPException(status_code = 500, detail = "Kaggle api error: {}".format(e)) #bad request
        
