import chromadb
from chromadb.utils import embedding_functions
from schemas.document_schema import DocumentSaveRequest


class VectorStore:
    def __init__(self):
        # 로컬에 ChromaDB 데이터 저장
        self.client = chromadb.PersistentClient(path="./chroma_db")

        # 임베딩 모델 설정
        # 처음 실행 시 모델 다운로드가 발생할 수 있음
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="jhgan/ko-sroberta-multitask"
        )

        self.collection = self.client.get_or_create_collection(
            name="kumoh_notices",
            embedding_function=self.embedding_function
        )

    def save_document(self, request: DocumentSaveRequest):
        chunks = self._chunk_text(request.content)

        ids = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):
            chunk_id = f"{request.documentId}_chunk_{index + 1}"

            ids.append(chunk_id)
            documents.append(chunk)
            metadatas.append({
                "documentId": request.documentId,
                "title": request.title,
                "category": request.category or "",
                "department": request.department or "",
                "date": request.date or "",
                "url": request.url or "",
                "chunkIndex": index + 1
            })

        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

        return {
            "documentId": request.documentId,
            "chunkCount": len(chunks),
            "message": "문서가 ChromaDB에 저장되었습니다."
        }

    def search(self, question: str, top_k: int = 3):
        result = self.collection.query(
            query_texts=[question],
            n_results=top_k
        )

        search_results = []

        documents = result.get("documents", [[]])[0]
        metadatas = result.get("metadatas", [[]])[0]
        distances = result.get("distances", [[]])[0]

        for document, metadata, distance in zip(documents, metadatas, distances):
            search_results.append({
                "document": document,
                "metadata": metadata,
                "distance": distance
            })

        return search_results

    def _chunk_text(self, text: str):
        # 초기 버전: 문단 기준 청킹
        # 나중에 의미 기반 청킹으로 개선 가능
        paragraphs = [p.strip() for p in text.split("\n") if p.strip()]

        chunks = []
        current_chunk = ""

        max_length = 500

        for paragraph in paragraphs:
            if len(current_chunk) + len(paragraph) <= max_length:
                current_chunk += paragraph + "\n"
            else:
                if current_chunk.strip():
                    chunks.append(current_chunk.strip())
                current_chunk = paragraph + "\n"

        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        if not chunks:
            chunks.append(text.strip())

        return chunks