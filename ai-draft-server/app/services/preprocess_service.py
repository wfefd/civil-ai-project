import re


def preprocess_inquiry(title: str, content: str) -> str:
    """
    Merge title and content, then remove punctuation noise for retrieval.
    """

    merged = f"{title} {content}"
    merged = merged.replace("\n", " ").replace("\r", " ")
    merged = re.sub(r"\s+", " ", merged)
    merged = re.sub(r"[^\w\s]", " ", merged)
    merged = re.sub(r"\s+", " ", merged)
    return merged.strip()
