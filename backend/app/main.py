"""FastAPI entry: health and translate routes."""

from functools import lru_cache

import httpx
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.llm import OpenAICompatibleTranslator, Translator


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1)


class TranslateResponse(BaseModel):
    translation: str


@lru_cache
def _settings() -> Settings:
    return get_settings()


def get_translator(settings: Settings = Depends(_settings)) -> Translator:
    return OpenAICompatibleTranslator(settings)


def create_app() -> FastAPI:
    app = FastAPI(title="Traduz Mat API")
    cfg = _settings()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cfg.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/translate", response_model=TranslateResponse)
    def translate(
        body: TranslateRequest,
        settings: Settings = Depends(_settings),
        translator: Translator = Depends(get_translator),
    ) -> TranslateResponse:
        text = body.text.strip()
        if not text:
            raise HTTPException(status_code=422, detail="Text must not be empty.")
        if len(text) > settings.max_source_chars:
            raise HTTPException(
                status_code=422,
                detail=f"Text exceeds maximum length of {settings.max_source_chars} characters.",
            )
        try:
            translation = translator.translate(text)
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=502,
                detail="Translation provider request failed.",
            ) from exc

        return TranslateResponse(translation=translation)

    return app


app = create_app()
