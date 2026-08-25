from fastapi import APIRouter
from backend.app.api.v1.endpoints import health, auth

api_router = APIRouter()

# Mount health endpoint under /api/v1/health
api_router.include_router(health.router, tags=["Health"])

# Mount auth endpoints under /api/v1/auth
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])

