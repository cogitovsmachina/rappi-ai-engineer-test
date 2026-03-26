from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas
from services.weather_service import fetch_weather_forecast
from services.evaluation_service import evaluate_investment_multiplier

router = APIRouter()

@router.post("/generate", response_model=List[schemas.ForecastEvaluationResponse])
async def generate_forecast(request: schemas.GenerateForecastRequest, db: Session = Depends(database.get_db)):
    """
    Trigger point: Consumes weather API, evaluates investment needs, and saves to DB.
    """
    try:
        weather_data = await fetch_weather_forecast(request.latitude, request.longitude, request.days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather data: {str(e)}")
        
    evaluations = []
    
    for day in weather_data:
        # Run Evaluation Model
        multiplier = evaluate_investment_multiplier(
            temperature=day["temperature"],
            precipitation=day["precipitation"],
            wind_speed=day["wind_speed"]
        )
        total_investment = request.base_investment * multiplier
        
        # Persist to DB
        db_eval = models.ForecastEvaluation(
            target_date=day["target_date"],
            temperature=day["temperature"],
            precipitation=day["precipitation"],
            wind_speed=day["wind_speed"],
            recommended_fleet_investment_multiplier=multiplier,
            base_investment=request.base_investment,
            total_investment=total_investment
        )
        db.add(db_eval)
        evaluations.append(db_eval)
        
    db.commit()
    
    # Refresh to get IDs provided by DB
    for eval in evaluations:
        db.refresh(eval)
        
    return evaluations

@router.get("/history", response_model=List[schemas.ForecastEvaluationResponse])
def get_forecast_history(limit: int = 100, db: Session = Depends(database.get_db)):
    """
    Retrieves the historical and latest predictions.
    """
    return db.query(models.ForecastEvaluation).order_by(models.ForecastEvaluation.target_date.desc()).limit(limit).all()
