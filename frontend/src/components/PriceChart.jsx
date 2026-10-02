import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({ historicalData, days, setDays }) {
  if (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl mb-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin text-cyan-400 mb-2">⏳</div>
        <p className="text-slate-400 text-sm">Loading historical price trends...</p>
      </div>
    );
  }

  const labels = historicalData.map(d => {
    const parts = d.date.split('-');
    if (parts.length === 3) {
      return days > 180 ? `${parts[1]}/${parts[0].slice(2)}` : `${parts[2]}/${parts[1]}`;
    }
    return d.date;
  });

  const benzinPrices = historicalData.map(d => d.benzin);
  const motorinPrices = historicalData.map(d => d.motorin);
  const lpgPrices = historicalData.map(d => d.lpg);

  const data = {
    labels,
    datasets: [
      {
        label: 'Gasoline 95 (₺/L)',
        data: benzinPrices,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: days > 180 ? 1.5 : 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Diesel (₺/L)',
        data: motorinPrices,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: days > 180 ? 1.5 : 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Autogas LPG (₺/L)',
        data: lpgPrices,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: days > 180 ? 1.5 : 3,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter, sans-serif', size: 12 },
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#64748b', font: { size: 11 }, maxRotation: 0 }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#64748b', 
          font: { size: 11 },
          callback: (val) => `${val} ₺`
        }
      }
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl mb-6">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-amber-400" />
            Historical Price Trends (2023 - 2026)
          </h3>
          <p className="text-xs text-slate-400">
            Column-oriented time series price archive powered by DuckDB
          </p>
        </div>

        {/* Days Period Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setDays(7)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              days === 7 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              days === 30 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDays(90)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              days === 90 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setDays(365)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              days === 365 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1 Year
          </button>
          <button
            onClick={() => setDays(1095)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              days === 1095 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            3 Years (Full)
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-80 w-full">
        <Line data={data} options={options} />
      </div>

    </div>
  );
}
