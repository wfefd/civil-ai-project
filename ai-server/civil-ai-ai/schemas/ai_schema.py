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