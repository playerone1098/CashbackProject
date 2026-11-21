# Cashback Deals and Rewards Platform

A comprehensive application for managing cashback deals and rewards with a public frontend website, a dedicated admin panel, and an Express REST API backend powered by **PostgreSQL**.

## Project Structure

```
CashbackProject/
├── backend/          # Node.js/Express API server (always uses PostgreSQL)
├── frontend/         # React user interface (deals, categories, blog)
├── admin/            # React admin panel (deals management, analytics)
├── POSTGRES_SETUP.md # Guide for running with PostgreSQL locally or in cloud
└── README.md
```

## Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Axios
- **Admin Panel**: React 18, Recharts, Tailwind CSS, Axios
- **Backend API**: Node.js, Express.js, `pg` (node-postgres), `pg-mem`, JWT, Helmet, Express Rate Limit
- **Database**:
  - **Always PostgreSQL**: Runs completely offline out of the box using a local PostgreSQL database with seeded mock data.
  - Automatically connects to an external PostgreSQL server when `DATABASE_URL` or `PG*` variables are configured.
  - No boolean configuration flags needed!

## Getting Started

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

### 2. Start Services (Runs Completely Offline with Mock Data!)

In three separate terminals:

```bash
# Terminal 1: Backend API (runs on port 5000)
cd backend
npm start

# Terminal 2: Frontend Web App (runs on port 3000)
cd frontend
npm start

# Terminal 3: Admin Web App (runs on port 3003)
cd admin
npm start
```

### 3. Admin Access
- **URL:** http://localhost:3003
- **Email:** `admin@cashback.com`
- **Password:** `admin123`

## Connecting to an External PostgreSQL Database (Optional)

To point to an external or cloud PostgreSQL instance:
1. Provide `DATABASE_URL` in `backend/.env`:
   ```bash
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cashback
   ```
2. Start the backend (`npm start`). Tables and mock data will be initialized automatically if the database is empty!
3. See [POSTGRES_SETUP.md](file:///c:/Users/Ashok%20Choudhary/Documents/GitHub/CashbackProject/POSTGRES_SETUP.md) for further configuration options.

## Testing

Run backend tests:
```bash
cd backend
npm test
```
All unit and integration tests run directly on PostgreSQL.
