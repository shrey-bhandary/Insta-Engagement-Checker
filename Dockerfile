


# Streamlit + Playwright ready image
# Uses the official Playwright Python base which already contains Chromium and system deps
FROM mcr.microsoft.com/playwright/python:v1.46.0-jammy

# Prevent interactive tzdata prompts
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Copy dependency spec first (better layer caching)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY . /app

# Streamlit defaults
ENV PORT=8501
EXPOSE 8501

# Run the Streamlit app
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
