import React, { useState, useMemo } from 'react';
import { Building2, Search, ArrowUpDown, ArrowUp, ArrowDown, Fuel, Filter } from 'lucide-react';

export default function CityDetailTable({ cityDetails, selectedCity }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('price'); // default sort by price
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' = cheapest first, 'desc' = most expensive first
  const [fuelFilter, setFuelFilter] = useState('all'); // 'all', 'benzin', 'motorin', 'lpg'
  const [brandFilter, setBrandFilter] = useState('all');

  // Unconditional Hooks at top level
  const availableBrands = useMemo(() => {
    if (!Array.isArray(cityDetails)) return [];
    const brands = new Set(cityDetails.map(item => item.brand));
    return Array.from(brands);
  }, [cityDetails]);

  const processedRows = useMemo(() => {
    if (!Array.isArray(cityDetails)) return [];

    let rows = cityDetails.filter(item => {
      const matchesSearch = 
        item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fuel_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFuel = fuelFilter === 'all' || item.fuel_type === fuelFilter;
      const matchesBrand = brandFilter === 'all' || item.brand === brandFilter;

      return matchesSearch && matchesFuel && matchesBrand;
    });

    rows.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal, 'en') 
          : bVal.localeCompare(aVal, 'en');
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return rows;
  }, [cityDetails, searchTerm, fuelFilter, brandFilter, sortColumn, sortDirection]);

  if (!selectedCity) {
    return (
      <div className="glass-panel p-6 rounded-2xl mb-6 text-center">
        <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-300">District Price Breakdown</h3>
        <p className="text-xs text-slate-500 mt-1">Select a province from the map or list above to inspect local prices.</p>
      </div>
    );
  }

  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400 font-bold" />
      : <ArrowDown className="w-3.5 h-3.5 text-emerald-400 font-bold" />;
  };

  // Handle column header click for sorting
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl mb-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            {selectedCity} - District &amp; Brand Price List
          </h3>
          <p className="text-xs text-slate-400">
            Filter by fuel type or brand, and click table headers to sort from lowest to highest price.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search district or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* STYLISH PILL FILTER BUTTONS */}
      <div className="flex flex-col gap-3 mb-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        
        {/* 1. Fuel Type Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            Fuel Filter:
          </span>
          {[
            { id: 'all', label: 'All Fuels', color: 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500' },
            { id: 'benzin', label: '⛽ Gasoline 95', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-400' },
            { id: 'motorin', label: '💧 Diesel', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-400' },
            { id: 'lpg', label: '🔥 Autogas LPG', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30 hover:border-fuchsia-400' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFuelFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                fuelFilter === btn.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 scale-105'
                  : btn.color
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* 2. Brand Pill Buttons */}
        {availableBrands.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Brand Filter:
            </span>
            <button
              onClick={() => setBrandFilter('all')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                brandFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              All
            </button>
            {availableBrands.map(b => (
              <button
                key={b}
                onClick={() => setBrandFilter(b)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                  brandFilter === b
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Interactive Sortable Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800 select-none">
            <tr>
              <th 
                onClick={() => handleSort('district')}
                className="py-3 px-4 cursor-pointer hover:text-white hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>District (A-Z)</span>
                  {renderSortIcon('district')}
                </div>
              </th>
              
              <th 
                onClick={() => handleSort('brand')}
                className="py-3 px-4 cursor-pointer hover:text-white hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Distributor / Brand</span>
                  {renderSortIcon('brand')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('fuel_type')}
                className="py-3 px-4 cursor-pointer hover:text-white hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Fuel Type</span>
                  {renderSortIcon('fuel_type')}
                </div>
              </th>

              <th 
                onClick={() => handleSort('price')}
                className="py-3 px-4 cursor-pointer hover:text-white hover:bg-slate-800/50 transition-colors text-right group"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Pump Price</span>
                  {renderSortIcon('price')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {processedRows.length > 0 ? (
              processedRows.map((row, idx) => {
                let badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                let fuelName = "Gasoline 95";
                if (row.fuel_type === 'motorin') {
                  badgeClass = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
                  fuelName = "Diesel";
                }
                if (row.fuel_type === 'lpg') {
                  badgeClass = "bg-purple-500/10 text-purple-400 border-purple-500/20";
                  fuelName = "Autogas (LPG)";
                }

                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-white">{row.district}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-200">{row.brand}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-semibold ${badgeClass}`}>
                        {fuelName}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-emerald-400 text-sm">
                      {row.price.toFixed(2)} ₺
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  No price records found matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
