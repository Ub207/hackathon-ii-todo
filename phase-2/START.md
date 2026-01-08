# 🚀 How to Run Todo App

## Prerequisites
- Python 3.9+ installed
- Node.js 18+ installed
- NeonDB database URL configured

## Step 1: Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd D:\hakathone-2\full-stack-app\phase-2\backend

# Activate virtual environment
D:/hakathone-2/full-stack-app/phase-2/backend/venv/Scripts/activate.bat

# Run backend with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run on:** http://localhost:8000
**API Docs:** http://localhost:8000/docs

## Step 2: Frontend Setup (Terminal 2 - NEW TERMINAL)

```bash
# Navigate to frontend
cd D:\hakathone-2\full-stack-app\phase-2\frontend

# Install dependencies (if not done)
npm install

# Run frontend
npm run dev
```

**Frontend will run on:** http://localhost:3000

## Step 3: Open Browser

Visit: http://localhost:3000

---

## Troubleshooting

### Backend Issues:
- Check `.env` file has `DATABASE_URL` from NeonDB
- Make sure port 8000 is not in use

### Frontend Issues:
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Make sure port 3000 is not in use

---

## Quick Commands

### Backend:
```bash
# Start
cd phase-2/backend && venv/Scripts/activate.bat && uvicorn main:app --reload

# Stop
Ctrl + C
```

### Frontend:
```bash
# Start
cd phase-2/frontend && npm run dev

# Stop
Ctrl + C
```
