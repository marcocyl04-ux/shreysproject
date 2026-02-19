# Predicting Next-Day Stock Volatility Using Market Data and News Sentiment



## 1. Project Description & Motivation

Financial markets are highly sensitive to both quantitative market signals and qualitative information such as news. Traders, hedge funds, and quantitative researchers attempt to predict volatility because it is directly tied to risk management, derivative pricing, and trading strategy performance.

The goal of this project is to build a predictive model that estimates **next-day realized volatility** of selected S&P 500 stocks using:

- Historical price and volume data  
- Technical indicators  
- News sentiment extracted from financial headlines  

This project follows the full data science lifecycle: data collection from financial APIs and news sources, data cleaning and preprocessing, feature extraction (technical and sentiment features), exploratory data visualization, and model training and evaluation.

The project aims to evaluate whether incorporating news sentiment improves volatility prediction compared to a clearly defined naive baseline model.



## 2. Target Variable Definition

Next-day realized volatility will be approximated using **squared daily log returns**, a commonly used proxy in financial econometrics when only daily price data is available.

### Daily Log Return

The daily log return is defined as:

rₜ = log(Pₜ / Pₜ₋₁)

Where:

- **Pₜ** = Adjusted closing price of the stock on day *t*  
- **Pₜ₋₁** = Adjusted closing price of the stock on the previous trading day  
- **rₜ** = Daily log return on day *t*  

Log returns are used instead of simple returns because they are time-additive and better suited for financial modeling.



### Realized Volatility Proxy

The realized volatility proxy is defined as:

RVₜ = rₜ²

Where:

- **RVₜ** = Realized volatility proxy on day *t*  
- Squaring removes the direction of returns and captures the magnitude of price fluctuations  

Squared returns are widely used as a volatility proxy because volatility measures variability, and larger price movements are emphasized.



### Prediction Target

The model’s prediction target is:

RVₜ₊₁

Where:

- **RVₜ₊₁** = Next-day realized volatility  

The objective is to predict tomorrow’s volatility using only information available up to time *t*, ensuring no forward-looking bias.



## 3. Project Goals

### Primary Goal

Successfully predict next-day realized volatility of selected S&P 500 stocks using historical market data and news sentiment features, achieving lower **Mean Squared Error (MSE)** than a clearly defined naive baseline.

### Specific and Measurable Objectives

- Collect at least 2 years of historical daily price and volume data  
- Compute realized volatility using squared log returns  
- Extract daily sentiment scores from financial news headlines  
- Engineer technical features including:
  - Rolling volatility  
  - Daily returns  
  - Volume change  
  - Moving averages  
  - RSI  
- Train and compare at least three models:
  - Linear Regression  
  - Random Forest  
  - Gradient Boosting (e.g., XGBoost)  
- Evaluate performance using:
  - Mean Squared Error (MSE)  
  - Mean Absolute Error (MAE)  
  - R² score  
- Compare results against a naive baseline model  



## 4. Baseline Model Definition

The primary naive baseline will be a **persistence model**, defined as:

RV̂ₜ₊₁ = RVₜ

Meaning: tomorrow’s volatility is predicted to be equal to today’s volatility.

This is a strong and widely used financial benchmark because volatility exhibits persistence over time.

All machine learning models will be evaluated relative to this baseline, and improvement will be reported as percentage reduction in MSE compared to the naive model.



## 5. Data Collection Plan

### 5.1 Market Data

- **Source:** Yahoo Finance (via `yfinance` Python library)  
  https://finance.yahoo.com/  
  https://pypi.org/project/yfinance/  

- **Data Collected:**  
  - Open, High, Low, Close prices  
  - Adjusted Close prices  
  - Volume  
  - At least 2 years of historical daily data  

- **Method:**  
  API-based data retrieval using Python scripts. Data will be stored locally in structured CSV format. Collection will be reproducible via a Makefile command.



### 5.2 News Data

- **Source Options:**  
  - NewsAPI — https://newsapi.org/  
  - Yahoo Finance News Feed — https://finance.yahoo.com/  
  - Financial RSS feeds (e.g., Reuters or Bloomberg if accessible)  

- **Data Collected:**  
  - Headline text  
  - Publication timestamp  
  - Associated stock ticker (if available)  

- **Method:**  
  API requests or structured scraping. Headlines will be grouped by trading day. Sentiment scores will be computed using:

  - VADER (NLTK sentiment analyzer)  
  - FinBERT (financial-domain transformer model)  

  Daily aggregated sentiment metrics (mean sentiment, article count, sentiment dispersion) will be created.



### 5.3 S&P 500 Stock List

- **Source:**  
  Wikipedia S&P 500 list  
  https://en.wikipedia.org/wiki/List_of_S%26P_500_companies  

This list will be used to select representative stocks for analysis.



### 5.4 Data Integration

Market data and sentiment data will be merged on a daily time index. Care will be taken to:

- Avoid forward-looking bias  
- Ensure proper time alignment (no future information leakage)  
- Handle missing data appropriately  



## 6. Project Timeline (8 Weeks)

- **Weeks 1–2:** Repository setup, market data collection pipeline, initial news data collection, and exploratory analysis  
- **Weeks 3–4:** Data cleaning, technical indicator computation, sentiment scoring pipeline implementation, dataset merging, and preliminary visualizations  
- **Weeks 5–6:** Baseline model implementation, training of Linear Regression, Random Forest, and Gradient Boosting models, and performance evaluation  
- **Week 7:** Feature importance analysis, error analysis, and model refinement  
- **Week 8:** Final visualizations, README completion, testing and GitHub workflow setup, and presentation recording  



## 7. Fallback Plan (Scope Control)

If incorporating news sentiment proves too complex within the project timeline, the scope will pivot to predicting next-day volatility using only market-derived technical features.

This ensures:

- The same dataset can be reused  
- The modeling pipeline remains intact  
- The project remains within the original volatility forecasting framework  

This avoids restarting the project mid-semester while preserving analytical depth.



## 8. Expected Deliverables

- Reproducible data collection scripts  
- Cleaned and processed datasets  
- Feature engineering pipeline  
- Clearly defined naive baseline model  
- Trained machine learning models  
- Evaluation metrics and baseline comparison  
- Feature importance analysis  
- Clear data visualizations  
- GitHub workflow for automated testing  
- Makefile for reproducibility  



## 9. Alternative / Backup Project Idea: FitRec Gym Occupancy Prediction

As a backup, I am considering a project focused on **predicting gym occupancy at FitRec (BU’s fitness center)**. Instead of simply analyzing when the gym is busy, the project would be predictive, analytical, and decision-oriented.

### Proposed Approach

- Build a predictive model of gym occupancy using:
  - Temporal features (time of day, day of week)  
  - Environmental signals (weather)  
  - Academic signals (midterms, holidays)  

- Analyze the **relative importance of contextual features** to understand what drives gym attendance.

### Optional Extensions

1. **Forecasting Component:** Predict tomorrow’s gym busyness using time-series models.  
2. **Optimization Component:** Recommend the best time to go given user constraints, creating a personalized gym schedule.  
3. **Causal Insight Questions:**
   - Does bad weather increase indoor gym demand?  
   - Do midterm or finals weeks spike attendance?  

This backup project follows the full data science lifecycle: data collection, cleaning, feature engineering, visualization, modeling, evaluation, and optional decision-support analysis.
