# Vitto Loan Portal

> **Vitto FSE Intern Assessment** — A full-stack Loan Application Portal built with Node.js + Express, React (Vite), and PostgreSQL.

![Vitto](https://img.shields.io/badge/Vitto-EE1E4C?style=flat&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql&logoColor=white)

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | _Add Vercel URL after deployment_ |
| **Backend API** | _Add Render URL after deployment_ |
| **Health Check** | `<backend-url>/health` |

---

## 📋 What's Built

### Backend (Node.js + Express + PostgreSQL)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/applications` | Submit a new loan application |
| `GET` | `/api/applications` | List all applications (supports `?status=` filter + `?search=`) |
| `PATCH` | `/api/applications/:id/status` | Update status to `approved` or `rejected` |
| `GET` | `/api/summary` | Dashboard aggregate stats |

- ✅ Server-side input validation — returns `400` with JSON error messages
- ✅ Parameterised queries — no SQL injection risk
- ✅ PostgreSQL credentials in environment variables only
- ✅ CORS configured per environment

### Frontend (React + Vite)

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with feature highlights |
| **Apply** | `/apply` | Loan application form with client-side validation |
| **Dashboard** | `/dashboard` | Applications table with stats bar, filters, and inline status update |

- ✅ Client-side validation before submit
- ✅ Success confirmation screen with reference number (UUID)
- ✅ Inline status update (no full page reload)
- ✅ Stats bar from `/api/summary`
- ✅ Status filter dropdown
- ✅ **Bonus:** Search by applicant name or mobile number
- ✅ **Bonus:** Language badge colour coding (Hindi / Tamil / Telugu / Marathi / English)
- ✅ **Bonus:** Mobile-responsive layout

### Database (PostgreSQL)

- Single `applications` table with UUID primary keys
- Migration file at `backend/migrations/001_init.sql`
- Status and language constrained via `CHECK` constraints

---

## 🚀 Local Setup (5 minutes)

### Prerequisites
- Node.js ≥ 18
- A PostgreSQL database (Neon free tier recommended)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd vitto-loan-portal
```

### 2. Set up the database

Create a free database at [neon.tech](https://neon.tech), then run the migration:

```bash
psql "<your-DATABASE_URL>" -f backend/migrations/001_init.sql
```

### 3. Configure backend

```bash
cd backend
cp .env.example .env
# Edit .env with your actual DATABASE_URL and CLIENT_ORIGIN
```

```env
DATABASE_URL=postgres://user:password@host:5432/dbname
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Start the backend

```bash
cd backend
npm install
npm run dev
# ✅ API running at http://localhost:3001
# ✅ Health check: http://localhost:3001/health
```

### 5. Configure frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local
```

```env
VITE_API_URL=http://localhost:3001
```

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
# ✅ App running at http://localhost:5173
```

---

## ☁️ Deployment

### Backend → Render

1. Push this repo to GitHub (public)
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables in the Render dashboard:
   - `DATABASE_URL` — your Neon/Supabase connection string
   - `CLIENT_ORIGIN` — your Vercel frontend URL
   - `NODE_ENV` — `production`

Alternatively, use the `render.yaml` blueprint in the repo root.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import this repo, set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_URL` — your Render backend URL
5. Deploy

### Database → Neon (free tier)

1. Go to [neon.tech](https://neon.tech) → Create a project
2. Copy the connection string
3. Run the migration: `psql "<connection-string>" -f backend/migrations/001_init.sql`
4. Use the connection string as `DATABASE_URL`

---

## 🏗️ Project Structure

```
vitto-loan-portal/
├── backend/
│   ├── migrations/
│   │   └── 001_init.sql          # DB migration (run once)
│   ├── src/
│   │   ├── db/
│   │   │   └── pool.js           # PostgreSQL connection pool
│   │   ├── middleware/
│   │   │   ├── validate.js       # Input validation middleware
│   │   │   └── errorHandler.js   # Global error handler
│   │   ├── routes/
│   │   │   ├── applications.js   # POST/GET/PATCH endpoints
│   │   │   └── summary.js        # GET /api/summary
│   │   └── app.js                # Express app setup
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios client + API functions
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── LanguageBadge.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Apply.jsx         # Loan application form
│   │   │   └── Dashboard.jsx     # Applications table + stats
│   │   ├── App.jsx               # Router setup
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles (design system)
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── render.yaml                   # Render deployment blueprint
├── .gitignore
└── README.md
```

---

## 🔌 API Reference

### POST `/api/applications`

**Body:**
```json
{
  "name": "Priya Sharma",
  "mobile": "9876543210",
  "amount": 50000,
  "purpose": "Agricultural equipment",
  "language": "Hindi"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Priya Sharma",
    "status": "pending",
    "created_at": "2026-06-09T..."
  }
}
```

### GET `/api/applications?status=pending&search=priya`

Returns array of applications, filtered and ordered latest first.

### PATCH `/api/applications/:id/status`

**Body:** `{ "status": "approved" }` or `{ "status": "rejected" }`

### GET `/api/summary`

```json
{
  "success": true,
  "data": {
    "totalApplications": 42,
    "totalAmount": 2150000,
    "byStatus": { "pending": 20, "approved": 15, "rejected": 7 }
  }
}
```

---

## ⚠️ Known Issues / Trade-offs

- The Vite version (8.x) requires Node ≥ 20.19.0. The app still works on Node 20.13.1 with engine warnings — all functionality is unaffected.
- Status can only be moved from `pending → approved` or `pending → rejected` (by design — no reverting).
- No authentication layer — this is an internal ops tool prototype.

---

## 🔮 What I'd Improve

- Add JWT authentication for the agent dashboard
- Add pagination for the applications table
- Add unit tests (Jest + Supertest for API, React Testing Library for components)
- Add webhook notifications when a status changes
- Support bulk status updates

---

## 📄 License

MIT — for assessment purposes only. Confidential assessment issued by Vitto.
