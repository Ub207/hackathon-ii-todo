"""
Hugging Face Space wrapper for FastAPI Todo App
This allows the FastAPI application to run on Hugging Face Spaces
"""

import subprocess
import threading
import time
import requests
from fastapi import FastAPI
from gradio.helpers import create_examples
import gradio as gr
import os

# Start the FastAPI app in a separate thread
def start_fastapi():
    from app import app
    import uvicorn

    # Use port 7860 which is standard for Hugging Face Spaces
    uvicorn.run(app, host="0.0.0.0", port=7860, log_level="info")

# Start FastAPI in background thread
fastapi_thread = threading.Thread(target=start_fastapi, daemon=True)
fastapi_thread.start()

# Give the server a moment to start
time.sleep(3)

def test_api():
    """Test the API endpoints"""
    try:
        response = requests.get("http://localhost:7860/health")
        if response.status_code == 200:
            health_data = response.json()
            return f"✅ API Status: {health_data['status']}"
        else:
            return f"❌ API Error: {response.status_code}"
    except Exception as e:
        return f"❌ Connection Error: {str(e)}"

def get_api_docs():
    """Return a link to the API documentation"""
    return "http://localhost:7860/docs - FastAPI automatically generates interactive API documentation"

# Create Gradio interface
with gr.Blocks(title="Todo API - Hugging Face Space") as demo:
    gr.Markdown("# Todo API - FastAPI Backend")
    gr.Markdown("This is a FastAPI backend for the Todo application deployed on Hugging Face Spaces.")

    with gr.Row():
        with gr.Column():
            status_btn = gr.Button("Check API Status")
            status_output = gr.Textbox(label="Status", interactive=False)

            docs_btn = gr.Button("Get API Docs Info")
            docs_output = gr.Textbox(label="API Documentation", interactive=False)

        with gr.Column():
            gr.Markdown("""
            ### Usage Information
            - The FastAPI backend is running on port 7860
            - API endpoints are available at `/api/v1/`
            - Interactive documentation at `/docs`
            - Health check at `/health`
            """)

    status_btn.click(fn=test_api, inputs=None, outputs=status_output)
    docs_btn.click(fn=get_api_docs, inputs=None, outputs=docs_output)

# Launch the Gradio app
if __name__ == "__main__":
    demo.launch(server_port=7860, share=False)