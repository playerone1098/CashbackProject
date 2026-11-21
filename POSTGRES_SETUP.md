# PostgreSQL Setup & Local Offline Guide

The platform **always uses PostgreSQL** for its database layer. There is **no boolean flag** (`NO_DB`) needed!

---

## 1. Local Offline Mode (Automatic / Zero Setup)

When you run the backend without any external database configured (or while offline):
- The backend automatically initializes a **local PostgreSQL database** in memory.
- Tables (`users`, `categories`, `deals`, `analytics`) and indexes are created automatically.
- All mock data (sample deals, categories, analytics, and admin user) is seeded automatically.
- Every API endpoint executes real PostgreSQL SQL queries (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP BY`).

Just run:
```bash
cd backend
npm start
```

### Default Admin Credentials
- **Email:** `admin@cashback.com`
- **Password:** `admin123`

---

## 2. Using an External PostgreSQL Server (Optional)

If you have a PostgreSQL server running locally, in Docker, or in the cloud (Supabase, Neon, Render, Railway, AWS RDS), simply specify the connection in `backend/.env`.

### Option A: Local PostgreSQL Service
Create the database:
```sql
CREATE DATABASE cashback;
```
In `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cashback
```
Or with individual parameters:
```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=cashback
```

### Option B: Docker PostgreSQL
```bash
docker run --name cashback-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cashback -p 5432:5432 -d postgres:15
```
In `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cashback
```

### Option C: Cloud PostgreSQL (Neon / Supabase / Render / Railway)
```env
DATABASE_URL=postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
PGSSL=true
```

---

## 3. Database Scripts

### Initialize / Inspect PostgreSQL Tables
```bash
cd backend
node scripts/initPostgres.js
```

### Create / Reset Admin in PostgreSQL
```bash
node scripts/createAdmin.js
```

### Re-seed Sample Deals into PostgreSQL
```bash
node scripts/createSampleDeals.js
```

---

## 4. Checking Database Status
Visit `http://localhost:5000/api/status`:
- With external PostgreSQL:
  ```json
  {
    "backend": "Connected",
    "database": "Connected",
    "storageMode": "postgresql",
    "frontend": "Running"
  }
  ```
- With local offline PostgreSQL:
  ```json
  {
    "backend": "Connected",
    "database": "Connected",
    "storageMode": "postgresql-local",
    "frontend": "Running"
  }
  ```
