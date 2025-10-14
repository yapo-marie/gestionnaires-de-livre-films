from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from ..models.collection import CollectionType


class CollectionBase(BaseModel):
    name: str = Field(..., max_length=255)
    type: CollectionType
    description: Optional[str] = Field(default=None, max_length=2048)


class CollectionCreate(CollectionBase):
    pass


class CollectionUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=255)
    type: Optional[CollectionType] = None
    description: Optional[str] = Field(default=None, max_length=2048)


class CollectionRead(CollectionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
