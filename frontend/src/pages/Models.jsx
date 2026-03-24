import React, { useState } from 'react'
import { useApi } from '../hooks/api'
import ConnectionPanel from '../components/ConnectionPanel'
import StockSearch from '../components/StockSearch'
import LinearRegressionCard from '../components/LinearRegressionCard'
import XGBoostCard from '../components/XGBoostCard'
import MonteCarloCard from '../components/MonteCarloCard'
import { ArrowLeft, TrendingUp, Activity, Brain, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

const Models = () => {
  const [selectedStock, setSelectedStock] = useState(null)
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { connected, fetchStockPrediction } = useApi()

  const handleSearch = async (ticker) => {
    if (!connected) {
      alert('Please connect to the backend first')
      return
    }
    
    setLoading(true)
    setSelectedStock(ticker)
    try {
      const data = await fetchStockPrediction(ticker)
      setStockData(data)
    } catch (error) {
      console.error('Failed to fetch stock data:', error)
      alert(`Failed to fetch data for ${ticker}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/" 
          className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Link>
        <div>
          <h1 className="font-editorial text-4xl text-white">ML Predictions</h1>
          <p className="text-white/50 mt-1">Real-time stock analysis with machine learning</p>
        </div>
      </div>

      {/* Connection Panel */}
      <ConnectionPanel />

      {/* Stock Search */}
      {connected && (
        <StockSearch onSearch={handleSearch} loading={loading} />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-white/40 flex items-center gap-2">
            <Activity className="w-5 h-5 animate-spin" />
            Analyzing {selectedStock}...
          </div>
        </div>
      )}

      {/* Results */}
      {stockData && !loading && (
        <div className="space-y-6">
          {/* Stock Header */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-data text-4xl font-semibold text-white">{stockData.ticker}</h2>
                <p className="text-white/50 mt-1">Last updated: {new Date(stockData.last_updated).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/50">Current Price</p>
                <p className="text-4xl font-data text-white">${stockData.current_price?.toFixed(2)}</p>
                <p className={`text-sm ${stockData.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData.change_pct >= 0 ? '+' : ''}{stockData.change_pct?.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            <LinearRegressionCard data={stockData.linear_regression?.next_day} />
            <XGBoostCard data={stockData.xgboost} />
            <MonteCarloCard data={stockData.monte_carlo} />
          </div>

          {/* 7-Day Linear Regression */}
          {stockData.linear_regression?.next_7_days && (
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-editorial text-xl text-white/90 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                7-Day Linear Regression Forecast
              </h3>
              <LinearRegressionCard data={stockData.linear_regression.next_7_days} />
            </div>
          )}

          {/* Model Info */}
          <div className="grid grid-cols-3 gap-6">
            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h4 className="text-lg font-medium text-white/90">Linear Regression</h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Uses technical indicators (RSI, MACD, Bollinger Bands, moving averages) 
                to predict price returns. Provides confidence intervals based on historical 
                prediction errors.
              </p>
            </div>

            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-green-400" />
                <h4 className="text-lg font-medium text-white/90">XGBoost Ensemble</h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Gradient boosting classifier that predicts price direction (up/down/sideways) 
                with probability scores. Identifies the most important features for each prediction.
              </p>
            </div>

            <div className="glass-panel rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <h4 className="text-lg font-medium text-white/90">Monte Carlo</h4>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Simulates 1000 price paths using Geometric Brownian Motion. Calculates 
                percentiles, Value at Risk (VaR), and expected returns based on historical 
                volatility and drift.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!stockData && !loading && connected && (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <Activity className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white/60 mb-2">Ready to Analyze</h3>
          <p className="text-white/40">Search for a stock above to see ML predictions</p>
        </div>
      )}

      {/* Not Connected State */}
      {!connected && (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-medium text-white/60 mb-2">Backend Not Connected</h3>
          <p className="text-white/40 max-w-md mx-auto">
            Please connect to the Colab backend using the connection panel above. 
            Run the notebook and paste the ngrok URL.
          </p>
        </div>
      )}
    </div>
  )
}

export default Models