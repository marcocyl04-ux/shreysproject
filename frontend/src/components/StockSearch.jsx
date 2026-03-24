import React, { useState } from 'react'
import { MagnifyingGlass, TrendUp, TrendDown, Minus, MagnifyingGlass as SearchIcon } from 'phosphor-react'

export default function StockSearch({ onSearch, loading }) {
  const [ticker, setTicker] = useState('')
  const [recentSearches] = useState(['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN'])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase())
    }
  }

  const handleQuickSelect = (symbol) => {
    setTicker(symbol)
    onSearch(symbol)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Search</h2>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter ticker (e.g., AAPL, TSLA)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !ticker.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Loading...' : 'Analyze'}
        </button>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Quick select:</p>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleQuickSelect(symbol)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}