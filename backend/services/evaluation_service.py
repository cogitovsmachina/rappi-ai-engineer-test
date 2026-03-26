def evaluate_investment_multiplier(temperature: float, precipitation: float, wind_speed: float) -> float:
    """
    Evaluates the required fleet investment multiplier based on a weather heuristic.
    This simulates an ML model mapping environmental severity to operational connection costs.
    
    Rules:
    - Base multiplier: 1.0
    - Precipitation (rain/snow) introduces hazard and dampens willingness to work, demanding higher investment.
    - Extreme temperatures (too hot or too cold) increase courier fatigue.
    - High wind speed poses safety risks and increases investment requirements.
    """
    multiplier = 1.0
    
    # Rain factor
    if precipitation > 20:   # Heavy rain (e.g. >20mm/day)
        multiplier += 0.50
    elif precipitation > 5:  # Moderate rain
        multiplier += 0.20
    elif precipitation > 1:  # Light rain
        multiplier += 0.05
        
    # Temperature factor
    if temperature > 32:     # Too hot
        multiplier += 0.25
    elif temperature < 10:   # Too cold
        multiplier += 0.15
        
    # Wind factor
    if wind_speed > 35:      # High winds
        multiplier += 0.30
    elif wind_speed > 25:    # Moderate winds
        multiplier += 0.10
        
    return round(multiplier, 2)
