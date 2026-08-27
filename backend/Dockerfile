FROM python:3.12-slim

# Prevent Python from buffering stdout/stderr and writing .pyc files
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/app:/app"

WORKDIR /app

# Install system dependencies (git is required for repo cloning and operations)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install uv binary from official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency definition files first for layer caching
COPY pyproject.toml uv.lock ./

# Install project dependencies without installing the root project itself yet
RUN uv sync --frozen --no-install-project --no-cache

# Copy project source code
COPY . .

# Complete sync to install project
RUN uv sync --frozen --no-cache

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]