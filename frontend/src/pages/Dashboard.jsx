import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/api'
import ConnectionPanel from '../components/ConnectionPanel'
import StockSearch from '../components/StockSearch'
import Watchlist from '../components/Watchlist'
import LinearRegressionCard from '../components/LinearRegressionCard'
import XGBoostCard from '../components/XGBoostCard'
import MonteCarloCard from '../components/MonteCarloCard'
import { CircleNotch, Warning, TrendUp, CurrencyDollar, Activity } from 'phosphor-react'

const Dashboard = () => {
  const { connected, loading, fetchStockPrediction, fetchStockHistory } = useApi()
  const [selectedTicker, setSelectedTicker] = useState(null)
  const [stockData, setStockData] = useState(null)
  const [watchlist, setWatchlist] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('watchlist')
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse watchlist')
      }
    }
  }, [])

  // Save watchlist when it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const handleSearch = async (ticker) => {
    if (!connected) {
      setError('Please connect to the backend first')
      return
    }

    setSearchLoading(true)
    setError(null)
    setSelectedTicker(ticker)

    try {
      const data = await fetchStockPrediction(ticker)
      setStockData(data)

      // Add to watchlist if not already there
      setWatchlist(prev => {
        if (prev.find(s => s.ticker === ticker)) return prev
        return [...prev, {
          ticker: data.ticker,
          current_price: data.current_price,
          change_pct: data.change_pct,
          predicted_return: data.linear_regression?.next_day?.predicted_return
        }]
      })
    } catch (err) {
      setError(err.message || 'Failed to fetch stock data')
      setStockData(null)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectFromWatchlist = (ticker) => {
    handleSearch(ticker)
  }

  const handleRemoveFromWatchlist = (ticker) => {
    setWatchlist(prev => prev.filter(s => s.ticker !== ticker))
    if (selectedTicker === ticker) {
      setSelectedTicker(null)
      setStockData(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trading Dashboard</h1>
                <p className="text-sm text-gray-500">ML-Powered Stock Predictions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Connection Panel */}
        <ConnectionPanel />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <Warning className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Not Connected Warning */}
        {!connected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">⚠️ Backend Not Connected</p>
            <p className="text-sm mt-1">
              Open the Colab notebook, run all cells, and paste the ngrok URL above to start using the dashboard.
            </p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-4 space-y-6">
            <StockSearch onSearch={handleSearch} loading={searchLoading} />
            <Watchlist 
              stocks={watchlist} 
              onSelect={handleSelectFromWatchlist}
              onRemove={handleRemoveFromWatchlist}
            />
          </div>

          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {searchLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
                <CircleNotch className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading predictions...</p>
              </div>
            ) : stockData ? (
              <>
                {/* Stock Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-700">{stockData.ticker}</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">${stockData.current_price}</h2>
                        <p className={`text-lg font-medium ${
                          stockData.change_pct > 0 ? 'text-green-600' : 
                          stockData.change_pct < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {stockData.change_pct > 0 ? '+' : ''}{stockData.change_pct}% today
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Last updated</p>
                      <p>{new Date(stockData.last_updated).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                {/* Model Predictions */}
                <div className="grid grid-cols-2 gap-6">
                  <LinearRegressionCard data={stockData.linear_regression?.next_day} />
                  <LinearRegressionCard data={stockData.linear_regression?.next_7_days} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <XGBoostCard data={stockData.xgboost} />
                  <MonteCarloCard data={stockData.monte_carlo} />
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Stock Selected</h3>
                <p className="text-gray-500">
                  Search for a stock ticker to see ML predictions from Linear Regression, XGBoost, and Monte Carlo models.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard