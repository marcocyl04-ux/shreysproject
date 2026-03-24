const API_BASE = 'http://localhost:8000/api'

export const fetchStocks = async () => {
  // Simulated data for now - would connect to real API
  return [
    { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", current_price: 178.35, predicted_volatility: 24.5, trend: "up" },
    { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", current_price: 412.20, predicted_volatility: 18.2, trend: "up" },
    { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology", current_price: 141.80, predicted_volatility: 22.1, trend: "down" },
    { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer", current_price: 178.15, predicted_volatility: 28.3, trend: "up" },
    { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotive", current_price: 175.40, predicted_volatility: 45.7, trend: "down" },
    { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Technology", current_price: 890.50, predicted_volatility: 35.2, trend: "up" },
    { ticker: "META", name: "Meta Platforms", sector: "Technology", current_price: 505.20, predicted_volatility: 26.8, trend: "up" },
    { ticker: "JPM", name: "JPMorgan Chase", sector: "Finance", current_price: 198.60, predicted_volatility: 15.4, trend: "up" },
    { ticker: "V", name: "Visa Inc.", sector: "Finance", current_price: 278.90, predicted_volatility: 12.3, trend: "down" },
    { ticker: "WMT", name: "Walmart Inc.", sector: "Retail", current_price: 168.40, predicted_volatility: 14.7, trend: "up" },
  ]
}

export const fetchMetrics = async () => {
  return [
    { model_name: "Persistence (Baseline)", mse: 0.000184, mae: 0.0102, r2: 0.0, improvement_vs_baseline: 0.0 },
    { model_name: "Linear Regression", mse: 0.000156, mae: 0.0089, r2: 0.152, improvement_vs_baseline: 15.2 },
    { model_name: "Random Forest", mse: 0.000138, mae: 0.0078, r2: 0.248, improvement_vs_baseline: 24.8 },
    { model_name: "XGBoost + Sentiment", mse: 0.000127, mae: 0.0072, r2: 0.308, improvement_vs_baseline: 30.8 },
  ]
}

export const fetchStockHistory = async (ticker) => {
  // Generate 90 days of mock data
  const data = []
  let price = 100 + Math.random() * 200
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 90)
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    const change = (Math.random() - 0.5) * 0.04
    price = price * (1 + change)
    
    const rv = Math.pow(change, 2)
    
    data.push({
      date: date.toISOString().split('T')[0],
      close: price,
      rv: rv * 10000,
      predicted_rv: rv * 10000 * (0.9 + Math.random() * 0.2),
      ma20: price * (1 + (Math.random() - 0.5) * 0.02),
      rsi: 30 + Math.random() * 40,
      volatility_20d: Math.abs(change) * 100 * Math.sqrt(252)
    })
  }
  
  return { ticker, data }
}

export const fetchPredictions = async (ticker) => {
  const data = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    const actual = i < 20 ? Math.random() * 50 : null
    const predicted = Math.random() * 45 + 5
    
    data.push({
      date: date.toISOString().split('T')[0],
      actual_rv: actual,
      predicted_rv: predicted,
      baseline_rv: predicted * (0.9 + Math.random() * 0.2),
      sentiment_score: (Math.random() - 0.5) * 0.4
    })
  }
  
  return { ticker, predictions: data }
}
