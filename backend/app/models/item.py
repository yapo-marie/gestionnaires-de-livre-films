from __future__ import annotations

from enum import Enum

from sqlalchemy import JSON, Column, Date, DateTime, Enum as PgEnum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from ..database import Base


class ItemStatus(str, Enum):
    OWNED = "owned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    WISHLIST = "wishlist"


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    creator = Column(String(255), nullable=True)
    genre = Column(String(255), nullable=True)
    status = Column(PgEnum(ItemStatus, name="item_status"), nullable=False)
    rating = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    image_url = Column(String(1024), nullable=True)
    purchase_date = Column(Date, nullable=True)
    price = Column(Float, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), server_onupdate=func.now(), nullable=False)

    collection = relationship("Collection", back_populates="items")
