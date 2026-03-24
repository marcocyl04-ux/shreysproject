import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

const VolatilityChart = ({ data }) => {
  // Generate chart data from stocks
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (30 - i))
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: 15 + Math.random() * 20,
      predicted: 15 + Math.random() * 18,
      baseline: 14 + Math.random() * 16
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255,255,255,0.3)"
          fontSize={11}
          fontFamily="Space Grotesk"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.3)"
          fontSize={11}
          fontFamily="Space Grotesk"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toFixed(0)}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E2024',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontFamily: 'Space Grotesk'
          }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
        />
        <Area
          type="monotone"
          dataKey="actual"
          stroke="#00FF94"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorActual)"
          name="Actual RV"
        />
        <Area
          type="monotone"
          dataKey="predicted"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          fillOpacity={1}
          fill="url(#colorPredicted)"
          name="Predicted"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default VolatilityChart
