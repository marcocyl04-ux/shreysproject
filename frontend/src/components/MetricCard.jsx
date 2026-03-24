import React from 'react'
import { TrendingUp, Activity, BarChart2 } from 'lucide-react'

const MetricCard = ({ model, index }) => {
  const icons = [Activity, BarChart2, TrendingUp]
  const Icon = icons[index % icons.length]
  
  const isBest = model.improvement_vs_baseline > 25
  
  return (
    <div className={`glass-panel rounded-xl p-6 ${isBest ? 'border-primary/20' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-1">
            {model.model_name}
          </p>
          <h4 className="text-lg font-medium text-white/90">
            {isBest && <span className="text-primary mr-2">★</span>}
            {model.model_name.split(' ')[0]}
          </h4>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isBest ? 'bg-primary/10' : 'bg-white/5'
        }`}>
          <Icon className={`w-5 h-5 ${isBest ? 'text-primary' : 'text-white/40'}`} />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl data-mono text-white">
            {model.improvement_vs_baseline.toFixed(1)}%
          </span>
          <span className="text-xs text-white/40">improvement</span>
        </div>
        
        <div className="pt-3 border-t border-outline/5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/30 mb-1">MSE</p>
            <p className="text-sm data-mono text-white/70">{model.mse.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-xs text-white/30 mb-1">R²</p>
            <p className="text-sm data-mono text-white/70">{model.r2.toFixed(3)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
