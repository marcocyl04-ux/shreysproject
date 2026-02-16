# Predicting Next-Day Stock Volatility Using Market Data and News Sentiment



## 1. Project Description & Motivation

Financial markets are highly sensitive to both quantitative market signals and qualitative information such as news. Traders, hedge funds, and quantitative researchers attempt to predict volatility because it is directly tied to risk, derivative pricing, and trading strategy performance.

The goal of this project is to build a predictive model that estimates **next-day realized volatility** of selected S&P 500 stocks using historical price and volume data, technical indicators, and news sentiment extracted from financial headlines.

This project follows the full data science lifecycle: data collection from financial APIs and news sources, data cleaning and preprocessing, feature extraction (technical and sentiment features), exploratory data visualization, and model training and evaluation.

The project aims to evaluate whether incorporating news sentiment improves volatility prediction compared to a baseline model that only uses historical volatility.



## 2. Project Goals

### Primary Goal

Successfully predict next-day realized volatility of selected S&P 500 stocks using historical market data and news sentiment features, achieving lower **Mean Squared Error (MSE)** than a baseline model that uses only historical volatility.

### Specific and Measurable Objectives

- Collect at least 2 years of historical daily price and volume data.
- Compute realized volatility using rolling window calculations.
- Extract daily sentiment scores from financial news headlines.
- Engineer technical features including rolling volatility, daily returns, volume change, moving averages, and RSI.
- Train and compare at least three models: Linear Regression, Random Forest, and Gradient Boosting (e.g., XGBoost).
- Evaluate performance using MSE, MAE, and R² score.
- Compare results against a naive baseline where tomorrow’s volatility equals today’s volatility.



## 3. Data Collection Plan

### 3.1 Market Data

- **Source:** Yahoo Finance API (via `yfinance` Python library)  
- **Data Collected:** Open, High, Low, Close prices, Volume, Adjusted Close prices, and at least 2 years of historical daily data  
- **Method:** API-based data retrieval using Python scripts. Data will be stored locally in structured CSV format. Collection will be reproducible via a Makefile command.

### 3.2 News Data

- **Source Options:** NewsAPI, Yahoo Finance news feed, or financial news RSS feeds  
- **Data Collected:** Headline text, publication timestamp, and associated stock ticker if available  
- **Method:** API requests or structured scraping. Headlines will be grouped by trading day, and sentiment scores computed using VADER or FinBERT. Daily aggregated sentiment metrics will be created.

### 3.3 Data Integration

Market data and sentiment data will be merged on a daily time index. Care will be taken to:

- Avoid forward-looking bias  
- Ensure proper time alignment  
- Handle missing data appropriately



## 4. Project Timeline (8 Weeks)

- **Weeks 1–2:** Repository setup, market data collection pipeline, initial news data collection, and exploratory analysis.  
- **Weeks 3–4:** Data cleaning, technical indicator computation, sentiment scoring pipeline implementation, dataset merging, and preliminary visualizations.  
- **Weeks 5–6:** Baseline model implementation, training of Linear Regression, Random Forest, and Gradient Boosting models, and performance evaluation.  
- **Week 7:** Feature importance analysis, error analysis, and model refinement.  
- **Week 8:** Final visualizations, README completion, testing and GitHub workflow setup, and presentation recording.



## 5. Fallback Plan (Scope Control)

If incorporating news sentiment proves too complex within the project timeline, the scope will pivot to predicting next-day volatility using only market-derived technical features. This ensures feasibility while still meeting all course requirements.



## 6. Expected Deliverables

- Reproducible data collection scripts  
- Cleaned and processed datasets  
- Feature engineering pipeline  
- Trained machine learning models  
- Evaluation metrics and baseline comparison  
- Clear data visualizations  
- GitHub workflow for automated testing  
- Makefile for reproducibility


## 7. Alternative / Backup Project Idea: FitRec Gym Occupancy Prediction

As a backup, I am considering a project focused on **predicting gym occupancy at FitRec (BU’s fitness center)**. Instead of just analyzing when the gym is busy, the project would be scoped to be more insightful and decision-oriented:

**Proposed Approach:**  
- Build a predictive model of gym occupancy using temporal (time of day, day of week), environmental (weather), and academic (midterms, holidays) signals.  
- Analyze the **relative importance of these contextual features** to understand what drives gym attendance.  

**Optional Extensions:**  
1. **Forecasting Component:** Predict tomorrow’s gym busyness using time-series models.  
2. **Optimization Component:** Recommend the best time to go given user constraints, creating a personalized gym schedule.  
3. **Causal Insight:** Explore questions such as:  
   - Does bad weather increase indoor gym demand?  
   - Do midterm or finals weeks spike attendance?  

This backup project still follows the full data science lifecycle: data collection, cleaning, feature engineering, visualization, modeling, evaluation, and optional decision-support analysis.  

