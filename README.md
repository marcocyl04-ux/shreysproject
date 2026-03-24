# Sovereign Terminal | Volatility Forecasting

A premium volatility prediction dashboard for S&P 500 stocks, built with React and FastAPI. Features the "Silent Luxury" design system - a sophisticated dark interface for serious traders.

## Quick Start

### Option 1: Run with batch script
```bash
start.bat
```

### Option 2: Manual start

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Open:** http://localhost:3000

## Architecture

```
backend/
  main.py           # FastAPI with yfinance integration
  requirements.txt  # Python dependencies

frontend/
  src/
    pages/
      Dashboard.jsx     # Main watchlist view
      StockDetail.jsx   # Individual stock analysis
      Models.jsx        # Model performance comparison
    components/
      Layout.jsx        # Sidebar navigation
      VolatilityChart.jsx
      PriceChart.jsx
      MetricCard.jsx
      PredictionTable.jsx
    hooks/
      api.js            # Data fetching (mock for now)
```

## Features

- **Dashboard**: S&P 500 watchlist with predicted volatility
- **Stock Detail**: 90-day price/volatility charts, technical indicators
- **Model Comparison**: XGBoost vs Random Forest vs Linear Regression vs Baseline
- **Silent Luxury Design**: Midnight color palette, editorial typography, glassmorphism

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stocks` | List S&P 500 stocks with predictions |
| `GET /api/stock/{ticker}/history` | Historical price + volatility data |
| `GET /api/stock/{ticker}/predictions` | Next-day RV predictions |
| `GET /api/metrics` | Model performance metrics |

## Design System

**Colors:**
- Surface Base: `#121315`
- Primary (Emerald): `#00FF94`
- Secondary (Rose): `#B00038`

**Typography:**
- Editorial: Newsreader (headlines)
- Technical: Inter (body)
- Data: Space Grotesk (numbers)

## Tech Stack

- **Backend**: FastAPI, yfinance, pandas, numpy
- **Frontend**: React, Tailwind CSS, Recharts
- **Design**: Custom "Silent Luxury" system
