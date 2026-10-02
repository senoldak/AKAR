import React, { useState } from 'react';
import { Fuel, Navigation } from 'lucide-react';

export default function FuelCalculator({ summaryData }) {
  // Tank Fill Calculator State
  const [tankCapacity, setTankCapacity] = useState(50);
  const [selectedTankFuel, setSelectedTankFuel] = useState('benzin');

  // Trip Cost Calculator State
  const [distanceKm, setDistanceKm] = useState(250);
  const [consumptionPer100Km, setConsumptionPer100Km] = useState(6.5);
  const [selectedTripFuel, setSelectedTripFuel] = useState('benzin');

  // Get current average prices
  const benzinPrice = summaryData?.summary?.benzin?.avg || 44.85;
  const motorinPrice = summaryData?.summary?.motorin?.avg || 45.40;
  const lpgPrice = summaryData?.summary?.lpg?.avg || 22.95;

  const getPrice = (type) => {
    if (type === 'motorin') return motorinPrice;
    if (type === 'lpg') return lpgPrice;
    return benzinPrice;
  };

  const fuelLabels = {
    benzin: 'Gasoline',
    motorin: 'Diesel',
    lpg: 'Autogas'
  };

  // Calculations
  const tankFuelPrice = getPrice(selectedTankFuel);
  const totalTankCost = (tankCapacity * tankFuelPrice).toFixed(2);

  const tripFuelPrice = getPrice(selectedTripFuel);
  const totalFuelLitersNeeded = ((distanceKm / 100) * consumptionPer100Km).toFixed(1);
  const totalTripCost = (totalFuelLitersNeeded * tripFuelPrice).toFixed(2);
  const costPerKm = (totalTripCost / (distanceKm || 1)).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
      {/* 1. Tank Refill Calculator */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Full Tank Cost Calculator</h3>
              <p className="text-xs text-slate-400">Calculate total refill cost based on tank capacity</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Fuel Type */}
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Fuel Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['benzin', 'motorin', 'lpg'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedTankFuel(type)}
                    className={`py-2 rounded-xl border font-semibold capitalize transition-all cursor-pointer ${
                      selectedTankFuel === type
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fuelLabels[type] || type}
                  </button>
                ))}
              </div>
            </div>

            {/* Tank Capacity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-400 font-medium">Tank Capacity</label>
                <span className="font-bold text-cyan-400 text-sm">{tankCapacity} Liters</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={tankCapacity}
                onChange={(e) => setTankCapacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>20L (Compact)</span>
                <span>50L (Standard)</span>
                <span>100L (Commercial)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tank Result Display */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Estimated Full Tank Cost</span>
            <span className="text-2xl font-extrabold text-amber-400">{totalTankCost} ₺</span>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <span>Unit: {tankFuelPrice.toFixed(2)} ₺/L</span>
          </div>
        </div>
      </div>

      {/* 2. Trip Cost Calculator */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Trip &amp; Travel Cost Calculator</h3>
              <p className="text-xs text-slate-400">Estimate trip fuel expenditure based on distance</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Inputs grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Trip Distance (km)</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Consumption (L / 100km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={consumptionPer100Km}
                  onChange={(e) => setConsumptionPer100Km(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Fuel Type Selection */}
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Fuel Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['benzin', 'motorin', 'lpg'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedTripFuel(type)}
                    className={`py-1.5 rounded-xl border font-semibold capitalize transition-all cursor-pointer ${
                      selectedTripFuel === type
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fuelLabels[type] || type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trip Result Display */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Total Estimated Fuel Cost</span>
            <span className="text-2xl font-extrabold text-cyan-400">{totalTripCost} ₺</span>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <span className="block">{totalFuelLitersNeeded} Liters Needed</span>
            <span className="font-semibold text-slate-300">{costPerKm} ₺ / km</span>
          </div>
        </div>
      </div>

    </div>
  );
}
