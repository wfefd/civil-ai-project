from schemas.ai_schema import AiDraftRequest, AiDraftResponse
from services.vector_store import VectorStore


class RagEngine:
    def __init__(self):
        self.vector_store = VectorStore()

    def create_draft(self, request: AiDraftRequest) -> AiDraftResponse:
        question = request.question

        category = self._classify_question(question)

        # ChromaDB에서 유사 문서 검색
        search_results = self.vector_store.search(question, top_k=3)

        draft_answer = self._generate_temporary_answer(category, search_results)
        confidence = self._calculate_temporary_confidence(category, search_results)
        source_summary = self._make_source_summary(search_results)

        return AiDraftResponse(
            draftAnswer=draft_answer,
            category=category,
            confidence=confidence,
            sourceSummary=source_summary
        )

    def _classify_question(self, question: str) -> str:
        if "등록금" in question:
            return "등록금"

        if "수강" in question or "수강신청" in question:
            return "수강신청"

        if "휴학" in question or "복학" in question:
            return "휴복학"

        if "장학" in question or "장학금" in question:
            return "장학"

        if "졸업" in question:
            return "졸업"

        return "기타"

    def _generate_temporary_answer(self, category: str, search_results: list) -> str:
        if not search_results:
            return (
                "관련 문서를 찾지 못했습니다. "
                "담당자가 직접 확인 후 답변을 작성해야 합니다."
            )

        top_document = search_results[0]["document"]
        top_metadata = search_results[0]["metadata"]

        title = top_metadata.get("title", "관련 문서")

        return (
            f"{category} 관련 문의로 분류되었습니다. "
            f"검색 결과, '{title}' 문서가 가장 관련성이 높은 자료로 확인되었습니다. "
            f"해당 문서의 주요 내용은 다음과 같습니다: {top_document} "
            f"위 내용을 바탕으로 담당자가 최종 답변을 검토할 수 있습니다."
        )

    def _calculate_temporary_confidence(self, category: str, search_results: list) -> float:
        if category == "기타":
            return 0.60

        if not search_results:
            return 0.50

        return 0.85

    def _make_source_summary(self, search_results: list) -> str:
        if not search_results:
            return "검색된 근거 문서가 없습니다."

        summaries = []

        for index, result in enumerate(search_results, start=1):
            metadata = result["metadata"]
            title = metadata.get("title", "제목 없음")
            url = metadata.get("url", "")

            summaries.append(f"{index}. {title} ({url})")

        return "\n".join(summaries)