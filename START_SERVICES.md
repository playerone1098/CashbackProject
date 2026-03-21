# Services Startup Guide

## Current Status ✅
- **Backend:** Running (port 5000) - Connected to MongoDB Atlas
- **Frontend:** Running (port 3000) - Blog-style deals website
- **Admin Panel:** Running (port 3003) - Deal management interface
- **Database:** Connected to MongoDB Atlas

## How to Start All Services

### Option 1: Start All Services (Recommended)
```bash
# Navigate to project root
cd /Users/playerone/Desktop/CashbackProject

# Start Backend (Terminal 1)
cd backend && npm run dev &

# Start Frontend (Terminal 2)  
cd frontend && npm start &

# Start Admin Panel (Terminal 3)
cd admin && npm start &

# Or start all in background
npm run start:all
```

### Option 2: Start Services Individually

#### Backend Server
```bash
cd /Users/playerone/Desktop/CashbackProject/backend
npm run dev
```
**Output:** `Server running on port 5000` + `MongoDB connected`

#### Frontend (Blog Website)
```bash
cd /Users/playerone/Desktop/CashbackProject/frontend
npm start
```
**Output:** `Starting development server...` + `Compiled successfully!`

#### Admin Panel
```bash
cd /Users/playerone/Desktop/CashbackProject/admin
npm start
```
**Output:** `Starting development server...` + `Compiled successfully!`

### Option 3: Check Running Services
```bash
# Check if services are running
ps aux | grep -E "(node|mongod)" | grep -v grep

# Check specific ports
lsof -i :5000  # Backend
lsof -i :3000  # Frontend  
lsof -i :3003  # Admin Panel
```

### Option 4: Stop All Services
```bash
# Stop all Node.js processes
pkill -f "node"

# Or stop specific services by port
kill -9 $(lsof -t -i :5000)  # Backend
kill -9 $(lsof -t -i :3000)  # Frontend
kill -9 $(lsof -t -i :3003)  # Admin Panel
```

### Access URLs
- **Frontend (Blog):** http://localhost:3000
- **Admin Panel:** http://localhost:3003
- **Backend API:** http://localhost:5000

### Troubleshooting

#### If Port Already in Use:
```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

#### If MongoDB Connection Fails:
```bash
# Check backend logs
cd backend && npm run dev

# Check .env file
cat .env

# Restart backend after fixing .env
npm run dev
```

#### If Frontend Build Fails:
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Development Workflow
1. **Start backend** → Connects to MongoDB Atlas
2. **Start frontend** → Connects to backend API
3. **Start admin panel** → Manage deals, users
4. **Open browser** → http://localhost:3000 (frontend) or http://localhost:3003 (admin)

### Package.json Scripts (if needed)
Add to each `package.json`:
```json
{
  "scripts": {
    "start:all": "concurrently \"npm run dev\" \"npm run start\" \"npm run start:admin\"",
    "start:admin": "cd admin && npm start"
  }
}
```

### Environment Variables
Make sure `.env` file in `/backend/` contains:
```
MONGODB_URI=mongodb+srv://ashok:ashok123@cluster0.7is3dvd.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
PORT=5000
```
