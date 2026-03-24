import React from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts'

const PriceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00FF94" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
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
          yAxisId="price"
          stroke="rgba(255,255,255,0.3)"
          fontSize={11}
          fontFamily="Space Grotesk"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <YAxis 
          yAxisId="vol"
          orientation="right"
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
        />
        <Area
          yAxisId="price"
          type="monotone"
          dataKey="close"
          stroke="#00FF94"
          strokeWidth={2}
          fill="url(#colorPrice)"
          name="Price"
        />
        <Bar
          yAxisId="vol"
          dataKey="volatility_20d"
          fill="rgba(255,255,255,0.1)"
          name="20D Vol"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default PriceChart
