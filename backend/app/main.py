"""
GitAlong FastAPI Application
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .api.v1 import api_router

logger = logging.getLogger(__name__)
settings = get_settings()
logger.warning("🚀 GitAlong API starting — ALLOWED_ORIGINS: %s", settings.allowed_origins)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "GitAlong backend: hybrid ML recommendation engine "
        "for matching developers by GitHub activity."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
app.include_router(api_router)


@app.get("/", tags=["root"])
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
    }
