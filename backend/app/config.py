from functools import lru_cache
from typing import List

from pydantic import BaseSettings, Field

import json


class Settings(BaseSettings):
    app_name: str = Field("Collection Manager API", env="APP_NAME")
    environment: str = Field("development", env="ENVIRONMENT")
    database_url: str = Field(
        "postgresql+psycopg2://postgres:postgres@postgres:5434/collections",
        env="DATABASE_URL",
    )
    cors_origins: str = Field("http://localhost:3002", env="CORS_ORIGINS")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def cors_origin_list(self) -> List[str]:
        value: object = self.cors_origins
        if isinstance(value, list):
            return [origin.strip() for origin in value if isinstance(origin, str) and origin.strip()]
        if isinstance(value, str):
            trimmed = value.strip()
            if not trimmed:
                return ["http://localhost:3002"]
            if trimmed.startswith("["):
                try:
                    parsed = json.loads(trimmed)
                    if isinstance(parsed, list):
                        return [origin.strip() for origin in parsed if isinstance(origin, str) and origin.strip()]
                except json.JSONDecodeError:
                    pass
            return [origin.strip() for origin in trimmed.split(",") if origin.strip()]
        return ["http://localhost:3002"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
