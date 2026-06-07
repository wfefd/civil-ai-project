from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict, Field
from app.repositories.chroma_repository import chroma_repository

router = APIRouter(prefix="/api", tags=["Backend Contract"])


class DocumentIndexRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    document_id: int = Field(..., alias="documentId")
    source: str
    source_name: Optional[str] = Field(default=None, alias="sourceName")
    title: str
    content: str
    url: Optional[str] = None
    category: Optional[str] = None


class DocumentIndexResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    document_id: int = Field(..., alias="documentId")
    indexed: bool
    chunk_count: int = Field(..., alias="chunkCount")
    message: str


class HistoryIndexRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    history_id: int = Field(..., alias="historyId")
    inquiry_id: int = Field(..., alias="inquiryId")
    source: str
    title: str
    content: str
    category: Optional[str] = None


class HistoryIndexResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    history_id: int = Field(..., alias="historyId")
    indexed: bool
    chunk_count: int = Field(..., alias="chunkCount")
    message: str


@router.post("/rag/documents", response_model=DocumentIndexResponse)
async def index_document(request: DocumentIndexRequest) -> DocumentIndexResponse:
    print("문서 적재 요청 수신")
    print("documentId:", request.document_id)
    print("source:", request.source)
    print("sourceName:", request.source_name)
    print("title:", request.title)
    print("category:", request.category)
    print("url:", request.url)
    print("content preview:", request.content[:100])

    # TODO:
    # 여기에서 나중에 실제 전처리, 청킹, 임베딩, ChromaDB 저장 수행

    return DocumentIndexResponse(
        documentId=request.document_id,
        indexed=True,
        chunkCount=1,
        message="문서 적재 성공"
    )


@router.post("/rag/history", response_model=HistoryIndexResponse)
async def index_history(request: HistoryIndexRequest) -> HistoryIndexResponse:
    print("HISTORY 적재 요청 수신")
    print("historyId:", request.history_id)
    print("inquiryId:", request.inquiry_id)
    print("source:", request.source)
    print("title:", request.title)
    print("category:", request.category)
    print("content preview:", request.content[:100])

    # TODO:
    # 여기에서 나중에 source=HISTORY로 ChromaDB 저장 수행

    return HistoryIndexResponse(
        historyId=request.history_id,
        indexed=True,
        chunkCount=1,
        message="history 적재 성공"
    )
@router.get("/rag/count")
async def get_rag_count():
    count = chroma_repository.count_documents()

    return {
        "collectionName": chroma_repository.get_collection_name(),
        "chromaPath": chroma_repository.get_chroma_path(),
        "count": count
    }