FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements_hf.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements_hf.txt

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 7860

# Command to run the application
CMD ["python", "run.py"]