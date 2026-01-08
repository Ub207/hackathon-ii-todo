import gradio as gr
import requests
import os
from datetime import datetime
import json

# Get backend URL from environment or default to local
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

def create_task(title, description, status, priority):
    """Create a new task using the API"""
    try:
        task_data = {
            "title": title,
            "description": description,
            "status": status,
            "priority": priority,
            "user_id": 1  # Default user for demo
        }

        response = requests.post(f"{BACKEND_URL}/api/v1/tasks", json=task_data)

        if response.status_code == 201:
            result = response.json()
            return f"✅ Task created successfully! ID: {result['id']}"
        else:
            return f"❌ Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"❌ Connection error: {str(e)}"

def get_tasks(status_filter="all"):
    """Get tasks from the API"""
    try:
        params = {"user_id": 1}  # Default user for demo

        if status_filter != "all":
            params["status"] = status_filter

        response = requests.get(f"{BACKEND_URL}/api/v1/tasks", params=params)

        if response.status_code == 200:
            data = response.json()
            tasks = data.get("tasks", [])

            if not tasks:
                return "No tasks found"

            task_list = []
            for task in tasks:
                task_list.append(f"ID: {task['id']} | {task['title']} | {task['status']} | {task['priority']}")

            return "\n".join(task_list)
        else:
            return f"❌ Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"❌ Connection error: {str(e)}"

def update_task(task_id, title, description, status, priority):
    """Update a task using the API"""
    try:
        update_data = {
            "title": title,
            "description": description,
            "status": status,
            "priority": priority
        }

        response = requests.put(f"{BACKEND_URL}/api/v1/tasks/{task_id}?user_id=1", json=update_data)

        if response.status_code == 200:
            result = response.json()
            return f"✅ Task updated successfully!"
        else:
            return f"❌ Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"❌ Connection error: {str(e)}"

def delete_task(task_id):
    """Delete a task using the API"""
    try:
        response = requests.delete(f"{BACKEND_URL}/api/v1/tasks/{task_id}?user_id=1")

        if response.status_code == 200:
            return "✅ Task deleted successfully!"
        else:
            return f"❌ Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"❌ Connection error: {str(e)}"

# Create Gradio interface
with gr.Blocks(title="Todo API Interface") as demo:
    gr.Markdown("# 📝 Todo API Interface")
    gr.Markdown("Interact with the Todo API using this interface")

    with gr.Tab("Create Task"):
        with gr.Row():
            with gr.Column():
                title_input = gr.Textbox(label="Task Title", placeholder="Enter task title...")
                description_input = gr.Textbox(label="Description", placeholder="Enter task description...")
                status_input = gr.Dropdown(["pending", "in_progress", "completed"], value="pending", label="Status")
                priority_input = gr.Dropdown(["low", "medium", "high"], value="medium", label="Priority")
                create_btn = gr.Button("Create Task")
            with gr.Column():
                create_output = gr.Textbox(label="Result", interactive=False)

        create_btn.click(
            fn=create_task,
            inputs=[title_input, description_input, status_input, priority_input],
            outputs=create_output
        )

    with gr.Tab("View Tasks"):
        with gr.Row():
            with gr.Column():
                status_filter = gr.Dropdown(["all", "pending", "in_progress", "completed"], value="all", label="Filter by Status")
                get_tasks_btn = gr.Button("Get Tasks")
            with gr.Column():
                tasks_output = gr.Textbox(label="Tasks", interactive=False, lines=10)

        get_tasks_btn.click(
            fn=get_tasks,
            inputs=[status_filter],
            outputs=tasks_output
        )

    with gr.Tab("Update Task"):
        with gr.Row():
            with gr.Column():
                update_task_id = gr.Number(label="Task ID", precision=0)
                update_title = gr.Textbox(label="New Title", placeholder="Enter new title...")
                update_description = gr.Textbox(label="New Description", placeholder="Enter new description...")
                update_status = gr.Dropdown(["pending", "in_progress", "completed"], value="pending", label="New Status")
                update_priority = gr.Dropdown(["low", "medium", "high"], value="medium", label="New Priority")
                update_btn = gr.Button("Update Task")
            with gr.Column():
                update_output = gr.Textbox(label="Result", interactive=False)

        update_btn.click(
            fn=update_task,
            inputs=[update_task_id, update_title, update_description, update_status, update_priority],
            outputs=update_output
        )

    with gr.Tab("Delete Task"):
        with gr.Row():
            with gr.Column():
                delete_task_id = gr.Number(label="Task ID to Delete", precision=0)
                delete_btn = gr.Button("Delete Task")
            with gr.Column():
                delete_output = gr.Textbox(label="Result", interactive=False)

        delete_btn.click(
            fn=delete_task,
            inputs=delete_task_id,
            outputs=delete_output
        )

    gr.Markdown(f"Backend URL: {BACKEND_URL}")

# Launch the interface
if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=int(os.getenv("PORT", 7860)))