# Trading Dashboard - Handoff Package

## 📦 What's Included

This package contains everything needed to run the hybrid trading dashboard system:

### 1. Backend (`trading_dashboard.ipynb`)
A complete Google Colab notebook with:
- FastAPI server with CORS enabled
- pyngrok tunnel for public access
- SQLite caching for stock data
- **Linear Regression Model**: Next-day and 7-day price predictions with confidence intervals
- **XGBoost Model**: Direction classification (up/down/sideways) with probabilities and feature importance
- **Monte Carlo Simulation**: 1000 GBM paths with percentiles and VaR
- Real-time data from Yahoo Finance

### 2. Frontend (`frontend/` folder)
React application with:
- ConnectionPanel: Input for ngrok URL
- StockSearch: Ticker search with quick select
- LinearRegressionCard: Shows predictions with confidence intervals
- XGBoostCard: Direction probabilities with feature importance chart
- MonteCarloCard: Simulation paths with percentiles and VaR
- Watchlist: Multiple stock tracking
- useApi hook: Dynamic backend URL management

### 3. GitHub Pages (`docs/` folder)
Built and ready to deploy static site.

---

## 🚀 Quick Start

### For the Friend Using This:

#### Step 1: Open the Frontend
Navigate to:
```
https://shreyas-chickerur.github.io/shreysproject/
```

#### Step 2: Start the Backend
1. Open `trading_dashboard.ipynb` in Google Colab
2. Click **Runtime** → **Run all** (or Ctrl+F9)
3. Wait 2-3 minutes for all cells to execute
4. Look for output like:
   ```
   🚀 SERVER READY!
   Public URL: https://abc123-def.ngrok.io
   ```

#### Step 3: Connect
1. Copy the ngrok URL from Colab
2. Paste into the "Backend Connection" panel on the frontend
3. Click **Connect**
4. Search for stocks and analyze!

---

## 📡 API Endpoints

Once connected, the backend exposes:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with model status |
| `/api/stocks` | GET | List all stocks with predictions |
| `/api/stock/{ticker}` | GET | Full prediction data for ticker |
| `/api/stock/{ticker}/history` | GET | Historical price data |

### Example Response (`/api/stock/AAPL`):
```json
{
  "ticker": "AAPL",
  "current_price": 178.35,
  "change_pct": 1.25,
  "last_updated": "2025-01-15T10:30:00",
  "linear_regression": {
    "next_day": {
      "predicted_price": 180.20,
      "predicted_return": 1.04,
      "confidence_lower": 175.50,
      "confidence_upper": 184.90,
      "trend": "upward",
      "r2_score": 0.152
    },
    "next_7_days": { ... }
  },
  "xgboost": {
    "direction_probabilities": {
      "down": 0.15,
      "sideways": 0.30,
      "up": 0.55
    },
    "expected_return_7d": 2.35,
    "confidence": "medium",
    "top_features": [
      {"feature": "RSI", "importance": 0.25},
      {"feature": "MACD", "importance": 0.18}
    ]
  },
  "monte_carlo": {
    "current_price": 178.35,
    "simulations": 1000,
    "days": 7,
    "paths": [[...], [...]],
    "percentiles": {
      "p5": [175, 174, ...],
      "p50": [178, 179, ...],
      "p95": [181, 184, ...]
    },
    "var_95": -3.2,
    "volatility": 25.4
  }
}
```

---

## 🔧 Technical Details

### Backend Stack
- **Python 3.10+**
- **FastAPI**: Web framework
- **uvicorn**: ASGI server
- **pyngrok**: Public tunneling
- **yfinance**: Market data
- **XGBoost**: Gradient boosting
- **scikit-learn**: Linear regression
- **pandas/numpy**: Data processing
- **SQLite**: Local caching

### Frontend Stack
- **React 18**
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Recharts**: Charts
- **Lucide React**: Icons
- **React Router**: Navigation

---

## 🐛 Troubleshooting

### "Connection failed" error
- Ensure Colab notebook is still running
- Check ngrok URL is copied correctly (include `https://`)
- Re-run the last cell in Colab to get a fresh URL

### "No data found for ticker"
- Verify ticker symbol is valid (e.g., AAPL, MSFT, GOOGL)
- Check Yahoo Finance has data for that symbol

### Models taking too long
- First request trains models (10-20 seconds)
- Subsequent requests use cached models
- SQLite cache expires after 6 hours

### Colab runtime expired
- Runtime expires after ~12 hours of inactivity
- Simply re-run all cells to restart

---

## 📁 File Structure

```
shreysproject/
├── trading_dashboard.ipynb      # ⭐ RUN THIS IN COLAB
├── README.md                     # Instructions
├── HANDOFF.md                    # This file
├── frontend/                     # React source
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConnectionPanel.jsx
│   │   │   ├── StockSearch.jsx
│   │   │   ├── LinearRegressionCard.jsx
│   │   │   ├── XGBoostCard.jsx
│   │   │   ├── MonteCarloCard.jsx
│   │   │   └── Watchlist.jsx
│   │   ├── hooks/
│   │   │   └── api.js
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Models.jsx
│   │       └── StockDetail.jsx
│   └── package.json
└── docs/                         # ⭐ GITHUB PAGES FILES
    ├── index.html
    └── assets/
```

---

## 🔄 Development Workflow

### To modify the frontend:
1. Edit files in `frontend/src/`
2. Run `npm run build` in `frontend/` folder
3. Copy `dist/` contents to `docs/`
4. Commit and push to GitHub

### To modify the backend:
1. Edit `trading_dashboard.ipynb`
2. Re-upload to Colab
3. Share the new notebook link

---

## ⚠️ Important Notes

1. **ngrok URLs change** every time you restart the Colab runtime
2. **Colab runtime expires** after ~12 hours - re-run all cells
3. **Free tier limitations**: ngrok has rate limits for free users
4. **Not financial advice**: This is for educational purposes only

---

## 🎯 Features Summary

✅ **Linear Regression**: Price predictions with 95% confidence intervals  
✅ **XGBoost**: Direction probabilities with top feature importance  
✅ **Monte Carlo**: 1000 simulated price paths with VaR  
✅ **Real-time data**: Yahoo Finance integration  
✅ **Caching**: SQLite cache for performance  
✅ **Responsive UI**: Works on desktop and mobile  
✅ **Easy connection**: Simple ngrok URL paste  

---

## 📞 Support

If something breaks:
1. Check Colab runtime is running
2. Verify ngrok URL is current
3. Check browser console for errors
4. Re-run all Colab cells

---

**Ready to use!** 🚀