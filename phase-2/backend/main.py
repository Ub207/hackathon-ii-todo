"""
FastAPI application entry point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables
from routes import router
import uvicorn


# ==================== Lifespan Events ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    # Startup
    create_db_and_tables()
    yield
    # Shutdown
    print("Shutting down...")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Todo API",
    description="Full-stack todo application API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "http://localhost:3001",  # Alternative local port
        "https://hackathon-ii-todo-8q63.vercel.app",  # Your Vercel deployment
        "https://*.vercel.app"  # Wildcard for Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes
app.include_router(router)


# ==================== Health Check ====================

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "todo-api"}


# ==================== Main ====================

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))  # Use PORT environment variable or default to 8000
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
