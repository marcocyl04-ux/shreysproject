import { useState, useCallback } from 'react'

export function useApi() {
  const [url, setUrl] = useState('')
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const connect = useCallback(async (backendUrl) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${backendUrl}/health`)
      if (response.ok) {
        setUrl(backendUrl)
        setConnected(true)
        return true
      }
      throw new Error('Backend not responding')
    } catch (err) {
      setError(err.message)
      setConnected(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setUrl('')
    setConnected(false)
    setResult(null)
    setError(null)
  }, [])

  const analyze = useCallback(async (ticker) => {
    if (!connected || !url) {
      setError('Not connected to backend')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch(`${url}/api/stock/${ticker.toUpperCase()}`)
      if (!response.ok) throw new Error('Failed to fetch stock data')
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [connected, url])

  return { url, connected, loading, error, result, connect, disconnect, analyze }
}