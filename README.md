# SmartDoc AI

B2B SaaS for document data extraction (passports, invoices, contracts, acts) using **Yandex Vision OCR** + **YandexGPT**, with schema-normalized JSON delivery to AmoCRM / Bitrix24 / 1C.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma ORM
- Redis + BullMQ (falls back to inline queue if Redis is down)
- Yandex Cloud OCR / Foundation Models (mock mode without credentials)

## Quick start

```bash
# 1. Start infra
docker compose up -d

# 2. Env
cp .env.example .env

# 3. Install & migrate
npm install
npx prisma migrate dev --name init
npm run db:seed

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo login (after seed):

- Email: `admin@smartdoc.local`
- Password: `admin123456`

## Core flows

1. Create a **Pipeline** with JSON schema fields (`inn_seller`, amounts, dates, …).
2. Upload via UI drag & drop or:

```bash
curl -X POST "http://localhost:3000/api/v1/documents/upload" \
  -H "Authorization: Bearer sd_YOUR_API_KEY" \
  -F "pipelineId=PIPELINE_ID" \
  -F "file=@invoice.pdf"
```

3. Public ingest webhook:

```bash
curl -X POST "http://localhost:3000/api/v1/ingest/PIPELINE_ID" \
  -H "Authorization: Bearer sd_YOUR_API_KEY" \
  -H "Content-Type: application/pdf" \
  -H "X-Filename: invoice.pdf" \
  --data-binary @invoice.pdf
```

4. Review `NEEDS_REVIEW` docs side-by-side, edit fields, **Confirm & Send to 1C/CRM**.

## Yandex Cloud

Set in `.env`:

- `YANDEX_API_KEY` **or** (`YANDEX_IAM_TOKEN` + `YANDEX_FOLDER_ID`)
- Optional overrides: `YANDEX_OCR_URL`, `YANDEX_GPT_URL`, `YANDEX_GPT_MODEL`

Without credentials the processor runs in **mock mode** (deterministic invoice-like OCR/LLM output) so local development works offline.

## Project map

| Path | Purpose |
|------|---------|
| `src/lib/yandex-ai.service.ts` | OCR + YandexGPT wrapper |
| `src/lib/document-processor.ts` | Async pipeline: OCR → LLM → validate → export |
| `src/lib/queue.ts` | BullMQ / inline queue |
| `src/lib/integrations.ts` | Signed webhook sender + CRM templates |
| `src/app/api/v1/documents/upload` | Upload API |
| `src/app/api/v1/ingest/[pipeline_id]` | Public ingest webhook |
| `prompts/PRD.md` | Full product requirements |

## Compliance notes

- Temp uploads are deleted from disk after processing.
- Optional PII masking before LLM (`maskPii` on pipeline).
- Designed for Yandex Cloud / 152-FZ deployment posture.
