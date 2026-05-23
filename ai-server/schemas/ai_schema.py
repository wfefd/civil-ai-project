from typing import Optional
from pydantic import BaseModel


class AiDraftRequest(BaseModel):
    inquiryId: int
    question: str


class AiDraftResponse(BaseModel):
    draftAnswer: str
    category: str
    confidence: float
    sourceSummary: Optional[str] = None

class HistoryIndexRequest(BaseModel):
    historyId: int
    inquiryId: int
    source: str
    title: str
    content: str
    category: Optional[str] = None
    
class HistoryIndexResponse(BaseModel):
    historyId: int
    indexed: bool
    chunkCount: int
    message: str

class DocumentIndexRequest(BaseModel):
    documentId: int
    source: str
    sourceName: Optional[str] = None
    title: str
    content: str
    url: Optional[str] = None
    category: Optional[str] = None


class DocumentIndexResponse(BaseModel):
    documentId: int
    indexed: bool
    chunkCount: int
    message: str