from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl, conlist, confloat

from ..models.item import ItemStatus


class ItemBase(BaseModel):
    title: str = Field(..., max_length=255)
    creator: Optional[str] = Field(default=None, max_length=255)
    genre: Optional[str] = Field(default=None, max_length=255)
    status: ItemStatus = ItemStatus.OWNED
    rating: Optional[confloat(ge=1, le=5)] = None
    notes: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    purchase_date: Optional[date] = None
    price: Optional[confloat(ge=0)] = None
    tags: Optional[conlist(str, max_items=20)] = None


class ItemCreate(ItemBase):
    collection_id: int


class ItemUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    creator: Optional[str] = Field(default=None, max_length=255)
    genre: Optional[str] = Field(default=None, max_length=255)
    status: Optional[ItemStatus] = None
    rating: Optional[confloat(ge=1, le=5)] = None
    notes: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    purchase_date: Optional[date] = None
    price: Optional[confloat(ge=0)] = None
    tags: Optional[conlist(str, max_items=20)] = None


class ItemRead(ItemBase):
    id: int
    collection_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
