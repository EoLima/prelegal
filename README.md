# Prelegal

AI-powered legal document generation. Chat with an AI assistant to draft professional legal agreements — from Mutual NDAs to Cloud Service Agreements.

## Features

- **AI Chat Interface** — Natural language conversation to build legal documents
- **12+ Document Types** — MNDA, CSA, SLA, DPA, Software License, Partnership, Pilot, BAA, AI Addendum, and more
- **Live Document Preview** — See the document update in real-time as you provide information
- **Professional PDF Export** — Branded, A4-formatted PDF with headers, footers, and signature pages
- **Multi-User** — Sign up, sign in, and persist documents across sessions (using the NestJS backend with SQLite)

## Quick Start

```bash
# Start with Docker
scripts/start-linux.sh   # Linux
scripts/start-mac.sh     # macOS
scripts/start-windows.ps1  # Windows

# Stop
scripts/stop-linux.sh
scripts/stop-mac.sh
scripts/stop-windows.ps1
```

Open http://localhost:8000

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | NestJS, TypeORM |
| Database | SQLite (ephemeral — resets on restart) |
| AI | OpenCode Go API (`deepseek-v4-flash`) |
| PDF | jsPDF |
| Deployment | Docker, docker-compose |

## Project Structure

```
prelegal/
├── frontend/          # Next.js static export
│   └── src/
│       ├── app/       # Pages (/, /login, /signup, /dashboard)
│       ├── components/ # ChatArea, DocumentPreview, Header, UI primitives
│       └── lib/       # Auth context, types, templates, PDF generator
├── backend/           # NestJS API server
│   └── src/
│       ├── auth/      # JWT signup/signin
│       ├── chat/      # AI chat endpoint (OpenCode Go API)
│       ├── documents/ # Document CRUD
│       └── users/     # User entity
├── templates/         # Source legal agreement markdown files (CC BY 4.0)
├── scripts/           # Start/stop scripts for all platforms
├── catalog.json       # Document type catalog
└── docker-compose.yml
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/signin` | No | Login, returns JWT |
| POST | `/api/chat` | No | AI chat (OpenCode Go) |
| GET | `/api/documents` | JWT | List user documents |
| POST | `/api/documents` | JWT | Save document |
| GET | `/api/documents/:id` | JWT | Get document detail |
| DELETE | `/api/documents/:id` | JWT | Delete document |

## Environment Variables

Copy `.env.example` or create `.env`:

```env
OPENCODE_GO_API_KEY=sk-...
OPENCODE_GO_BASE_URL=https://api.opencode.ai/go/v1
JWT_SECRET=your-secret-here
```

## Disclaimer

Prelegal AI generates draft legal documents. All documents should be reviewed by a qualified legal professional before use. Prelegal is not a law firm and does not provide legal advice.

## License

Template documents are derived from Common Paper templates under CC BY 4.0. Application code is proprietary.
