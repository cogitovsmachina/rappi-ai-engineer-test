from pydantic import BaseModel
from datetime import datetime

class ForecastEvaluationResponse(BaseModel):
    id: int
    timestamp: datetime
    target_date: datetime
    temperature: float
    precipitation: float
    wind_speed: float
    recommended_fleet_investment_multiplier: float
    base_investment: float
    total_investment: float

    class Config:
        from_attributes = True # v2 syntax for orm_mode=True

class GenerateForecastRequest(BaseModel):
    latitude: float = 4.6097 # Default Bogota, Colombia
    longitude: float = -74.0817
    days: int = 7
    base_investment: float = 10000.0
