import React from 'react'
import { ChartLineUp, Warning } from 'phosphor-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MonteCarloCard({ data }) {
  if (!data || data.error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ChartLineUp className="w-5 h-5 text-orange-600" />
          Monte Carlo Simulation
        </h3>
        <p className="text-gray-500">{data?.error || 'No data available'}</p>
      </div>
    )
  }

  // Prepare chart data
  const chartData = []
  const days = data.days || 7
  
  for (let i = 0; i <= days; i++) {
    chartData.push({
      day: i,
      p5: data.percentiles?.p5?.[i],
      p25: data.percentiles?.p25?.[i],
      p50: data.percentiles?.p50?.[i],
      p75: data.percentiles?.p75?.[i],
      p95: data.percentiles?.p95?.[i],
    })
  }

  // Sample paths for overlay (limited to first 20 for performance)
  const samplePaths = data.paths?.slice(0, 20) || []
  samplePaths.forEach((path, idx) => {
    path.forEach((price, day) => {
      chartData[day][`path${idx}`] = price
    })
  })

  const formatCurrency = (val) => `$${val?.toFixed(2) || 0}`

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ChartLineUp className="w-5 h-5 text-orange-600" />
          Monte Carlo Simulation
        </h3>
        <span className="text-sm text-gray-500">
          {data.simulations?.toLocaleString()} paths
        </span>
      </div>

      <div className="space-y-4">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              
              {/* Sample paths (faint) */}
              {samplePaths.map((_, idx) => (
                <Line
                  key={`path${idx}`}
                  type="monotone"
                  dataKey={`path${idx}`}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
              
              {/* Percentile bands */}
              <Line type="monotone" dataKey="p95" stroke="#22c55e" strokeWidth={2} dot={false} name="95th percentile" />
              <Line type="monotone" dataKey="p75" stroke="#84cc16" strokeWidth={2} dot={false} name="75th percentile" />
              <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={3} dot={false} name="Median" />
              <Line type="monotone" dataKey="p25" stroke="#f59e0b" strokeWidth={2} dot={false} name="25th percentile" />
              <Line type="monotone" dataKey="p5" stroke="#ef4444" strokeWidth={2} dot={false} name="5th percentile" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-xl font-bold text-gray-900">${data.current_price?.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Median (Day {days})</p>
            <p className="text-xl font-bold text-blue-600">
              ${data.percentiles?.p50?.[days]?.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Historical Volatility</p>
            <p className="text-xl font-bold text-gray-700">{data.volatility?.toFixed(1)}%</p>
          </div>

          <div className={`rounded-lg p-3 ${data.var_95 < -5 ? 'bg-red-50' : data.var_95 < -2 ? 'bg-yellow-50' : 'bg-green-50'}`}>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Warning className="w-4 h-4" />
              Value at Risk (95%)
            </p>
            <p className={`text-xl font-bold ${data.var_95 < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {data.var_95?.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Percentile Table */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-2">Day {days} Price Distribution</p>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="bg-red-50 rounded p-2">
              <p className="text-xs text-gray-500">5th</p>
              <p className="font-semibold text-red-600">${data.percentiles?.p5?.[days]?.toFixed(0)}</p>
            </div>
            <div className="bg-yellow-50 rounded p-2">
              <p className="text-xs text-gray-500">25th</p>
              <p className="font-semibold text-yellow-600">${data.percentiles?.p25?.[days]?.toFixed(0)}</p>
            </div>
            <div className="bg-blue-50 rounded p-2">
              <p className="text-xs text-gray-500">Median</p>
              <p className="font-semibold text-blue-600">${data.percentiles?.p50?.[days]?.toFixed(0)}</p>
            </div>
            <div className="bg-lime-50 rounded p-2">
              <p className="text-xs text-gray-500">75th</p>
              <p className="font-semibold text-lime-600">${data.percentiles?.p75?.[days]?.toFixed(0)}</p>
            </div>
            <div className="bg-green-50 rounded p-2">
              <p className="text-xs text-gray-500">95th</p>
              <p className="font-semibold text-green-600">${data.percentiles?.p95?.[days]?.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}