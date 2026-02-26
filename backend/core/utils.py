from __future__ import annotations

from typing import Iterable

from PyPDF2 import PdfReader


def extract_text_from_pdf(file_obj) -> str:
    reader = PdfReader(file_obj)
    parts: Iterable[str] = []
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text_parts.append(page_text)
    return "\n".join(text_parts).strip()
