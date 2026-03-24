import React from 'react'
import { Brain, ArrowDown, ArrowRight, ArrowUp, ChartBarHorizontal } from 'phosphor-react'

export default function XGBoostCard({ data }) {
  if (!data || data.error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-green-600" />
          XGBoost Ensemble
        </h3>
        <p className="text-gray-500">{data?.error || 'No data available'}</p>
      </div>
    )
  }

  const probs = data.direction_probabilities || {}
  const maxProb = Math.max(probs.down || 0, probs.sideways || 0, probs.up || 0)

  const getBarWidth = (val) => `${(val * 100).toFixed(1)}%`
  const getConfidenceColor = () => {
    if (data.confidence === 'high') return 'text-green-600'
    if (data.confidence === 'medium') return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Brain className="w-5 h-5 text-green-600" />
          XGBoost Ensemble
        </h3>
        <span className={`text-sm font-medium ${getConfidenceColor()}`}>
          {data.confidence?.toUpperCase()} CONFIDENCE
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-3">7-Day Direction Probabilities</p>
          
          {/* Down */}
          <div className="flex items-center gap-3 mb-2">
            <ArrowDown className={`w-5 h-5 ${probs.down > 0.35 ? 'text-red-600' : 'text-gray-400'}`} />
            <span className="w-16 text-sm text-gray-600">Down</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-red-500 h-full rounded-full transition-all"
                style={{ width: getBarWidth(probs.down) }}
              />
            </div>
            <span className="w-12 text-right text-sm font-medium">{(probs.down * 100).toFixed(1)}%</span>
          </div>

          {/* Sideways */}
          <div className="flex items-center gap-3 mb-2">
            <ArrowRight className={`w-5 h-5 ${probs.sideways > 0.35 ? 'text-yellow-600' : 'text-gray-400'}`} />
            <span className="w-16 text-sm text-gray-600">Flat</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-yellow-500 h-full rounded-full transition-all"
                style={{ width: getBarWidth(probs.sideways) }}
              />
            </div>
            <span className="w-12 text-right text-sm font-medium">{(probs.sideways * 100).toFixed(1)}%</span>
          </div>

          {/* Up */}
          <div className="flex items-center gap-3">
            <ArrowUp className={`w-5 h-5 ${probs.up > 0.35 ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="w-16 text-sm text-gray-600">Up</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-green-500 h-full rounded-full transition-all"
                style={{ width: getBarWidth(probs.up) }}
              />
            </div>
            <span className="w-12 text-right text-sm font-medium">{(probs.up * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Expected 7-Day Return</span>
            <span className={`text-xl font-bold ${
              data.expected_return_7d > 0 ? 'text-green-600' : 
              data.expected_return_7d < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {data.expected_return_7d > 0 ? '+' : ''}{data.expected_return_7d?.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 mb-2">Top Feature Importance</p>
          <div className="space-y-1">
            {data.top_features?.map((feat, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{feat.feature.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${feat.importance * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-500 w-12 text-right">{(feat.importance * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}