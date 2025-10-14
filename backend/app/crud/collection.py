from __future__ import annotations

from typing import List, Optional

from sqlalchemy import Select, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..models import Collection, CollectionType
from ..schemas import CollectionCreate, CollectionUpdate


class CollectionCRUD:
    @staticmethod
    def list(
        db: Session,
        *,
        collection_type: Optional[CollectionType] = None,
        search: Optional[str] = None,
    ) -> List[Collection]:
        stmt: Select = select(Collection).order_by(Collection.created_at.desc())

        if collection_type:
            stmt = stmt.where(Collection.type == collection_type)
        if search:
            like_pattern = f"%{search.lower()}%"
            stmt = stmt.where(func.lower(Collection.name).like(like_pattern))

        return list(db.execute(stmt).scalars().all())

    @staticmethod
    def get(db: Session, collection_id: int) -> Optional[Collection]:
        return db.get(Collection, collection_id)

    @staticmethod
    def create(db: Session, data: CollectionCreate) -> Collection:
        collection = Collection(**data.dict())
        db.add(collection)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise
        db.refresh(collection)
        return collection

    @staticmethod
    def update(db: Session, collection: Collection, data: CollectionUpdate) -> Collection:
        for field, value in data.dict(exclude_unset=True).items():
            setattr(collection, field, value)
        db.add(collection)
        db.commit()
        db.refresh(collection)
        return collection

    @staticmethod
    def delete(db: Session, collection: Collection) -> None:
        db.delete(collection)
        db.commit()
