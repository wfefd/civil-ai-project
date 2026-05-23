from fastapi import FastAPI

from schemas.ai_schema import AiDraftRequest, AiDraftResponse, DocumentIndexResponse, HistoryIndexRequest,HistoryIndexResponse, DocumentIndexRequest
from schemas.document_schema import DocumentSaveRequest, DocumentSearchRequest
from services.rag_engine import RagEngine
from services.vector_store import VectorStore
from typing import Optional
from pydantic import BaseModel

app = FastAPI(
    title="Civil AI Server",
    description="RAG 기반 민원 자동응답 AI 서버",
    version="0.1.0"
)

rag_engine = RagEngine()
vector_store = VectorStore()


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Civil AI Server is running"
    }


@app.post("/api/ai/draft", response_model=AiDraftResponse)
def create_ai_draft(request: AiDraftRequest):
    print("FastAPI received:", request)
    return rag_engine.create_draft(request)


@app.post("/api/documents")
def save_document(request: DocumentSaveRequest):
    return vector_store.save_document(request)


@app.post("/api/documents/search")
def search_document(request: DocumentSearchRequest):
    results = vector_store.search(
        question=request.question,
        top_k=request.topK
    )

    return {
        "question": request.question,
        "results": results
    }
@app.post("/api/rag/history")
def index_history(request: HistoryIndexRequest):
    print("History received:", request)

    return {
        "historyId": request.historyId,
        "indexed": True,
        "chunkCount": 1,
        "message": "테스트용 history 적재 성공"
    }

@app.post("/api/rag/documents", response_model=DocumentIndexResponse)
def index_document(request: DocumentIndexRequest):
    print("문서 적재 요청 수신")
    print("documentId:", request.documentId)
    print("source:", request.source)
    print("sourceName:", request.sourceName)
    print("title:", request.title)
    print("content:", request.content[:100])
    print("url:", request.url)
    print("category:", request.category)

    return DocumentIndexResponse(
        documentId=request.documentId,
        indexed=True,
        chunkCount=1,
        message="테스트용 문서 적재 성공"
    )

@app.post("/api/rag/history", response_model=HistoryIndexResponse)
def index_history(request: HistoryIndexRequest):
    print("히스토리 적재 요청 수신")
    print("historyId:", request.historyId)
    print("inquiryId:", request.inquiryId)
    print("source:", request.source)
    print("title:", request.title)
    print("content:", request.content[:100])
    print("category:", request.category)

    return HistoryIndexResponse(
        historyId=request.historyId,
        indexed=True,
        chunkCount=1,
        message="테스트용 history 적재 성공"
    )