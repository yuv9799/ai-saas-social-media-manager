# SocialPulse AI: The AI Social Media OS 🚀

SocialPulse AI is a premium, enterprise-grade AI-powered Social Media Management OS. It enables startups, creators, and digital marketing teams to automate content generation, orchestrate multi-platform scheduling queues, preview slide decks, analyze audience heatmaps, and coordinate workspaces with team members.

---

## 🏗️ System Architecture

This project is structured as a monorepo containing a modern **Next.js 16 (App Router) Frontend** and a robust **Express TypeScript API Backend** backed by a PostgreSQL database and Redis caching queues.

```mermaid
graph TD
    Client["Next.js 16 Web App (App Router)"] -->|Clerk JWT Tokens| Gateway["Express API Gateway (Port 3001)"]
    Gateway -->|Rate Limiter & Zod Validation| Controllers["Route Controllers"]
    Controllers -->|Prisma Client ORM| DB[("PostgreSQL DB (Supabase)")]
    Controllers -->|Queue Manager| Redis[("Redis (BullMQ Cache)")]
    Redis -->|Worker Processor| Worker["BullMQ Worker (Publish Jobs)"]
    Worker -->|Dispatcher| Webhook["n8n Automation Webhooks"]
    Controllers -->|AI Pipeline Fallback| Gemini["Gemini 2.0 Flash"]
    Gemini -.->|Timeout Fallback| OpenAI["OpenAI GPT-4o-Mini"]
    OpenAI -.->|Offline Fallback| RuleBased["Local Rule-Based Writer"]
```

---

## 🌟 Key Features

*   **AI Caption Studio**: High-conversion caption generation utilizing Gemini 2.0 Flash with model fallback networks.
*   **AI Carousel Builder**: Generate, edit, and theme multi-slide social cards with built-in export to scheduling queues.
*   **Content Calendar**: Day-by-hour scheduled post planner featuring fluid HTML5 Drag-and-Drop rescheduling.
*   **Media Library**: Category-filtered design assets grid supporting drag-and-drop simulated file uploads.
*   **Analytics Dashboard**: SVG-rendered Audience Engagement tracking curves alongside an Hour-of-Week audience density heatmap matrix.
*   **Multi-Workspace Teams**: Spawn multiple workspaces, configure permissions (Owner, Admin, Member), and invite collaborators.
*   **Stripe Quota Billing**: Cryptographically verified webhook triggers updating subscriptions (Free, Pro, Enterprise).
*   **Production Safeguards**: Route rate limiting, strict Zod body validation schemas, and production Clerk token verification.

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js v20 or higher
*   PostgreSQL Database
*   Redis Server (running on `localhost:6379`)

### 1. Clone & Set Up Environment Variables
Create a `.env` file in the root directory:
```env
# Next.js Frontend Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Express Backend Configuration
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialpulse?schema=public"
REDIS_URL="redis://127.0.0.1:6379"
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
N8N_WEBHOOK_URL=http://localhost:5678/webhook/...
FRONTEND_URL=http://localhost:3000
```

### 2. Database Migrations
Deploy your Postgres schema using Prisma ORM:
```bash
# Generate client
npx prisma generate

# Apply migrations
npx prisma db push
```

### 3. Run Locally (Development Mode)

#### Launch backend API server:
```bash
cd backend
npm install
npm run dev
```

#### Launch Next.js Web App:
```bash
# Return to root workspace
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🛡️ Production & Security Safeguards

1.  **Strict Authentication Overrides**: Developer mock bypasses are automatically disabled if `NODE_ENV=production`. Live Clerk JWT headers are strictly required.
2.  **Rate Limiting**: Throttles expensive AI calls. Endpoints `/api/v1/generate` and `/api/v1/carousel` are restricted to 10 requests per user per minute.
3.  **Strict Input Validation**: All creation endpoints pass through custom middleware verifying Zod validation schemas.
4.  **Stripe Signature Verification**: Subscription updates are protected by cryptographically validating the incoming payload signatures.

---

## 📄 API Documentation

| Endpoint | Method | Middleware | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/posts` | `POST` | `requireAuth`, `validateBody(createPostSchema)` | Create a scheduled social post |
| `/api/v1/posts` | `GET` | `requireAuth` | Retrieve list of posts |
| `/api/v1/posts/:id` | `PUT` | `requireAuth` | Reschedule or edit a post |
| `/api/v1/generate` | `POST` | `requireAuth`, `aiRateLimiter` | Brainstorm captions using AI |
| `/api/v1/carousel` | `POST` | `requireAuth`, `aiRateLimiter`, `validateBody(createCarouselSchema)` | Generate slide decks |
| `/api/v1/workspaces`| `POST` | `requireAuth`, `validateBody(createWorkspaceSchema)` | Spawn a new workspace |
| `/api/v1/billing/webhook`| `POST` | *Stripe Signature Check* | Process Stripe payment updates |
| `/api/v1/admin/audit-logs`| `GET` | `requireAuth` | View workspace security log |
