import React from 'react'
import { TrendUp, TrendDown, ArrowsHorizontal, ChartBar } from 'phosphor-react'

export default function LinearRegressionCard({ data }) {
  if (!data || data.error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ChartBar className="w-5 h-5 text-purple-600" />
          Linear Regression
        </h3>
        <p className="text-gray-500">{data?.error || 'No data available'}</p>
      </div>
    )
  }

  const isUp = data.trend === 'upward'
  const isDown = data.trend === 'downward'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ChartBar className="w-5 h-5 text-purple-600" />
          Linear Regression
        </h3>
        <span className="text-sm text-gray-500">
          {data.days_ahead === 1 ? 'Next Day' : 'Next 7 Days'}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Predicted Price</span>
          <span className="text-2xl font-bold text-gray-900">
            ${data.predicted_price?.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Expected Return</span>
          <span className={`text-lg font-semibold ${
            data.predicted_return > 0 ? 'text-green-600' : 
            data.predicted_return < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {data.predicted_return > 0 ? '+' : ''}{data.predicted_return?.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Trend:</span>
          <span className={`flex items-center gap-1 font-medium ${
            isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-600'
          }`}>
            {isUp && <TrendUp className="w-4 h-4" />}
            {isDown && <TrendDown className="w-4 h-4" />}
            {!isUp && !isDown && <ArrowsHorizontal className="w-4 h-4" />}
            {data.trend?.charAt(0).toUpperCase() + data.trend?.slice(1)}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-2">95% Confidence Interval</p>
          <div className="flex items-center justify-between">
            <span className="text-red-600 font-medium">${data.confidence_lower?.toFixed(2)}</span>
            <span className="text-gray-400">—</span>
            <span className="text-green-600 font-medium">${data.confidence_upper?.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Model Fit (R²)</span>
          <span className="font-medium text-gray-700">{data.r2_score?.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}