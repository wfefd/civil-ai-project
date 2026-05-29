from __future__ import annotations


def _join_keywords(keywords: list[str]) -> str:
    return ", ".join(keywords)


def faq_to_chroma_document(item: dict) -> dict:
    return {
        "id": f"FAQ-{item['id']}",
        "document": (
            f"Source Type: FAQ\n"
            f"Category: {item['category']}\n"
            f"Question: {item['question']}\n"
            f"Answer: {item['answer']}\n"
            f"Keywords: {_join_keywords(item['keywords'])}"
        ),
        "metadata": {
            "source_type": "FAQ",
            "source_id": item["id"],
            "category": item["category"],
            "title": item["question"],
            "is_active": item["is_active"],
        },
    }


def notice_to_chroma_document(item: dict) -> dict:
    return {
        "id": f"NOTICE-{item['id']}",
        "document": (
            f"Source Type: NOTICE\n"
            f"Category: {item['category']}\n"
            f"Title: {item['title']}\n"
            f"Content: {item['content']}\n"
            f"Keywords: {_join_keywords(item['keywords'])}"
        ),
        "metadata": {
            "source_type": "NOTICE",
            "source_id": item["id"],
            "category": item["category"],
            "title": item["title"],
            "is_active": item["is_active"],
        },
    }


def history_to_chroma_document(item: dict) -> dict:
    return {
        "id": f"HISTORY-{item['id']}",
        "document": (
            f"Source Type: HISTORY\n"
            f"Category: {item['category']}\n"
            f"Inquiry Title: {item['inquiry_title']}\n"
            f"Inquiry Content: {item['inquiry_content']}\n"
            f"Answer Content: {item['answer_content']}\n"
            f"Keywords: {_join_keywords(item['keywords'])}"
        ),
        "metadata": {
            "source_type": "HISTORY",
            "source_id": item["id"],
            "category": item["category"],
            "title": item["inquiry_title"],
            "is_active": item["is_active"],
        },
    }


def map_seed_data_to_chroma_documents(
    faqs: list[dict],
    notices: list[dict],
    histories: list[dict],
) -> list[dict]:
    documents: list[dict] = []
    documents.extend(faq_to_chroma_document(item) for item in faqs if item.get("is_active", True))
    documents.extend(notice_to_chroma_document(item) for item in notices if item.get("is_active", True))
    documents.extend(history_to_chroma_document(item) for item in histories if item.get("is_active", True))
    return documents
