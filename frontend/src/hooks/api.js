import { useState, useCallback } from 'react'

// Global backend URL storage
let globalBackendUrl = localStorage.getItem('backendUrl') || ''

export const setBackendUrl = (url) => {
  globalBackendUrl = url
  localStorage.setItem('backendUrl', url)
}

export const getBackendUrl = () => globalBackendUrl

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)

  const checkConnection = useCallback(async (url) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        setConnected(true)
        setBackendUrl(url)
        return true
      }
      throw new Error('Connection failed')
    } catch (err) {
      setError(err.message)
      setConnected(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setConnected(false)
    setBackendUrl('')
    setError(null)
  }, [])

  const fetchStockPrediction = useCallback(async (ticker) => {
    if (!globalBackendUrl) throw new Error('Not connected to backend')
    const response = await fetch(`${globalBackendUrl}/api/stock/${ticker}`)
    if (!response.ok) throw new Error(`Failed to fetch ${ticker}`)
    return response.json()
  }, [])

  const fetchStockHistory = useCallback(async (ticker) => {
    if (!globalBackendUrl) throw new Error('Not connected to backend')
    const response = await fetch(`${globalBackendUrl}/api/stock/${ticker}/history`)
    if (!response.ok) throw new Error(`Failed to fetch history for ${ticker}`)
    return response.json()
  }, [])

  return {
    loading,
    error,
    connected,
    checkConnection,
    disconnect,
    fetchStockPrediction,
    fetchStockHistory,
    backendUrl: globalBackendUrl
  }
}

// Legacy exports for compatibility
export const fetchStocks = async () => []
export const fetchMetrics = async () => []

// Legacy function names for backward compatibility
export const fetchStockHistory = async (ticker) => {
  const url = getBackendUrl()
  if (!url) throw new Error('Not connected to backend')
  const response = await fetch(`${url}/api/stock/${ticker}/history`)
  if (!response.ok) throw new Error(`Failed to fetch history for ${ticker}`)
  return response.json()
}

export const fetchPredictions = async (ticker) => ({ ticker, predictions: [] })