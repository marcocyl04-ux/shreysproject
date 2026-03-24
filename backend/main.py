from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = FastAPI(title="Volatility Terminal API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class StockData(BaseModel):
    ticker: str
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    return_val: float
    rv: float

class Prediction(BaseModel):
    ticker: str
    date: str
    actual_rv: Optional[float]
    predicted_rv: float
    baseline_rv: float
    sentiment_score: Optional[float]

class ModelMetrics(BaseModel):
    model_name: str
    mse: float
    mae: float
    r2: float
    improvement_vs_baseline: float

class StockInfo(BaseModel):
    ticker: str
    name: str
    sector: str
    current_price: float
    predicted_volatility: float
    trend: str

# Cache for stock data
_data_cache = {}

@app.get("/")
def root():
    return {"message": "Volatility Terminal API", "version": "1.0.0"}

@app.get("/api/stocks", response_model=List[StockInfo])
def get_stocks():
    """Get list of S&P 500 stocks with current predictions"""
    # Sample S&P 500 tickers for demo
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "JPM", "V", "WMT"]
    
    stocks = []
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period="5d")
            
            if len(hist) > 0:
                current_price = hist['Close'].iloc[-1]
                returns = np.log(hist['Close'] / hist['Close'].shift(1)).dropna()
                current_rv = returns.iloc[-1] ** 2 if len(returns) > 0 else 0
                
                # Simple prediction (persistence model for now)
                predicted_vol = current_rv * 100  # Scale for display
                
                trend = "up" if len(hist) > 1 and hist['Close'].iloc[-1] > hist['Close'].iloc[-2] else "down"
                
                stocks.append(StockInfo(
                    ticker=ticker,
                    name=info.get('longName', ticker),
                    sector=info.get('sector', 'Unknown'),
                    current_price=round(current_price, 2),
                    predicted_volatility=round(predicted_vol * 100, 2),  # As percentage
                    trend=trend
                ))
        except Exception as e:
            continue
    
    return stocks

@app.get("/api/stock/{ticker}/history")
def get_stock_history(ticker: str, period: str = "1y"):
    """Get historical data with volatility calculations"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period=period)
        
        # Calculate returns and realized volatility
        data['Returns'] = np.log(data['Close'] / data['Close'].shift(1))
        data['RV'] = data['Returns'] ** 2
        
        # Technical indicators
        data['MA20'] = data['Close'].rolling(window=20).mean()
        data['MA50'] = data['Close'].rolling(window=50).mean()
        data['RSI'] = calculate_rsi(data['Close'])
        data['Volatility_20d'] = data['Returns'].rolling(window=20).std() * np.sqrt(252)
        
        # Prepare response
        result = []
        for idx, row in data.dropna().iterrows():
            result.append({
                "date": idx.strftime("%Y-%m-%d"),
                "open": round(row['Open'], 2),
                "high": round(row['High'], 2),
                "low": round(row['Low'], 2),
                "close": round(row['Close'], 2),
                "volume": int(row['Volume']),
                "return_val": round(row['Returns'], 6),
                "rv": round(row['RV'], 8),
                "ma20": round(row['MA20'], 2),
                "ma50": round(row['MA50'], 2),
                "rsi": round(row['RSI'], 2),
                "volatility_20d": round(row['Volatility_20d'] * 100, 2)
            })
        
        return {
            "ticker": ticker,
            "period": period,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/{ticker}/predictions")
def get_predictions(ticker: str):
    """Get volatility predictions for a stock"""
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="3mo")
        
        # Calculate realized volatility
        data['Returns'] = np.log(data['Close'] / data['Close'].shift(1))
        data['RV'] = data['Returns'] ** 2
        data['RV_t+1'] = data['RV'].shift(-1)
        data['Baseline'] = data['RV']  # Persistence model
        
        # Simple linear model prediction
        data['Predicted'] = data['RV'] * 0.8 + data['RV'].rolling(5).mean() * 0.2
        
        predictions = []
        for idx, row in data.dropna().iterrows():
            predictions.append({
                "date": idx.strftime("%Y-%m-%d"),
                "actual_rv": round(row['RV_t+1'] * 10000, 4) if not pd.isna(row['RV_t+1']) else None,
                "predicted_rv": round(row['Predicted'] * 10000, 4),
                "baseline_rv": round(row['Baseline'] * 10000, 4),
                "sentiment_score": round(np.random.normal(0, 0.1), 3)  # Placeholder
            })
        
        return {
            "ticker": ticker,
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics", response_model=List[ModelMetrics])
def get_model_metrics():
    """Get model performance metrics"""
    # Simulated metrics based on project specs
    return [
        ModelMetrics(
            model_name="Persistence (Baseline)",
            mse=0.000184,
            mae=0.0102,
            r2=0.0,
            improvement_vs_baseline=0.0
        ),
        ModelMetrics(
            model_name="Linear Regression",
            mse=0.000156,
            mae=0.0089,
            r2=0.152,
            improvement_vs_baseline=15.2
        ),
        ModelMetrics(
            model_name="Random Forest",
            mse=0.000138,
            mae=0.0078,
            r2=0.248,
            improvement_vs_baseline=24.8
        ),
        ModelMetrics(
            model_name="XGBoost + Sentiment",
            mse=0.000127,
            mae=0.0072,
            r2=0.308,
            improvement_vs_baseline=30.8
        )
    ]

@app.get("/api/sentiment/{ticker}")
def get_sentiment(ticker: str):
    """Get news sentiment for a stock"""
    # Placeholder - would connect to NewsAPI in production
    return {
        "ticker": ticker,
        "sentiment_score": round(np.random.normal(0.1, 0.2), 3),
        "article_count": np.random.randint(5, 50),
        "sentiment_trend": np.random.choice(["positive", "neutral", "negative"]),
        "last_updated": datetime.now().isoformat()
    }

def calculate_rsi(prices, period=14):
    """Calculate RSI technical indicator"""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
