# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

# Set environment variables (optional, adjust as needed)
ENV APP_HOME /app

# Create and set the working directory in the container
WORKDIR $APP_HOME

# Copy the FastAPI application code and requirements into the container
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 80 for the FastAPI application
EXPOSE 8000

# Define the command to run your FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]