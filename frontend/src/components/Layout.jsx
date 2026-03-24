import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, BarChart3, Terminal } from 'lucide-react'

const Layout = ({ children }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/models', label: 'Models', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-base border-r border-outline/5 flex flex-col">
        {/* Logo */}
        <div className="p-8 border-b border-outline/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-editorial text-xl tracking-tight">Sovereign</h1>
              <p className="text-xs text-white/40 font-data tracking-widest uppercase">Terminal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Status */}
        <div className="p-6 border-t border-outline/5">
          <div className="glass-panel rounded-lg p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider font-data mb-2">System</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-white/80">Live Feed</span>
            </div>
            <p className="text-xs text-white/40 mt-2">API: Connected</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-surface-lowest">
        {/* Header */}
        <header className="h-20 border-b border-outline/5 flex items-center justify-between px-8">
          <div>
            <h2 className="font-editorial text-2xl text-white/90">Volatility Forecasting</h2>
            <p className="text-sm text-white/40">Next-day realized volatility prediction</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase tracking-wider">Last Update</p>
              <p className="text-sm data-mono text-white/80">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
