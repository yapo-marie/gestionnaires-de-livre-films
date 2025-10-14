from __future__ import annotations

import logging
import time
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import api_router
from .config import get_settings
from .database import Base, engine, session_scope
from .models import Collection, CollectionType, Item, ItemStatus
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

logger = logging.getLogger(__name__)

settings = get_settings()
app = FastAPI(title=settings.app_name)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    logger.info("Starting up application", extra={"environment": settings.environment})
    wait_for_database()
    Base.metadata.create_all(bind=engine)
    seed_data()


@app.get("/health", tags=["health"])
def healthcheck() -> dict[str, Any]:
    return {"status": "ok"}


def seed_data() -> None:
    """Insert a small set of demo data if the database is empty."""
    with session_scope() as session:
        if session.query(Collection).first():
            return

        books = Collection(name="Ma Bibliothèque", type=CollectionType.BOOK, description="Romans et BD")
        games = Collection(name="Jeux Préférés", type=CollectionType.GAME, description="Jeux vidéo à finir")

        session.add_all([books, games])
        session.flush()

        session.add_all(
            [
                Item(
                    collection_id=books.id,
                    title="Dune",
                    creator="Frank Herbert",
                    genre="Science Fiction",
                    status=ItemStatus.COMPLETED,
                    rating=5,
                    notes="Classique incontournable",
                    tags=["sci-fi", "epic"],
                ),
                Item(
                    collection_id=games.id,
                    title="The Legend of Zelda: Tears of the Kingdom",
                    creator="Nintendo",
                    genre="Action-Aventure",
                    status=ItemStatus.IN_PROGRESS,
                    rating=4.5,
                    tags=["nintendo", "open-world"],
                ),
            ]
        )
        logger.info("Seed data inserted")


app.include_router(api_router, prefix="/api")


def wait_for_database(max_attempts: int = 30, delay_seconds: int = 3) -> None:
    """Block application startup until the database is reachable."""
    attempt = 0
    while attempt < max_attempts:
        attempt += 1
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            logger.info("Database connection established")
            return
        except OperationalError as exc:  # pragma: no cover - boot-time loops
            logger.warning(
                "Database connection failed; retrying",
                extra={"attempt": attempt, "max_attempts": max_attempts, "error": str(exc)},
            )
            time.sleep(delay_seconds)

    raise RuntimeError("Database is not available after retries")
