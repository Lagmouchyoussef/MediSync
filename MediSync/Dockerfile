# --- Stage 1: Build React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Django Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p /app/staticfiles /app/media /app/static /app/templates

# Copy backend code
COPY backend/ /app/

# Make entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Copy frontend build to backend static files
COPY --from=frontend-builder /app/frontend/dist /app/static/

# Copy index.html to templates for Django to serve it
RUN mkdir -p /app/templates && cp /app/static/index.html /app/templates/index.html

# Run collectstatic to prepare production assets
RUN python manage.py collectstatic --noinput

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False

# Port to expose
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["/app/entrypoint.sh"]
