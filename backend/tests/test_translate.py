from unittest.mock import MagicMock

import httpx
from fastapi.testclient import TestClient

from app.main import app, get_translator

client = TestClient(app)


def test_translate_rejects_empty_after_strip() -> None:
    response = client.post("/translate", json={"text": "   "})
    assert response.status_code == 422


def test_translate_rejects_over_max_length() -> None:
    response = client.post("/translate", json={"text": "a" * 10_001})
    assert response.status_code == 422


def test_translate_success_with_mock_translator() -> None:
    mock = MagicMock()
    mock.translate.return_value = "Hello"

    app.dependency_overrides[get_translator] = lambda: mock
    try:
        response = client.post("/translate", json={"text": "Olá"})
        assert response.status_code == 200
        assert response.json() == {"translation": "Hello"}
        mock.translate.assert_called_once_with("Olá")
    finally:
        app.dependency_overrides.clear()


def test_translate_provider_http_error() -> None:
    mock = MagicMock()
    mock.translate.side_effect = httpx.HTTPError("boom")

    app.dependency_overrides[get_translator] = lambda: mock
    try:
        response = client.post("/translate", json={"text": "Olá"})
        assert response.status_code == 502
    finally:
        app.dependency_overrides.clear()
