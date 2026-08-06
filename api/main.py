from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .auth import router as auth_router
from .kaggle_fetch import router as kaggle_router

# Create SQLite database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Train-Labs Unified API",
    description="Unified API server for Train-Labs bringing together Auth & Kaggle services.",
    version="1.0.0"
)

# Enable CORS for local development and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Auth and Kaggle routers
app.include_router(auth_router)
app.include_router(kaggle_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Train-Labs API",
        "docs": "/docs",
        "database": "SQLite (fuel-your-flow.db) initialized"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}
