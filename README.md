# Trading Dashboard

A live stock prediction dashboard using Linear Regression, XGBoost, and Monte Carlo simulation models.

**Live URL:** https://marcocyl04-ux.github.io/shreysproject/

---

## How to Use

### Step 1: Open the Dashboard
Go to https://marcocyl04-ux.github.io/shreysproject/

You should see the Trading Dashboard interface with a "Backend Connection" panel.

### Step 2: Start the Backend (Colab)
1. Open the Colab notebook: **trading_dashboard.ipynb**
   - You can upload it to Google Colab or run it locally
2. Click **Runtime → Run all** (or Ctrl+F9)
3. Wait for installations and server startup (~1 minute)
4. Look for the output in the last cell showing:
   ```
   ============================================================
   🚀 SERVER READY!
   ============================================================
   
   Public URL: https://abc123.ngrok.io
   
   COPY THIS URL INTO THE FRONTEND
   ```

### Step 3: Connect
1. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
2. Paste it into the "ngrok URL from Colab" field in the dashboard
3. Click **Connect**
4. You should see "Connected to backend" in green

### Step 4: Analyze Stocks
1. Enter a stock ticker (e.g., `AAPL`, `TSLA`, `NVDA`) in the search box
2. Click **Analyze**
3. View predictions from all three models:
   - **Linear Regression**: Next-day and 7-day price predictions with confidence intervals
   - **XGBoost**: Direction probabilities (up/down/sideways) with feature importance
   - **Monte Carlo**: Risk simulation showing possible price paths and VaR

---

## Features

- **Live Data**: Real-time prices from Yahoo Finance
- **Three ML Models**:
  - Linear Regression (trend prediction)
  - XGBoost (ensemble classification)
  - Monte Carlo (risk simulation)
- **Watchlist**: Save stocks for quick access
- **Persistent Storage**: Watchlist and backend URL are saved locally

---

## Troubleshooting

### "Backend Not Connected"
- Make sure you've started the Colab notebook
- Check that the ngrok URL is correct (copy the full URL including `https://`)
- If ngrok shows an error, restart the Colab runtime (Runtime → Restart runtime)

### "Failed to fetch stock data"
- The ticker might not exist
- Yahoo Finance rate limits may apply - wait 30 seconds and try again
- Check that your Colab session is still active

### Colab session expired
- Colab sessions last ~12 hours
- Simply restart the notebook (Runtime → Run all)
- You'll get a new ngrok URL to paste into the dashboard

---

## Models Explained

### Linear Regression
- **Purpose**: Predict price trend based on historical patterns
- **Output**: Predicted price + 95% confidence interval
- **Retraining**: On every request (last 90 days of data)

### XGBoost
- **Purpose**: Classify direction (up/down/sideways) using multiple features
- **Features**: RSI, MACD, Bollinger Bands, volume, momentum
- **Output**: Probability distribution across three directions
- **Retraining**: Weekly (when notebook restarts)

### Monte Carlo
- **Purpose**: Simulate risk and potential price paths
- **Method**: Geometric Brownian Motion
- **Output**: 1000 simulated paths, percentiles, Value at Risk (VaR)

---

## Technical Details

- **Frontend**: React + Vite + Tailwind CSS (hosted on GitHub Pages)
- **Backend**: FastAPI + Python (runs on Google Colab)
- **Tunnel**: ngrok (exposes local server to internet)
- **Data Source**: Yahoo Finance via `yfinance`
- **ML Libraries**: scikit-learn, xgboost

---

## Files in This Repo

```
shreysproject/
├── trading_dashboard.ipynb    # Colab backend - run this first
├── frontend/                  # React source code (dev use)
├── docs/                      # Built frontend (GitHub Pages)
│   ├── index.html
│   └── assets/
└── README.md                  # This file
```

---

## Notes

- **Free tier limitations**: ngrok may have rate limits (40 requests/minute)
- **Session timeout**: Colab sessions expire after ~12 hours of inactivity
- **Data freshness**: Prices are cached for 15 minutes to avoid rate limits
- **No financial advice**: This is for educational purposes only

---

**Built by:** [Your names here]
**Date:** March 2026