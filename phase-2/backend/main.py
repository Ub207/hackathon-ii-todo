"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables, get_session
from routes import router
import uvicorn


# Create FastAPI app
app = FastAPI(
    title="Todo API",
    description="Full-stack todo application API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default
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


# ==================== Startup Events ====================

@app.on_event("startup")
def on_startup():
    """Initialize database on startup"""
    create_db_and_tables()


@app.on_event("shutdown")
def on_shutdown():
    """Cleanup on shutdown"""
    print("Shutting down...")


# ==================== Main ====================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
