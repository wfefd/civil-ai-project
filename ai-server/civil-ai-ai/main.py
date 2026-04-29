from fastapi import FastAPI

from schemas.ai_schema import AiDraftRequest, AiDraftResponse
from schemas.document_schema import DocumentSaveRequest, DocumentSearchRequest
from services.rag_engine import RagEngine
from services.vector_store import VectorStore


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