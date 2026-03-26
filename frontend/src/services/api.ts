const API_URL = "http://127.0.0.1:8000/api/v1/forecast";

export interface ForecastEvaluation {
  id: number;
  timestamp: string;
  target_date: string;
  temperature: number;
  precipitation: number;
  wind_speed: number;
  recommended_fleet_investment_multiplier: number;
  base_investment: number;
  total_investment: number;
}

export const generateForecast = async (latitude = 4.6097, longitude = -74.0817, base_investment = 10000): Promise<ForecastEvaluation[]> => {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude, days: 7, base_investment })
  });
  if (!response.ok) throw new Error("Failed to generate forecast");
  return response.json();
};

export const fetchHistory = async (): Promise<ForecastEvaluation[]> => {
  const response = await fetch(`${API_URL}/history?limit=30`);
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
};
