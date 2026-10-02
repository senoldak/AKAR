import React from 'react';
import { Fuel, RefreshCw, Database, Clock } from 'lucide-react';

export default function Header({ 
  lastUpdated, 
  onRefresh, 
  isRefreshing, 
  activeFuelType, 
  setActiveFuelType 
}) {
  return (
    <header className="glass-panel sticky top-0 z-50 px-4 lg:px-8 py-3 mb-6 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Turkey Fuel Prices Tracker
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DuckDB Live
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Official sources &amp; DuckDB Time Series</span>
              {lastUpdated && (
                <>
                  <span className="text-slate-600">•</span>
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Date: {lastUpdated}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Fuel Type Selector & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Fuel Type Tabs */}
          <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveFuelType('benzin')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeFuelType === 'benzin'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gasoline 95
            </button>
            <button
              onClick={() => setActiveFuelType('motorin')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeFuelType === 'motorin'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diesel
            </button>
            <button
              onClick={() => setActiveFuelType('lpg')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeFuelType === 'lpg'
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Autogas (LPG)
            </button>
          </div>

          {/* Scrape / Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 transition-all hover:border-cyan-400 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Fetching Data...' : 'Refresh Prices'}
          </button>
        </div>

      </div>
    </header>
  );
}
