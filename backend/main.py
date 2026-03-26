from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
import models
from routers import forecast

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Rappi Fleet Investment Forecaster API", description="End-to-end AI system for predicting fleet investment to maintain operational connection based on weather.")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For the test, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/api/v1/forecast", tags=["Forecast"])

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "message": "Backend is running!"}
