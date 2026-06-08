# Vitto Microfinance Loan Portal

A fully responsive, highly secure, full-stack web application designed for microfinance loan applications and agent operations.

## 🌟 Key Features

### Applicant Facing
- **Multi-lingual Support**: Users can specify their preferred language (Hindi, Tamil, Telugu, Marathi, English) for future communications.
- **Dynamic Application Form**: A beautifully designed, glassmorphism UI for submitting loan applications with real-time field validation.
- **Public Status Tracker**: Borrowers receive a unique Reference ID upon submission, allowing them to track their application status (Submitted ➔ Under Review ➔ Approved/Rejected) on a dynamic vertical timeline without requiring a login.
- **Toast Notifications**: Smooth, professional feedback for all user interactions.

### Agent Operations Dashboard
- **JWT Authentication**: The dashboard is strictly protected behind a secure login portal using an Agent PIN and stateless JSON Web Tokens.
- **Interactive Analytics**: Features a real-time `Recharts` Pie Chart visualizing the demographic language distribution of applicants.
- **Pagination & Search**: The data table is fully paginated and supports instant fuzzy searching by applicant name or mobile number.
- **Full Payload Inspection**: Agents can click to open an elegant modal to view the complete details of any application without navigating away.
- **CSV Data Export**: One-click generation of `.csv` reports for the currently filtered dataset.

### 🛡️ Production-Grade Security
- **SQL Injection Prevention**: All Postgres queries use parameterized inputs.
- **Helmet HTTP Headers**: The backend automatically sets critical security headers to prevent XSS exploits and client-side sniffing.
- **Global Rate Limiting**: IPs are globally restricted to 100 requests per 15 minutes to prevent DDoS attacks.
- **Strict Login Throttling**: The `/login` route restricts IPs to 5 attempts per window, neutralizing brute-force dictionary attacks.
- **Secure Logout**: Safely obliterates JWT sessions on the client side.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), React Router v6, Recharts, Lucide React, React Hot Toast, Vanilla CSS (Glassmorphism design system).
- **Backend**: Node.js, Express.js, PostgreSQL (`pg`), JSON Web Tokens (`jsonwebtoken`), Helmet, Express Rate Limit.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally (or a hosted URL like Neon/Supabase)

### 1. Database Setup
1. Create a new PostgreSQL database (e.g., `vitto_db`).
2. Run the initialization script to build the schema:
   ```bash
   psql -U your_postgres_user -d vitto_db -f backend/migrations/001_init.sql
   ```

### 2. Backend Configuration
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Copy the example environment file and update the variables:
   ```bash
   cp .env.example .env
   ```
   *Make sure `DATABASE_URL` points to your active Postgres database and set a secure `JWT_SECRET` and `AGENT_PIN`.*
3. **Seed the Database**: Generate 25 highly realistic mock applications to populate your dashboard:
   ```bash
   node seed.js
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on port 3001.*

### 3. Frontend Configuration
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will open at `http://localhost:5173`.*

---

## 🔐 Default Credentials
To access the Agent Dashboard and test the protected routes, click "Dashboard" and log in with the PIN defined in your backend `.env` file (Default is `123456`).

---

## 🎨 Design Philosophy
The UI abandons standard flat design in favor of a modern, vibrant **Glassmorphism** aesthetic. Using Vitto's signature brand pink (`#EE1E4C`), deep dark mode backgrounds, translucent blur panels, and smooth micro-animations, the portal delivers an incredibly premium, trustworthy feel for both rural applicants and internal operations staff.
