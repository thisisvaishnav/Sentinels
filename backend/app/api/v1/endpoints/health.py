from typing import Any, Dict
from fastapi import APIRouter
from sqlalchemy import text
from backend.app.db.session import AsyncSessionLocal

router = APIRouter()


@router.get("/health", response_model=Dict[str, Any])
async def health_check() -> Dict[str, Any]:
    """Base API Health Check endpoint."""
    return {
        "status": "ok",
        "service": "Lokvision API",
    }


@router.get("/health/db", response_model=Dict[str, Any])
async def db_health_check() -> Dict[str, Any]:
    """
    Development-safe Database & PostGIS connectivity check endpoint.
    Safely tests PostgreSQL connection and PostGIS extension status without exposing credentials.
    """
    try:
        async with AsyncSessionLocal() as session:
            # 1. Test basic PostgreSQL connectivity
            res = await session.execute(text("SELECT 1"))
            val = res.scalar()

            if val != 1:
                return {
                    "status": "degraded",
                    "database": "error",
                    "postgis": False,
                    "message": "Query failed",
                }

            # 2. Test PostGIS extension availability
            postgis_enabled = False
            try:
                pg_res = await session.execute(
                    text("SELECT count(*) FROM pg_extension WHERE extname = 'postgis'")
                )
                cnt = pg_res.scalar()
                postgis_enabled = bool(cnt and cnt > 0)
            except Exception:
                postgis_enabled = False

            return {
                "status": "ok",
                "database": "connected",
                "postgis": postgis_enabled,
            }
    except Exception as exc:
        # Return development-safe error message without credentials
        return {
            "status": "degraded",
            "database": "disconnected",
            "postgis": False,
            "error_type": type(exc).__name__,
            "message": "Unable to connect to PostgreSQL database instance. Verify DATABASE_URL in .env.",
        }
