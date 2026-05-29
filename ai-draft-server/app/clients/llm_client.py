import os

from google import genai

from app.schemas.response import ReferenceItem


MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def _build_reference_text(references: list[ReferenceItem]) -> str:
    if not references:
        return "참고 문서 없음"

    lines: list[str] = []
    for index, reference in enumerate(references, start=1):
        lines.append(
            f"{index}. "
            f"type={reference.source_type}, "
            f"id={reference.source_id}, "
            f"title={reference.title}, "
            f"score={reference.score}"
        )
    return "\n".join(lines)


def build_dummy_answer(
    normalized_question: str,
    predicted_category: str,
    references: list[ReferenceItem],
) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set.")

    client = genai.Client(api_key=api_key)

    prompt = (
        "당신은 대학교 민원 답변 초안을 작성하는 AI 비서입니다.\n"
        "반드시 한국어로 정중하고 간결하게 작성하세요.\n"
        "주어진 문의 분류와 참고 문서를 바탕으로 답변하세요.\n"
        "참고 문서에 없는 사실이나 규정을 임의로 만들어내지 마세요.\n"
        "정보가 부족하면 추가 확인이 필요하다고 안내하세요.\n\n"
        f"[문의 분류]\n{predicted_category}\n\n"
        f"[정규화된 문의]\n{normalized_question}\n\n"
        f"[참고 문서]\n{_build_reference_text(references)}\n\n"
        "위 정보를 바탕으로 사용자에게 전달할 답변 초안을 작성하세요."
    )

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
    except Exception as exc:
        raise RuntimeError(f"Gemini API call failed: {exc}") from exc

    answer = (getattr(response, "text", None) or "").strip()
    if not answer:
        raise RuntimeError("Gemini returned an empty response.")

    return answer
