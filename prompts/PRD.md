# System & Product Technical Requirements Document (PRD)

## Project Overview

**Product Name:** SmartDoc AI (SaaS / B2B Document Processing & Integration Platform)

**Goal:** Build a B2B SaaS platform that automates document data extraction (Passports, Invoices, Contracts, Acts) using OCR and LLM (Yandex Cloud stack), normalizes the extracted data according to customizable schemas, and delivers structured JSON payloads directly to client CRM/ERP systems (AmoCRM, Bitrix24, 1C).

---

## Technical Stack & Infrastructure

* **Frontend:** Next.js (TypeScript), Tailwind CSS, shadcn/ui.
* **Backend:** Next.js Route Handlers + BullMQ workers (inline fallback).
* **Database:** PostgreSQL (User accounts, Schemas, Logs, Usage tracking), Redis (Job queues via BullMQ).
* **AI / OCR Layer (Yandex Cloud):**
  * **OCR:** Yandex Vision OCR API (text extraction from PDF / JPEG / PNG / TIFF).
  * **LLM:** YandexGPT API (Yandex Foundation Models / YandexGPT Lite / Pro) with Structured JSON Output prompts.
* **Compliance & Privacy:**
  * Deployment-ready for Yandex Cloud (152-FZ compliance).
  * Data retention policy: Temp files deleted from storage right after processing; extracted entities stored in DB.

---

## Monetization (B2B)

1. **Setup Fee** — one-time implementation/integration for client-specific document types and CRM/ERP config.
2. **Subscription** — monthly fee by processed document volume (covers Yandex Cloud + margin).

Yandex OCR / YandexGPT are Pay-as-you-go. New Yandex Cloud billing accounts typically receive a starter grant suitable for MVP development.

---

## Core Workflow

1. Client defines a Document Processing Pipeline + JSON Schema Mapping.
2. Ingestion via Web UI, public webhook (`POST /api/v1/ingest/:pipeline_id`), or API upload.
3. Async job: validate → OCR → LLM extract → validate (INN checksums, amount math) → SUCCESS / NEEDS_REVIEW.
4. On success or manual confirm: signed outgoing webhook to AmoCRM / Bitrix24 / 1C / generic middleware.

---

## MVP Modules

### Module A — Client Dashboard & UI

* Auth: Email/Password + JWT, roles Admin / Manager.
* Pipeline Builder CRUD.
* Document History with statuses `PENDING`, `PROCESSING`, `SUCCESS`, `FAILED`, `NEEDS_REVIEW`.
* Side-by-side review: OCR preview + editable extracted JSON, Confirm & Send.
* API Keys & Webhooks management.

### Module B — Processing Engine

* Queue worker with retries / rate limiting.
* `yandex-ai.service.ts` wrapping Vision OCR + YandexGPT.
* Optional PII masking before LLM.

### Module C — Integration Layer

* Generic webhook sender with HMAC signature (`X-SmartDoc-Signature`).
* Templates: AmoCRM, Bitrix24, universal 1C HTTP POST.
