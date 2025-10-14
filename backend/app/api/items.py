from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from ..crud import ItemCRUD
from ..database import get_db
from ..models import CollectionType, ItemStatus
from ..schemas import ItemCreate, ItemRead, ItemUpdate

router = APIRouter()


@router.get("", response_model=List[ItemRead])
def list_items(
    *,
    db: Session = Depends(get_db),
    collection_id: Optional[int] = Query(default=None),
    collection_type: Optional[CollectionType] = Query(default=None, alias="type"),
    status: Optional[ItemStatus] = Query(default=None),
    genre: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None, min_length=2),
) -> List[ItemRead]:
    return ItemCRUD.list(
        db,
        collection_id=collection_id,
        collection_type=collection_type,
        status=status,
        genre=genre,
        search=search,
    )


@router.post("", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
def create_item(*, db: Session = Depends(get_db), payload: ItemCreate) -> ItemRead:
    return ItemCRUD.create(db, payload)


@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: int, db: Session = Depends(get_db)) -> ItemRead:
    item = ItemCRUD.get(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=ItemRead)
def update_item(*, item_id: int, db: Session = Depends(get_db), payload: ItemUpdate) -> ItemRead:
    item = ItemCRUD.get(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return ItemCRUD.update(db, item, payload)


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_item(item_id: int, db: Session = Depends(get_db)) -> Response:
    item = ItemCRUD.get(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    ItemCRUD.delete(db, item)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
