from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import xgboost as xgb
import os

app = FastAPI(title="Trading Dashboard API", version="1.0.0")

# CORS for GitHub Pages frontend - MUST be first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CORS headers to all responses
@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Data cache
fetcher_cache = {}
fetcher_cache_time = {}
CACHE_DURATION = 900  # 15 minutes

class DataFetcher:
    def get_stock_data(self, ticker: str, period: str = "1y"):
        cache_key = f"{ticker}_{period}"
        now = datetime.now()
        
        if cache_key in fetcher_cache:
            if (now - fetcher_cache_time[cache_key]).seconds < CACHE_DURATION:
                return fetcher_cache[cache_key]
        
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period=period)
            if df.empty:
                raise ValueError(f"No data found for {ticker}")
            fetcher_cache[cache_key] = df
            fetcher_cache_time[cache_key] = now
            return df
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))
    
    def get_current_price(self, ticker: str):
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="2d")
            if len(hist) >= 2:
                current = hist["Close"].iloc[-1]
                previous = hist["Close"].iloc[-2]
                change_pct = ((current - previous) / previous) * 100
            else:
                current = hist["Close"].iloc[-1] if len(hist) > 0 else 0
                change_pct = 0
            return {
                "ticker": ticker,
                "current_price": round(current, 2),
                "change_pct": round(change_pct, 2),
                "last_updated": datetime.now().isoformat()
            }
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))

fetcher = DataFetcher()

class FeatureEngineer:
    @staticmethod
    def add_features(df):
        df = df.copy()
        df["Returns_1d"] = df["Close"].pct_change()
        df["Returns_5d"] = df["Close"].pct_change(5)
        df["Returns_10d"] = df["Close"].pct_change(10)
        df["Returns_20d"] = df["Close"].pct_change(20)
        df["SMA_20"] = df["Close"].rolling(window=20).mean()
        df["SMA_50"] = df["Close"].rolling(window=50).mean()
        df["EMA_12"] = df["Close"].ewm(span=12).mean()
        df["EMA_26"] = df["Close"].ewm(span=26).mean()
        df["BB_Middle"] = df["Close"].rolling(window=20).mean()
        bb_std = df["Close"].rolling(window=20).std()
        df["BB_Upper"] = df["BB_Middle"] + (bb_std * 2)
        df["BB_Lower"] = df["BB_Middle"] - (bb_std * 2)
        df["BB_Width"] = (df["BB_Upper"] - df["BB_Lower"]) / df["BB_Middle"]
        delta = df["Close"].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df["RSI"] = 100 - (100 / (1 + rs))
        df["MACD"] = df["EMA_12"] - df["EMA_26"]
        df["MACD_Signal"] = df["MACD"].ewm(span=9).mean()
        df["MACD_Hist"] = df["MACD"] - df["MACD_Signal"]
        df["Volume_SMA_20"] = df["Volume"].rolling(window=20).mean()
        df["Volume_Ratio"] = df["Volume"] / df["Volume_SMA_20"]
        obv = [0]
        for i in range(1, len(df)):
            if df["Close"].iloc[i] > df["Close"].iloc[i-1]:
                obv.append(obv[-1] + df["Volume"].iloc[i])
            elif df["Close"].iloc[i] < df["Close"].iloc[i-1]:
                obv.append(obv[-1] - df["Volume"].iloc[i])
            else:
                obv.append(obv[-1])
        df["OBV"] = obv
        high_low = df["High"] - df["Low"]
        high_close = np.abs(df["High"] - df["Close"].shift())
        low_close = np.abs(df["Low"] - df["Close"].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        df["ATR"] = true_range.rolling(14).mean()
        df["ATR_Pct"] = df["ATR"] / df["Close"] * 100
        df["Volatility_20d"] = df["Returns_1d"].rolling(window=20).std() * np.sqrt(252)
        return df
    
    @staticmethod
    def prepare_features(df):
        feature_cols = [
            "Returns_1d", "Returns_5d", "Returns_10d", "Returns_20d",
            "SMA_20", "SMA_50", "EMA_12", "EMA_26",
            "BB_Width", "RSI", "MACD", "MACD_Signal", "MACD_Hist",
            "Volume_Ratio", "OBV", "ATR_Pct", "Volatility_20d"
        ]
        return df[feature_cols].dropna()

class LinearRegressionModel:
    def predict(self, df, days_ahead=1):
        df_features = FeatureEngineer.add_features(df)
        df_features = FeatureEngineer.prepare_features(df_features)
        if len(df_features) < 30:
            return {"error": "Insufficient data"}
        df_features["Target"] = df["Close"].shift(-days_ahead) / df["Close"] - 1
        df_features = df_features.dropna()
        train_data = df_features.tail(90)
        X = train_data.drop("Target", axis=1)
        y = train_data["Target"]
        model = LinearRegression()
        model.fit(X, y)
        latest_features = X.iloc[-1:].values
        predicted_return = model.predict(latest_features)[0]
        predictions = model.predict(X)
        residuals = y - predictions
        std_error = np.sqrt(np.mean(residuals ** 2))
        current_price = df["Close"].iloc[-1]
        predicted_price = current_price * (1 + predicted_return)
        confidence_range = 1.96 * std_error * current_price
        r2 = r2_score(y, predictions)
        if predicted_return > 0.01:
            trend = "upward"
        elif predicted_return < -0.01:
            trend = "downward"
        else:
            trend = "sideways"
        return {
            "predicted_price": round(predicted_price, 2),
            "predicted_return": round(predicted_return * 100, 2),
            "confidence_lower": round(predicted_price - confidence_range, 2),
            "confidence_upper": round(predicted_price + confidence_range, 2),
            "trend": trend,
            "r2_score": round(r2, 3),
            "days_ahead": days_ahead
        }

class XGBoostModel:
    def __init__(self):
        self.model = None
        self.feature_names = None
        self.is_trained = False
    
    def train(self, df):
        df_features = FeatureEngineer.add_features(df)
        df_features = FeatureEngineer.prepare_features(df_features)
        future_return = df["Close"].shift(-7) / df["Close"] - 1
        df_features["Target"] = future_return.map(
            lambda x: 0 if x < -0.02 else (2 if x > 0.02 else 1)
        )
        df_features = df_features.dropna()
        if len(df_features) < 100:
            return False
        X = df_features.drop("Target", axis=1)
        y = df_features["Target"]
        self.feature_names = X.columns.tolist()
        self.model = xgb.XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
        self.model.fit(X, y)
        self.is_trained = True
        return True
    
    def predict(self, df):
        if not self.is_trained:
            if not self.train(df):
                return {"error": "Insufficient data"}
        df_features = FeatureEngineer.add_features(df)
        df_features = FeatureEngineer.prepare_features(df_features)
        if len(df_features) == 0:
            return {"error": "No valid features"}
        latest = df_features.iloc[-1:][self.feature_names]
        probs = self.model.predict_proba(latest)[0]
        importance = dict(zip(self.feature_names, self.model.feature_importances_.tolist()))
        top_features = sorted(importance.items(), key=lambda x: x[1], reverse=True)[:5]
        expected_return = probs[0] * -0.03 + probs[1] * 0 + probs[2] * 0.03
        max_prob = max(probs)
        confidence = "high" if max_prob > 0.5 else ("medium" if max_prob > 0.35 else "low")
        return {
            "direction_probabilities": {"down": round(probs[0], 3), "sideways": round(probs[1], 3), "up": round(probs[2], 3)},
            "expected_return_7d": round(expected_return * 100, 2),
            "confidence": confidence,
            "top_features": [{"feature": f, "importance": round(i, 3)} for f, i in top_features]
        }

class MonteCarloModel:
    def simulate(self, df, days=7, simulations=1000):
        prices = df["Close"].values
        if len(prices) < 30:
            return {"error": "Insufficient data"}
        returns = np.diff(prices) / prices[:-1]
        current_price = prices[-1]
        mu = np.mean(returns)
        sigma = np.std(returns)
        dt = 1
        paths = np.zeros((simulations, days + 1))
        paths[:, 0] = current_price
        for t in range(1, days + 1):
            Z = np.random.standard_normal(simulations)
            paths[:, t] = paths[:, t-1] * np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z)
        percentiles = {"p5": [], "p25": [], "p50": [], "p75": [], "p95": []}
        for t in range(days + 1):
            percentiles["p5"].append(float(np.percentile(paths[:, t], 5)))
            percentiles["p25"].append(float(np.percentile(paths[:, t], 25)))
            percentiles["p50"].append(float(np.percentile(paths[:, t], 50)))
            percentiles["p75"].append(float(np.percentile(paths[:, t], 75)))
            percentiles["p95"].append(float(np.percentile(paths[:, t], 95)))
        final_prices = paths[:, -1]
        var_95 = (np.percentile(final_prices, 5) - current_price) / current_price * 100
        sample_indices = np.random.choice(simulations, min(100, simulations), replace=False)
        sample_paths = paths[sample_indices].tolist()
        return {
            "current_price": round(current_price, 2),
            "simulations": simulations,
            "days": days,
            "paths": sample_paths,
            "percentiles": {k: [round(v, 2) for v in vals] for k, vals in percentiles.items()},
            "var_95": round(var_95, 2),
            "drift": round(mu * 100, 4),
            "volatility": round(sigma * np.sqrt(252) * 100, 2)
        }

# Initialize models
lr_model = LinearRegressionModel()
xgb_model = XGBoostModel()
mc_model = MonteCarloModel()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models": {"linear_regression": True, "xgboost": True, "monte_carlo": True}
    }

@app.get("/api/stock/{ticker}")
def get_stock_prediction(ticker: str):
    current_info = fetcher.get_current_price(ticker)
    df = fetcher.get_stock_data(ticker, period="1y")
    lr_1d = lr_model.predict(df, days_ahead=1)
    lr_7d = lr_model.predict(df, days_ahead=7)
    xgb_pred = xgb_model.predict(df)
    mc_pred = mc_model.simulate(df, days=7, simulations=1000)
    return {
        "ticker": ticker,
        "current_price": current_info["current_price"],
        "change_pct": current_info["change_pct"],
        "last_updated": datetime.now().isoformat(),
        "linear_regression": {"next_day": lr_1d, "next_7_days": lr_7d},
        "xgboost": xgb_pred,
        "monte_carlo": mc_pred
    }

@app.get("/api/stock/{ticker}/history")
def get_stock_history(ticker: str, period: str = "1y"):
    df = fetcher.get_stock_data(ticker, period=period)
    history = []
    for date, row in df.iterrows():
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
            "volume": int(row["Volume"])
        })
    return {"ticker": ticker, "period": period, "data": history}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)