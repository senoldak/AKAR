import React from 'react';
import { TrendingUp, TrendingDown, Flame, Award } from 'lucide-react';

export default function SummaryCards({ summaryData, onSelectCity }) {
  if (!summaryData || !summaryData.summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card p-5 rounded-2xl animate-pulse h-28"></div>
        ))}
      </div>
    );
  }

  const { summary, cheapestCity, mostExpensiveCity } = summaryData;

  const renderTrend = (diff, percent) => {
    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
          <TrendingUp className="w-3 h-3" />
          +{diff} ₺ (+%{percent})
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          <TrendingDown className="w-3 h-3" />
          {diff} ₺ (%{percent})
        </span>
      );
    }
    return (
      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
        Stable
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Gasoline Card */}
      <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Gasoline 95 Avg</span>
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Flame className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">
            {summary.benzin ? summary.benzin.avg.toFixed(2) : '--'}
          </span>
          <span className="text-sm font-semibold text-slate-400">₺/L</span>
        </div>
        <div>
          {summary.benzin && renderTrend(summary.benzin.diff, summary.benzin.percentChange)}
        </div>
      </div>

      {/* Diesel Card */}
      <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Diesel Avg</span>
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Flame className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">
            {summary.motorin ? summary.motorin.avg.toFixed(2) : '--'}
          </span>
          <span className="text-sm font-semibold text-slate-400">₺/L</span>
        </div>
        <div>
          {summary.motorin && renderTrend(summary.motorin.diff, summary.motorin.percentChange)}
        </div>
      </div>

      {/* Autogas (LPG) Card */}
      <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Autogas (LPG) Avg</span>
          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Flame className="w-4 h-4" />
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">
            {summary.lpg ? summary.lpg.avg.toFixed(2) : '--'}
          </span>
          <span className="text-sm font-semibold text-slate-400">₺/L</span>
        </div>
        <div>
          {summary.lpg && renderTrend(summary.lpg.diff, summary.lpg.percentChange)}
        </div>
      </div>

      {/* Market Extremes Card */}
      <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Market Price Extremes</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          {cheapestCity && (
            <div 
              onClick={() => onSelectCity && onSelectCity(cheapestCity.city)}
              className="flex items-center justify-between py-1 text-xs cursor-pointer hover:text-emerald-400 transition-colors"
            >
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Lowest:
              </span>
              <span className="font-bold text-emerald-400">
                {cheapestCity.city} ({cheapestCity.avg_price} ₺)
              </span>
            </div>
          )}
          {mostExpensiveCity && (
            <div 
              onClick={() => onSelectCity && onSelectCity(mostExpensiveCity.city)}
              className="flex items-center justify-between py-1 text-xs cursor-pointer hover:text-rose-400 transition-colors"
            >
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Highest:
              </span>
              <span className="font-bold text-rose-400">
                {mostExpensiveCity.city} ({mostExpensiveCity.avg_price} ₺)
              </span>
            </div>
          )}
        </div>
        <div className="text-[10px] text-slate-500 text-right mt-1">
          Click city to select
        </div>
      </div>

    </div>
  );
}
