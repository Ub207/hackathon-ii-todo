"""
Hugging Face Space for FastAPI Todo App with Gradio Interface
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from db import create_db_and_tables
from routes import router
import uvicorn
from gradio_interface import demo as gradio_app

# Create FastAPI app with lifespan
app = FastAPI(
    title="Todo API",
    description="Full-stack todo application API",
    version="1.0.0",
)

# Configure CORS for Hugging Face Spaces
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://hackathon-ii-todo-8q63.vercel.app",  # Your Vercel deployment
        "https://*.hf.space",  # Hugging Face Spaces
        "https://*.huggingface.app",  # Hugging Face Apps
        "http://localhost:3000",  # Local development
        "http://localhost:3001",  # Alternative local port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1")

@app.get("/")
def home():
    """Redirect to Gradio interface"""
    return RedirectResponse(url="/gradio")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "todo-api", "platform": "huggingface-spaces"}

@app.on_event("startup")
def startup_event():
    """Startup event to initialize database"""
    try:
        create_db_and_tables()
        print("Database initialized")
    except Exception as e:
        print(f"Database initialization error: {e}")

# Mount Gradio interface
app.mount("/gradio", gradio_app)

# For Hugging Face Spaces, we'll use this as the main entry point
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))  # Hugging Face uses port 7860
    uvicorn.run(app, host="0.0.0.0", port=port)