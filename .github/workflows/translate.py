#!/usr/bin/env python3
import os, re, json, hashlib, pathlib
from typing import Tuple, Dict

import requests
import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
CACHE = ROOT / ".cache_translate"
CACHE.mkdir(exist_ok=True)

DEEPL_API_KEY = os.environ.get("DEEPL_API_KEY")
DEEPL_URL = "https://api.deepl.com/v2/translate"

MD_GLOBS = ["_posts/**/*.md", "_pages/**/*.md"]

def file_hash(p: pathlib.Path) -> str:
    h = hashlib.sha256()
    h.update(p.read_bytes())
    return h.hexdigest()

def load_front_matter(text: str) -> Tuple[Dict, str]:
    if text.startswith("---\n"):
        parts = text.split("\n---\n", 1)
        fm = yaml.safe_load(parts[0].replace("---\n", "")) or {}
        body = parts[1] if len(parts) > 1 else ""
        return fm, body
    return {}, text

def dump_front_matter(fm: Dict, body: str) -> str:
    return "---\n" + yaml.safe_dump(fm, allow_unicode=True, sort_keys=False) + "---\n" + body

CODE_BLOCK_RE = re.compile(r"```[\s\S]*?```", re.MULTILINE)

def mask_code_blocks(s: str) -> Tuple[str, Dict[str,str]]:
    placeholders = {}
    def repl(m):
        key = f"__CODE_{len(placeholders)}__"
        placeholders[key] = m.group(0)
        return key
    return CODE_BLOCK_RE.sub(repl, s), placeholders

def unmask_code_blocks(s: str, placeholders: Dict[str,str]) -> str:
    for k, v in placeholders.items():
        s = s.replace(k, v)
    return s

def translate(text: str) -> str:
    if not text.strip():
        return text
    resp = requests.post(
        DEEPL_URL,
        data={
            "auth_key": DEEPL_API_KEY,
            "text": text,
            "source_lang": "KO",
            "target_lang": "EN",
            "preserve_formatting": 1,
            "formality": "prefer_more",
        },
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()
    return "\n\n".join([t["text"] for t in data.get("translations", [])])

def process_file(path: pathlib.Path):
    rel = path.relative_to(ROOT)
    src_hash = file_hash(path)
    cache_file = CACHE / (str(rel).replace("/", "__") + ".sha")
    if cache_file.exists() and cache_file.read_text() == src_hash:
        return

    text = path.read_text(encoding="utf-8")
    fm, body = load_front_matter(text)
    # skip if explicit lang is en or translation disabled
    if fm.get("lang") == "en" or fm.get("translate") == False:
        return

    # prepare output path: insert /en/ and tag lang
    out_path = ROOT / "en" / rel
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # mask code blocks
    body_masked, placeholders = mask_code_blocks(body)

    # translate fields
    fm_en = dict(fm)
    fm_en["lang"] = "en"
    for key in ("title", "excerpt", "summary"):
        if key in fm_en and isinstance(fm_en[key], str):
            fm_en[key] = translate(fm_en[key])

    body_en = translate(body_masked)
    body_en = unmask_code_blocks(body_en, placeholders)

    out_text = dump_front_matter(fm_en, body_en)
    out_path.write_text(out_text, encoding="utf-8")

    cache_file.write_text(src_hash)

def main():
    if not DEEPL_API_KEY:
        print("DEEPL_API_KEY not set; skipping")
        return
    for pattern in MD_GLOBS:
        for p in ROOT.glob(pattern):
            process_file(p)

if __name__ == "__main__":
    main()














