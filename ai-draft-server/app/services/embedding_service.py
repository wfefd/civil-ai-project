from __future__ import annotations

import os
from typing import Any


MODEL_NAME = os.getenv("BGE_M3_MODEL", "BAAI/bge-m3")
BATCH_SIZE = int(os.getenv("BGE_M3_BATCH_SIZE", "8"))
MAX_LENGTH = int(os.getenv("BGE_M3_MAX_LENGTH", "1024"))


class EmbeddingService:
    """
    BGE-M3 based embedding service.
    The model is loaded lazily so the app can still import even before dependencies are installed.
    """

    def __init__(self) -> None:
        self._model: Any | None = None

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []

        output = self._get_model().encode(
            texts,
            batch_size=BATCH_SIZE,
            max_length=MAX_LENGTH,
        )
        dense_vectors = output["dense_vecs"]
        return self._to_python_lists(dense_vectors)

    def embed_query(self, text: str) -> list[float]:
        output = self._get_model().encode(
            [text],
            batch_size=1,
            max_length=MAX_LENGTH,
        )
        dense_vectors = self._to_python_lists(output["dense_vecs"])
        return dense_vectors[0] if dense_vectors else []

    def _get_model(self) -> Any:
        if self._model is not None:
            return self._model

        try:
            from FlagEmbedding import BGEM3FlagModel
        except ImportError as exc:
            raise RuntimeError(
                "FlagEmbedding is not installed. Install it with: pip install -U FlagEmbedding"
            ) from exc

        self._model = BGEM3FlagModel(
            MODEL_NAME,
            use_fp16=False,
        )
        return self._model

    @staticmethod
    def _to_python_lists(vectors: Any) -> list[list[float]]:
        if hasattr(vectors, "tolist"):
            return vectors.tolist()
        return [list(vector) for vector in vectors]


embedding_service = EmbeddingService()
