# Services Startup Guide

## Overview
This platform consists of three main components:
- **Backend API:** Node.js / Express REST API (port 5000)
  - **Always PostgreSQL:** The database layer is 100% PostgreSQL.
  - **Zero Setup / Completely Offline:** Automatically spins up a local PostgreSQL database with seeded mock data — **no external database installation or daemon required**!
  - **External PostgreSQL Support:** Automatically connects to an external or cloud PostgreSQL database whenever `DATABASE_URL` (or `PG*` variables) is provided in `.env`.
  - **No boolean flags:** No `NO_DB` or toggles needed.
- **Frontend:** React blog-style cashback deals website (port 3000)
- **Admin Panel:** React administrative dashboard (port 3003)

---

## Quick Start (Zero Setup / Completely Offline Mode)

You can run the entire platform locally without setting up or installing any external database!

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin
cd ../admin
npm install
```

### 2. Start Services

Open three terminal windows:

#### Terminal 1 — Backend
```bash
cd backend
npm start
```
*Output: `Server running on port 5000` + `PostgreSQL database active in local offline mode with seeded mock data`*

#### Terminal 2 — Frontend (User Web App)
```bash
cd frontend
npm start
```
*Accessible at: http://localhost:3000*

#### Terminal 3 — Admin Panel
```bash
cd admin
npm start
```
*Accessible at: http://localhost:3003*

---

## Admin Credentials

Default credentials:
- **Email:** `admin@cashback.com`
- **Password:** `admin123`

---

## Access URLs
- **Frontend (Website):** http://localhost:3000
- **Admin Panel:** http://localhost:3003
- **Backend API:** http://localhost:5000
- **API Status:** http://localhost:5000/api/status
- **Health Check:** http://localhost:5000/health
- **Sitemap:** http://localhost:5000/sitemap.xml

---

## Environment Variables (`backend/.env`)

```bash
PORT=5000
JWT_SECRET=cashback_local_jwt_secret_dev_key
NODE_ENV=development

# Optional: To connect to an external PostgreSQL server, add:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cashback
```
See [POSTGRES_SETUP.md](file:///c:/Users/Ashok%20Choudhary/Documents/GitHub/CashbackProject/POSTGRES_SETUP.md) for full details.

---

## Stopping Services
- Use `Ctrl + C` in each terminal window, or on Linux/macOS:
```bash
kill -9 $(lsof -t -i :5000)  # Backend
kill -9 $(lsof -t -i :3000)  # Frontend
kill -9 $(lsof -t -i :3003)  # Admin
```
