import React, { useState, useEffect } from 'react'
import { fetchMetrics } from '../hooks/api'
import { BarChart3, TrendingUp, Activity, Award } from 'lucide-react'

const Models = () => {
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchMetrics()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to load metrics:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/40">Loading model metrics...</div>
      </div>
    )
  }

  const bestModel = metrics.reduce((prev, current) => 
    prev.improvement_vs_baseline > current.improvement_vs_baseline ? prev : current
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="editorial-heading text-5xl text-white/90 mb-4">
          Model Performance
        </h1>
        <p className="text-white/50 text-lg max-w-2xl">
          Comparing volatility prediction models against the persistence baseline.
          Lower MSE indicates better prediction accuracy.
        </p>
      </div>

      {/* Best Model Banner */}
      <div className="glass-panel rounded-2xl p-8 border-primary/20">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary font-medium uppercase tracking-wider mb-1">
              Best Performing Model
            </p>
            <h2 className="font-editorial text-3xl text-white mb-2">{bestModel.model_name}</h2>
            <p className="text-white/60">
              Achieves <span className="text-primary font-semibold">{bestModel.improvement_vs_baseline.toFixed(1)}% improvement</span> over baseline
              with an R² score of {bestModel.r2.toFixed(3)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl data-mono text-primary">{bestModel.improvement_vs_baseline.toFixed(1)}%</p>
            <p className="text-sm text-white/40 mt-1">improvement</p>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="glass-panel rounded-2xl p-8">
        <h3 className="font-editorial text-2xl text-white/90 mb-6">Detailed Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline/10">
                <th className="text-left py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
                  Model
                </th>
                <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
                  MSE
                </th>
                <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
                  MAE
                </th>
                <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
                  R²
                </th>
                <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
                  vs Baseline
                </th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((model, idx) => (
                <tr 
                  key={model.model_name}
                  className={`border-b border-outline/5 hover:bg-surface-bright/20 transition-colors ${
                    model.model_name === bestModel.model_name ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      {model.model_name === bestModel.model_name && (
                        <Award className="w-4 h-4 text-primary" />
                      )}
                      <span className={`font-medium ${
                        model.model_name === bestModel.model_name ? 'text-primary' : 'text-white/90'
                      }`}>
                        {model.model_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="data-mono text-white/80">{model.mse.toFixed(6)}</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="data-mono text-white/80">{model.mae.toFixed(4)}</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="data-mono text-white/80">{model.r2.toFixed(3)}</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    {model.improvement_vs_baseline > 0 ? (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <TrendingUp className="w-4 h-4" />
                        +{model.improvement_vs_baseline.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Descriptions */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-medium text-white/90">Baseline (Persistence)</h4>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            The naive baseline assumes tomorrow's volatility equals today's. 
            This is a strong financial benchmark because volatility exhibits 
            persistence over time. All models are evaluated relative to this.
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-medium text-white/90">XGBoost + Sentiment</h4>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Gradient boosting model incorporating news sentiment scores from 
            financial headlines. Uses VADER and FinBERT for sentiment extraction, 
            merged with technical indicators for prediction.
          </p>
        </div>
      </div>

      {/* Methodology */}
      <div className="glass-panel rounded-2xl p-8">
        <h3 className="font-editorial text-2xl text-white/90 mb-6">Methodology</h3>
        
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-3">Target Variable</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Next-day realized volatility (RVₜ₊₁) calculated as squared log returns.
              This captures magnitude of price fluctuations regardless of direction.
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-3">Features</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Technical: Rolling volatility, RSI, moving averages, volume change.
              Sentiment: Daily aggregated news sentiment from VADER/FinBERT.
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-3">Evaluation</p>
            <p className="text-white/80 text-sm leading-relaxed">
              MSE, MAE, and R² scores. Models evaluated on out-of-sample test data
              with no forward-looking bias. Minimum 2 years training data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Models
