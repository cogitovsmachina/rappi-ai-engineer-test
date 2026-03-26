# Rappi AI Engineer Test: Fleet Investment Forecaster

An end-to-end system that consumes public weather APIs (Open-Meteo), generates a weather forecast, evaluates the required level of fleet investment to maintain operational connections (higher incentive multipliers during severe weather), persists the results in a local database, and exposes this data via a REST API and a modern Next.js frontend dashboard.

## Tech Stack
- **Backend API & ML/Heuristics Layer**: Python 3, FastAPI, SQLAlchemy, SQLite
- **Frontend Dashboard**: Next.js (React 19), Recharts, Vanilla CSS Modules
- **Data Source**: Open-Meteo API (No authentication requested)

## Setup Instructions

### 1. Start the Backend Server
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*The API and interactive Swagger docs will be available at `http://127.0.0.1:8000/docs`.*

### 2. Start the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:3000`.*

## System Architecture Highlights
- **Evaluation Heuristic Model**: `services/evaluation_service.py` houses a fast calculation engine that maps Precipitation, Temperature, and Wind factors to an `Investment Multiplier`. For example, extreme heat or heavy rain adds specific unit cost overlays, mimicking a machine learning model pipeline.
- **Persistence**: Forecasts and generated evaluations are logged to `forecast.db` (SQLite) via SQLAlchemy to build a historical temporal understanding of pricing trends over time. Designed to be swapped with PostgreSQL by merely switching the connection string.
- **Visuals**: A sleek, rich dark-mode Recharts-based Next.js dashboard presents the latest 7-day data projections, seamlessly combining all layers of the stack.
