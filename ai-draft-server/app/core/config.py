from __future__ import annotations

import os


MYSQL_HOST = os.getenv("MYSQL_HOST", "10.251.12.13")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", "3306"))
MYSQL_USER = os.getenv("MYSQL_USER", "scott")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "tiger")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "civil_ai")
MYSQL_CHARSET = os.getenv("MYSQL_CHARSET", "utf8mb4")
MYSQL_SOURCE_DOCUMENT_TABLE = os.getenv("MYSQL_SOURCE_DOCUMENT_TABLE", "SOURCE_DOCUMENT")

REFERENCE_DATA_SOURCE = os.getenv("REFERENCE_DATA_SOURCE", "mysql").lower()
