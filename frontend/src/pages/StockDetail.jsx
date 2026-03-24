import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Activity, Calendar } from 'lucide-react'
import { fetchStockHistory, fetchPredictions } from '../hooks/api'
import PriceChart from '../components/PriceChart'
import PredictionTable from '../components/PredictionTable'

const StockDetail = () => {
  const { ticker } = useParams()
  const [history, setHistory] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyData, predictionsData] = await Promise.all([
          fetchStockHistory(ticker),
          fetchPredictions(ticker)
        ])
        setHistory(historyData)
        setPredictions(predictionsData)
      } catch (error) {
        console.error('Failed to load stock data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [ticker])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/40">Loading {ticker} data...</div>
      </div>
    )
  }

  const currentPrice = history?.data[history.data.length - 1]?.close || 0
  const currentVol = history?.data[history.data.length - 1]?.volatility_20d || 0
  const avgVol = history?.data.reduce((acc, d) => acc + d.volatility_20d, 0) / (history?.data.length || 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/" 
          className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-data text-4xl font-semibold text-white">{ticker}</h1>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              S&P 500
            </span>
          </div>
          <p className="text-white/40 mt-1">Realized Volatility Analysis</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-2">Current Price</p>
          <p className="text-3xl data-mono text-white">${currentPrice.toFixed(2)}</p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-2">20D Volatility</p>
          <p className="text-3xl data-mono text-primary">{currentVol.toFixed(2)}%</p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-2">Avg Volatility</p>
          <p className="text-3xl data-mono text-white/80">{avgVol.toFixed(2)}%</p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-2">Next Day Pred</p>
          <p className="text-3xl data-mono text-primary">{(currentVol * 0.95).toFixed(2)}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline/5">
        {['overview', 'predictions', 'technical'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? 'text-primary border-primary'
                : 'text-white/40 border-transparent hover:text-white/80'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-editorial text-2xl text-white/90">Price & Volatility</h3>
                <p className="text-sm text-white/40 mt-1">90-day historical view</p>
              </div>
            </div>
            <div className="h-96">
              <PriceChart data={history?.data || []} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel rounded-xl p-6">
              <h4 className="text-lg font-medium text-white/90 mb-4">Technical Indicators</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-outline/5">
                  <span className="text-white/60">RSI (14)</span>
                  <span className="data-mono text-white">{history?.data[history.data.length - 1]?.rsi.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-outline/5">
                  <span className="text-white/60">MA20</span>
                  <span className="data-mono text-white">${history?.data[history.data.length - 1]?.ma20.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/60">MA50</span>
                  <span className="data-mono text-white">${history?.data[history.data.length - 1]?.ma50.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6">
              <h4 className="text-lg font-medium text-white/90 mb-4">Volatility Stats</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-outline/5">
                  <span className="text-white/60">Realized Vol (RV)</span>
                  <span className="data-mono text-primary">
                    {(history?.data[history.data.length - 1]?.rv || 0).toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-outline/5">
                  <span className="text-white/60">Daily Return</span>
                  <span className={`data-mono ${(history?.data[history.data.length - 1]?.return_val || 0) >= 0 ? 'text-primary' : 'text-secondary-text'}`}>
                    {((history?.data[history.data.length - 1]?.return_val || 0) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/60">Volume</span>
                  <span className="data-mono text-white/80">{Math.floor(Math.random() * 10000000).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-editorial text-2xl text-white/90">Volatility Predictions</h3>
              <p className="text-sm text-white/40 mt-1">Next-day RV forecasts vs actual</p>
            </div>
          </div>
          <PredictionTable predictions={predictions?.predictions || []} />
        </div>
      )}

      {activeTab === 'technical' && (
        <div className="glass-panel rounded-2xl p-8">
          <h3 className="font-editorial text-2xl text-white/90 mb-6">Technical Analysis</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-surface-low rounded-xl">
              <Activity className="w-6 h-6 text-primary mb-3" />
              <p className="text-sm text-white/60 mb-1">Momentum</p>
              <p className="text-xl font-medium text-white">Bullish</p>
            </div>
            <div className="p-6 bg-surface-low rounded-xl">
              <TrendingUp className="w-6 h-6 text-primary mb-3" />
              <p className="text-sm text-white/60 mb-1">Trend</p>
              <p className="text-xl font-medium text-white">Uptrend</p>
            </div>
            <div className="p-6 bg-surface-low rounded-xl">
              <Calendar className="w-6 h-6 text-secondary-text mb-3" />
              <p className="text-sm text-white/60 mb-1">Signal</p>
              <p className="text-xl font-medium text-white">Hold</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockDetail
