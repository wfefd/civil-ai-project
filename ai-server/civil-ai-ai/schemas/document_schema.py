from typing import Optional
from pydantic import BaseModel


class DocumentSaveRequest(BaseModel):
    documentId: str
    title: str
    content: str
    category: Optional[str] = None
    department: Optional[str] = None
    date: Optional[str] = None
    url: Optional[str] = None


class DocumentSearchRequest(BaseModel):
    question: str
    topK: int = 3