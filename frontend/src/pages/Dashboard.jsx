import { useState } from 'react'
import { useApi } from '../hooks/useApi'

export default function Dashboard() {
  const { connected, loading, error, result, connect, disconnect, analyze } = useApi()
  const [urlInput, setUrlInput] = useState('')
  const [ticker, setTicker] = useState('')

  const handleConnect = async (e) => {
    e.preventDefault()
    if (urlInput.trim()) {
      await connect(urlInput.trim())
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (ticker.trim()) {
      await analyze(ticker.trim())
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Trading Dashboard</h1>
      
      {/* Connection Section */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Backend Connection</h2>
        {!connected ? (
          <form onSubmit={handleConnect}>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://your-api.onrender.com"
              style={{ width: '300px', padding: '8px', marginRight: '10px' }}
            />
            <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </form>
        ) : (
          <div>
            <p style={{ color: 'green' }}>● Connected</p>
            <button onClick={disconnect} style={{ padding: '8px 16px' }}>Disconnect</button>
          </div>
        )}
      </div>

      {/* Search Section */}
      {connected && (
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Analyze Stock</h2>
          <form onSubmit={handleAnalyze}>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="AAPL"
              style={{ width: '150px', padding: '8px', marginRight: '10px', textTransform: 'uppercase' }}
            />
            <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? 'Loading...' : 'Analyze'}
            </button>
          </form>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <h2>Results for {result.ticker} — ${result.current_price} ({result.change_pct}%)</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {/* Linear Regression */}
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
              <h3>Linear Regression</h3>
              {result.linear_regression?.next_day?.error ? (
                <p>{result.linear_regression.next_day.error}</p>
              ) : (
                <>
                  <p><strong>Next Day:</strong> ${result.linear_regression?.next_day?.predicted_price} ({result.linear_regression?.next_day?.predicted_return}%)</p>
                  <p><strong>7 Days:</strong> ${result.linear_regression?.next_7_days?.predicted_price} ({result.linear_regression?.next_7_days?.predicted_return}%)</p>
                  <p><strong>Trend:</strong> {result.linear_regression?.next_day?.trend}</p>
                </>
              )}
            </div>

            {/* XGBoost */}
            <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
              <h3>XGBoost</h3>
              {result.xgboost?.error ? (
                <p>{result.xgboost.error}</p>
              ) : (
                <>
                  <p><strong>Up:</strong> {(result.xgboost?.direction_probabilities?.up * 100)?.toFixed(1)}%</p>
                  <p><strong>Down:</strong> {(result.xgboost?.direction_probabilities?.down * 100)?.toFixed(1)}%</p>
                  <p><strong>Expected Return:</strong> {result.xgboost?.expected_return_7d}%</p>
                  <p><strong>Confidence:</strong> {result.xgboost?.confidence}</p>
                </>
              )}
            </div>

            {/* Monte Carlo */}
            <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
              <h3>Monte Carlo</h3>
              {result.monte_carlo?.error ? (
                <p>{result.monte_carlo.error}</p>
              ) : (
                <>
                  <p><strong>Median (7d):</strong> ${result.monte_carlo?.percentiles?.p50?.[7]}</p>
                  <p><strong>VaR (95%):</strong> {result.monte_carlo?.var_95}%</p>
                  <p><strong>Volatility:</strong> {result.monte_carlo?.volatility}%</p>
                  <p><strong>Range:</strong> ${result.monte_carlo?.percentiles?.p5?.[7]} - ${result.monte_carlo?.percentiles?.p95?.[7]}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}