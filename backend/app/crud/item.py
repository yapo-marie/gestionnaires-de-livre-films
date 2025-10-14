from __future__ import annotations

from typing import List, Optional

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session, joinedload

from ..models import Collection, CollectionType, Item, ItemStatus
from ..schemas import ItemCreate, ItemUpdate


class ItemCRUD:
    @staticmethod
    def list(
        db: Session,
        *,
        collection_id: Optional[int] = None,
        collection_type: Optional[CollectionType] = None,
        status: Optional[ItemStatus] = None,
        genre: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[Item]:
        stmt: Select = select(Item).options(joinedload(Item.collection)).order_by(Item.created_at.desc())

        if collection_id:
            stmt = stmt.where(Item.collection_id == collection_id)
        if collection_type:
            stmt = stmt.join(Item.collection).where(Collection.type == collection_type)
        if status:
            stmt = stmt.where(Item.status == status)
        if genre:
            stmt = stmt.where(func.lower(Item.genre) == genre.lower())
        if search:
            like_pattern = f"%{search.lower()}%"
            stmt = stmt.where(func.lower(Item.title).like(like_pattern))

        return db.execute(stmt).scalars().unique().all()

    @staticmethod
    def get(db: Session, item_id: int) -> Optional[Item]:
        stmt = select(Item).options(joinedload(Item.collection)).where(Item.id == item_id)
        return db.execute(stmt).scalars().first()

    @staticmethod
    def create(db: Session, data: ItemCreate) -> Item:
        item = Item(**data.dict())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def update(db: Session, item: Item, data: ItemUpdate) -> Item:
        for field, value in data.dict(exclude_unset=True).items():
            setattr(item, field, value)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete(db: Session, item: Item) -> None:
        db.delete(item)
        db.commit()
