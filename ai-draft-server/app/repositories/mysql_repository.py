from __future__ import annotations

from typing import Any

from app.core.config import (
    MYSQL_CHARSET,
    MYSQL_DATABASE,
    MYSQL_HOST,
    MYSQL_PASSWORD,
    MYSQL_PORT,
    MYSQL_SOURCE_DOCUMENT_TABLE,
    MYSQL_USER,
)


class MySQLRepository:
    def _connect(self) -> Any:
        try:
            import pymysql
        except ImportError as exc:
            raise RuntimeError("pymysql is not installed. Install it with: pip install pymysql") from exc

        return pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            charset=MYSQL_CHARSET,
            cursorclass=pymysql.cursors.DictCursor,
        )

    def load_reference_data(self) -> dict[str, list[dict]]:
        with self._connect() as connection:
            with connection.cursor() as cursor:
                rows = self._fetch_source_documents(cursor)
                return {
                    "faqs": self._to_faqs(rows),
                    "notices": self._to_notices(rows),
                    "histories": [],
                }

    def _fetch_source_documents(self, cursor: Any) -> list[dict]:
        table_name = MYSQL_SOURCE_DOCUMENT_TABLE.replace("`", "")
        cursor.execute(
            f"""
            SELECT
                `id`,
                `source`,
                `source_name`,
                `title`,
                `content`,
                `url`,
                `category`,
                `author`,
                `posted_date`
            FROM `{table_name}`
            WHERE LOWER(`source`) IN ('qna', 'notice')
            """
        )
        return cursor.fetchall()

    def _to_faqs(self, rows: list[dict]) -> list[dict]:
        return [
            {
                "id": row["id"],
                "category": row.get("category") or "OTHER",
                "question": row.get("title") or row.get("source_name") or "",
                "answer": self._build_content(row),
                "keywords": self._build_keywords(row),
                "is_active": True,
            }
            for row in rows
            if str(row.get("source", "")).lower() == "qna"
        ]

    def _to_notices(self, rows: list[dict]) -> list[dict]:
        return [
            {
                "id": row["id"],
                "category": row.get("category") or "NOTICE",
                "title": row.get("title") or row.get("source_name") or "",
                "content": self._build_content(row),
                "keywords": self._build_keywords(row),
                "is_active": True,
            }
            for row in rows
            if str(row.get("source", "")).lower() == "notice"
        ]

    @staticmethod
    def _build_content(row: dict) -> str:
        parts = [
            row.get("content") or "",
            f"URL: {row['url']}" if row.get("url") else "",
            f"Author: {row['author']}" if row.get("author") else "",
            f"Posted Date: {row['posted_date']}" if row.get("posted_date") else "",
        ]
        return "\n".join(part for part in parts if part)

    @staticmethod
    def _build_keywords(row: dict) -> list[str]:
        keywords = [row.get("source"), row.get("source_name"), row.get("category")]
        return [str(keyword) for keyword in keywords if keyword]


mysql_repository = MySQLRepository()
