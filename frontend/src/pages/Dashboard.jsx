import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp } from 'lucide-react'
import { fetchStocks, fetchMetrics } from '../hooks/api'
import VolatilityChart from '../components/VolatilityChart'
import MetricCard from '../components/MetricCard'

const Dashboard = () => {
  const [stocks, setStocks] = useState([])
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stocksData, metricsData] = await Promise.all([
          fetchStocks(),
          fetchMetrics()
        ])
        setStocks(stocksData)
        setMetrics(metricsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/40">Loading market data...</div>
      </div>
    )
  }

  const topGainers = stocks.slice(0, 3)
  const bestModel = metrics.reduce((prev, current) => 
    prev.improvement_vs_baseline > current.improvement_vs_baseline ? prev : current
  , metrics[0])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <h1 className="editorial-heading text-5xl text-white/90 mb-4">
            The Market at a Glance
          </h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            Predicting next-day realized volatility for S&P 500 constituents using 
            technical indicators and news sentiment analysis.
          </p>
        </div>
        <div className="col-span-4 flex items-end justify-end">
          <div className="glass-panel rounded-2xl p-6 text-right">
            <p className="text-xs text-white/40 uppercase tracking-widest font-data mb-1">
              Best Model
            </p>
            <p className="text-3xl font-editorial text-primary mb-1">
              {bestModel?.model_name || 'XGBoost'}
            </p>
            <p className="text-sm text-white/60">
              <span className="text-primary">+{bestModel?.improvement_vs_baseline || 30.8}%</span> vs baseline
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-4 gap-6">
        {metrics.slice(1).map((model, idx) => (
          <MetricCard key={model.model_name} model={model} index={idx} />
        ))}
      </div>

      {/* Stock Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-editorial text-2xl text-white/90">Watchlist</h3>
          <span className="text-sm text-white/40 font-data">{stocks.length} securities</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {stocks.map((stock) => (
            <Link
              key={stock.ticker}
              to={`/stock/${stock.ticker}`}
              className="group glass-panel rounded-xl p-6 hover:bg-surface-bright/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-data font-semibold text-white">{stock.ticker}</h4>
                    {stock.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-secondary-text" />
                    )}
                  </div>
                  <p className="text-sm text-white/50 mt-1">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg data-mono text-white">${stock.current_price}</p>
                  <p className="text-xs text-white/40">{stock.sector}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-outline/5">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-1">
                    Predicted Vol
                  </p>
                  <p className="text-2xl data-mono text-primary">
                    {(stock.predicted_volatility || 0).toFixed(2)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-1">
                    Trend
                  </p>
                  <span className={`text-sm ${stock.trend === 'up' ? 'text-primary' : 'text-secondary-text'}`}>
                    {stock.trend === 'up' ? 'Bullish' : 'Bearish'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-panel rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-editorial text-2xl text-white/90">Volatility Trends</h3>
            <p className="text-sm text-white/40 mt-1">Realized volatility vs predictions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-white/60">Actual RV</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/30" />
              <span className="text-xs text-white/60">Predicted</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <VolatilityChart data={topGainers} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
