import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/api'
import { Link as LinkIcon, LinkBreak, CheckCircle, X, CircleNotch } from 'phosphor-react'

export default function ConnectionPanel() {
  const [url, setUrl] = useState('')
  const { loading, error, connected, checkConnection, disconnect, backendUrl } = useApi()

  useEffect(() => {
    if (backendUrl) {
      setUrl(backendUrl)
    }
  }, [backendUrl])

  const handleConnect = async () => {
    if (!url.trim()) return
    await checkConnection(url.trim())
  }

  const handleDisconnect = () => {
    disconnect()
    setUrl('')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <LinkIcon className="w-5 h-5 text-blue-600" />
        Backend Connection
      </h2>

      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            ngrok URL from Colab
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://abc123.ngrok.io"
            disabled={connected}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste the URL from the last cell of your Colab notebook
          </p>
        </div>

        <div className="pt-7">
          {!connected ? (
            <button
              onClick={handleConnect}
              disabled={loading || !url.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <CircleNotch className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4" />
                  Connect
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <LinkBreak className="w-4 h-4" />
              Disconnect
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <X className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {connected && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">Connected to backend</span>
        </div>
      )}
    </div>
  )
}