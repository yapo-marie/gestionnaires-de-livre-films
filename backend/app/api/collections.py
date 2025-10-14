from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..crud import CollectionCRUD
from ..database import get_db
from ..models import CollectionType
from ..schemas import CollectionCreate, CollectionRead, CollectionUpdate

router = APIRouter()


@router.get("", response_model=List[CollectionRead])
def list_collections(
    *,
    db: Session = Depends(get_db),
    collection_type: Optional[CollectionType] = Query(default=None, alias="type"),
    search: Optional[str] = Query(default=None, min_length=2),
) -> List[CollectionRead]:
    return CollectionCRUD.list(db, collection_type=collection_type, search=search)


@router.post("", response_model=CollectionRead, status_code=status.HTTP_201_CREATED)
def create_collection(*, db: Session = Depends(get_db), payload: CollectionCreate) -> CollectionRead:
    try:
        return CollectionCRUD.create(db, payload)
    except IntegrityError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Collection already exists") from exc


@router.get("/{collection_id}", response_model=CollectionRead)
def get_collection(collection_id: int, db: Session = Depends(get_db)) -> CollectionRead:
    collection = CollectionCRUD.get(db, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    return collection


@router.put("/{collection_id}", response_model=CollectionRead)
def update_collection(
    *, collection_id: int, db: Session = Depends(get_db), payload: CollectionUpdate
) -> CollectionRead:
    collection = CollectionCRUD.get(db, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    return CollectionCRUD.update(db, collection, payload)


@router.delete(
    "/{collection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_collection(collection_id: int, db: Session = Depends(get_db)) -> Response:
    collection = CollectionCRUD.get(db, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    CollectionCRUD.delete(db, collection)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
