from fastapi import APIRouter

from .collections import router as collections_router
from .items import router as items_router

api_router = APIRouter()
api_router.include_router(collections_router, prefix="/collections", tags=["collections"])
api_router.include_router(items_router, prefix="/items", tags=["items"])

__all__ = ["api_router"]
