import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

const PredictionTable = ({ predictions }) => {
  const getAccuracy = (actual, predicted) => {
    if (!actual) return null
    const diff = Math.abs(actual - predicted)
    if (diff < 2) return 'high'
    if (diff < 5) return 'medium'
    return 'low'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-outline/10">
            <th className="text-left py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
              Date
            </th>
            <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
              Actual RV
            </th>
            <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
              Predicted
            </th>
            <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
              Baseline
            </th>
            <th className="text-right py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
              Sentiment
            </th>
            <th className="text-center py-4 px-4 text-xs text-white/40 uppercase tracking-wider font-data">
              Accuracy
            </th>
          </tr>
        </thead>
        <tbody>
          {predictions.slice().reverse().map((pred, idx) => {
            const accuracy = getAccuracy(pred.actual_rv, pred.predicted_rv)
            
            return (
              <tr 
                key={idx} 
                className="border-b border-outline/5 hover:bg-surface-bright/20 transition-colors"
              >
                <td className="py-4 px-4 text-white/80">
                  {new Date(pred.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </td>
                <td className="py-4 px-4 text-right">
                  {pred.actual_rv !== null ? (
                    <span className="data-mono text-white">{pred.actual_rv.toFixed(2)}%</span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="data-mono text-primary">{pred.predicted_rv.toFixed(2)}%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="data-mono text-white/60">{pred.baseline_rv.toFixed(2)}%</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`data-mono ${
                    pred.sentiment_score > 0 ? 'text-primary' : 
                    pred.sentiment_score < 0 ? 'text-secondary-text' : 'text-white/40'
                  }`}>
                    {pred.sentiment_score > 0 ? '+' : ''}{pred.sentiment_score.toFixed(3)}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  {accuracy ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      accuracy === 'high' ? 'bg-primary/10 text-primary' :
                      accuracy === 'medium' ? 'bg-white/10 text-white/70' :
                      'bg-secondary/10 text-secondary-text'
                    }`}>
                      {accuracy === 'high' && <ArrowUpRight className="w-3 h-3" />}
                      {accuracy === 'medium' && <Minus className="w-3 h-3" />}
                      {accuracy === 'low' && <ArrowDownRight className="w-3 h-3" />}
                      {accuracy}
                    </span>
                  ) : (
                    <span className="text-white/30 text-xs">pending</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default PredictionTable
