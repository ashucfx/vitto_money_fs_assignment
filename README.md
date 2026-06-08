# Vitto Loan Portal (Pro Edition)

> **Vitto FSE Intern Assessment** — A production-grade, highly secure, full-stack Loan Application Portal built with Node.js + Express, React (Vite), and PostgreSQL.

![Vitto](https://img.shields.io/badge/Vitto-EE1E4C?style=flat&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql&logoColor=white)
![Security](https://img.shields.io/badge/Security-Helmet_&_Rate_Limiting-success?style=flat&logo=springsecurity&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT-orange?style=flat&logo=jsonwebtokens&logoColor=white)

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | _Add Vercel URL after deployment_ |
| **Backend API** | _Add Render URL after deployment_ |
| **Health Check** | `<backend-url>/health` |

---

## 📋 What's Built (Production Features)

### Backend (Node.js + Express + PostgreSQL)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/applications` | Submit a new loan application | No |
| `GET`  | `/api/applications/:id/track`| Fetch public timeline status | No |
| `POST` | `/api/auth/login` | Authenticate agent & receive JWT | No |
| `GET`  | `/api/applications` | List paginated applications with filters | **Yes (JWT)** |
| `PATCH`| `/api/applications/:id/status`| Update status to `approved` or `rejected` | **Yes (JWT)** |
| `GET`  | `/api/summary` | Dashboard aggregate analytics | **Yes (JWT)** |

- ✅ **Stateless JWT Authentication** — Secure agent dashboard access via Bearer tokens.
- ✅ **Global Rate Limiting** — 100 reqs/15m globally, restricting scraping and DDoS.
- ✅ **Strict Login Throttling** — 5 reqs/15m specifically on `/login` to stop PIN brute-forcing.
- ✅ **Helmet Security** — Automatic injection of critical HTTP headers to prevent XSS and sniffing.
- ✅ **Parameterised Queries** — 100% immune to SQL injection.

### Frontend (React + Vite + Recharts)

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with feature highlights |
| **Apply** | `/apply` | Dynamic form with multi-language support |
| **Track** | `/track` | Public portal: live animated timeline of applicant status |
| **Login** | `/login` | Secure Agent PIN authentication portal |
| **Dashboard** | `/dashboard` | Protected agent dashboard with data grid & analytics |

- ✅ **Applicant Tracker Portal** — Users can track their loan progress via Reference ID without logging in.
- ✅ **Interactive Analytics** — Real-time demographic distribution visualised via `Recharts`.
- ✅ **CSV Export** — Agents can export the currently filtered table to `.csv`.
- ✅ **Details Modal** — Inspect full applicant payload in an elegant Glassmorphism overlay.
- ✅ **Pagination & Search** — Blazing fast server-side pagination and fuzzy searching.
- ✅ **Toast Notifications** — Buttery smooth `react-hot-toast` alerts.

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
```
Edit `.env`:
```env
DATABASE_URL=postgres://user:password@host:5432/dbname
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
AGENT_PIN=123456
JWT_SECRET=super_secret_jwt_key_here
```

### 4. Start the backend & Seed Data

```bash
cd backend
npm install
npm run dev
# ✅ API running at http://localhost:3001
```

**Optional but recommended:** Open a second terminal and seed the database with 25 realistic applications!
```bash
node seed.js
```

### 5. Configure frontend

```bash
cd frontend
cp .env.example .env.local
```
Edit `.env.local`:
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
6. Add environment variables: `DATABASE_URL`, `CLIENT_ORIGIN`, `AGENT_PIN`, `JWT_SECRET`.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import this repo, set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variable: `VITE_API_URL` (your Render backend URL)
5. Deploy

---

## 🔌 API Reference

### POST `/api/auth/login`
**Body:** `{ "pin": "123456" }`
**Response:** `{ "success": true, "data": { "token": "ey..." } }`

### GET `/api/applications/:id/track`
**Response:**
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

### GET `/api/applications`
*(Requires `Authorization: Bearer <token>`)*
Supports `?status=pending`, `?search=priya`, `?page=1&limit=10`.

---

## 🔮 Future Improvements

- Add robust unit testing (Jest + Supertest for API, React Testing Library for components).
- Implement Webhooks for SMS/Email notifications on status changes.
- Migrate from a single PIN to a fully hashed `users` table with Role Based Access Control (RBAC).

---

## 📄 License

MIT — for assessment purposes only. Confidential assessment issued by Vitto.
