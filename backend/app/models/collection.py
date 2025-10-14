from __future__ import annotations

from enum import Enum

from sqlalchemy import Column, DateTime, Enum as PgEnum, Integer, String, Text, func
from sqlalchemy.orm import relationship

from ..database import Base


class CollectionType(str, Enum):
    BOOK = "book"
    MOVIE = "movie"
    GAME = "game"
    CARD = "card"


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    type = Column(PgEnum(CollectionType, name="collection_type"), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    items = relationship("Item", back_populates="collection", cascade="all, delete-orphan")
