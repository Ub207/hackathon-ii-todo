#!/usr/bin/env python
"""
Hugging Face Space runner for Todo API
This file is specifically for Hugging Face Spaces deployment
"""
import os
from app import app  # Import the FastAPI app from app.py

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)