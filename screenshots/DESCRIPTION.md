# InvoiceLens — AI Invoice & Receipt Data Extraction

**Live demo:** https://extraction-zeta.vercel.app
**Source code:** https://github.com/melkemk/InvoiceLens

---

## One-line pitch

Upload any invoice or receipt (image or PDF) and an AI vision model turns it
into clean, schema-validated, export-ready data in about 5 seconds — with a
confidence score on every single field.

## The problem it solves

Businesses still re-type invoices and receipts into spreadsheets by hand. It's
slow, error-prone, and doesn't scale. Template-based OCR tools break the moment
a new vendor uses a different layout.

InvoiceLens reads documents the way a person would — no per-vendor templates,
no rules to maintain — and hands back structured JSON/CSV your systems can use.

## What it does

- **Vision-powered extraction** — a multimodal LLM reads invoices, receipts, and
  PDFs directly. Works across layouts with zero templates.
- **Schema-validated output** — every response is checked against a strict Zod
  schema, with an automatic repair-retry so malformed data never reaches the UI.
- **Per-field confidence scores** — each value shows how sure the model is, so
  users know exactly what to trust and what to double-check.
- **Human-in-the-loop editing** — results land in an editable table beside the
  original document; fix anything inline before exporting.
- **Batch processing** — queue up to 5 documents and download one combined CSV.
- **CSV & JSON export** — one click to spreadsheet-ready or clipboard-ready data.
- **Production hardening** — server-side API key, request rate limiting, retries,
  and graceful error handling — not just a raw model call.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for the UI
- **Zod** for runtime schema validation of model output
- **Vision LLM** via an OpenAI-compatible API (Llama 4 vision on Groq by default;
  swappable to OpenAI / Gemini through env vars)
- Client-side PDF rendering with **pdf.js**
- Deployed on **Vercel**

## Highlights an employer cares about

- Real product engineering around an LLM: validation, retries, rate limiting,
  and review tooling — not a toy prompt.
- Provider-agnostic design (one env var switches between Groq, OpenAI, Gemini).
- Clean, responsive, animated marketing site + a working interactive demo.
- End-to-end: from drag-and-drop upload to validated export.

---

## Screenshots

| File | What it shows |
|------|----------------|
| `01-homepage-full.png` | Full landing page — hero, "How it works", and feature grid. |
| `02-hero.png` | Hero section — headline, CTAs, and headline stats. |
| `03-demo-extracted.png` | **The core demo:** original invoice on the left, fully extracted & editable fields with per-field confidence on the right, plus CSV/JSON export. |
| `04-demo-full.png` | Full-page view of the live demo with a sample document processed end-to-end. |
