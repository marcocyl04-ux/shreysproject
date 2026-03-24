import React from 'react'
import { Star, Trash, TrendUp, TrendDown, Minus } from 'phosphor-react'

export default function Watchlist({ stocks, onSelect, onRemove }) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Watchlist
        </h2>
        <p className="text-gray-500 text-center py-8">
          Search for stocks to add to your watchlist
        </p>
      </div>
    )
  }

  const getTrendIcon = (changePct) => {
    if (changePct > 1) return <TrendUp className="w-4 h-4 text-green-500" />
    if (changePct < -1) return <TrendDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Watchlist ({stocks.length})
      </h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {stocks.map((stock) => (
          <div
            key={stock.ticker}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
            onClick={() => onSelect(stock.ticker)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-700">{stock.ticker?.slice(0, 2)}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{stock.ticker}</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(stock.change_pct)}
                  <span className={`text-sm ${
                    stock.change_pct > 0 ? 'text-green-600' : 
                    stock.change_pct < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stock.change_pct > 0 ? '+' : ''}{stock.change_pct?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">${stock.current_price?.toFixed(2)}</p>
                {stock.predicted_return && (
                  <p className={`text-xs ${
                    stock.predicted_return > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Pred: {stock.predicted_return > 0 ? '+' : ''}{stock.predicted_return?.toFixed(1)}%
                  </p>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(stock.ticker)
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}