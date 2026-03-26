from sqlalchemy import Column, Integer, Float, DateTime
from database import Base
import datetime

class ForecastEvaluation(Base):
    __tablename__ = "forecast_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    target_date = Column(DateTime, nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    precipitation = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    recommended_fleet_investment_multiplier = Column(Float, nullable=False)
    base_investment = Column(Float, nullable=False)
    total_investment = Column(Float, nullable=False)
