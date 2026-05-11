# --- Stage 1: Build React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY MediSync/frontend/package*.json ./
RUN npm install
COPY MediSync/frontend/ ./
RUN npm run build

# --- Stage 2: Build Django Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    netcat-openbsd \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY MediSync/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p /app/staticfiles /app/media /app/static /app/templates

# Copy backend code
COPY MediSync/backend/ /app/

# Make entrypoint script executable and fix line endings
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Copy frontend build to backend static files
COPY --from=frontend-builder /app/frontend/dist /app/static/

# Copy index.html to templates for Django to serve it
RUN mkdir -p /app/templates && cp /app/static/index.html /app/templates/index.html

# Provide dummy env vars for collectstatic (Django settings load requires these at import time)
ARG SECRET_KEY=dummy-build-key
ARG DATABASE_URL=sqlite:///dummy
ARG EMAIL_HOST_USER=dummy
ARG EMAIL_HOST_PASSWORD=dummy
ARG DEFAULT_FROM_EMAIL=dummy@example.com
ARG BREVO_API_KEY=dummy

# Run collectstatic to prepare production assets
# We provide dummy values to avoid connection errors during build
RUN DATABASE_URL=sqlite:///:memory: SECRET_KEY=build-time-secret python manage.py collectstatic --noinput

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBUG=False

# Port to expose
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["/app/entrypoint.sh"]
