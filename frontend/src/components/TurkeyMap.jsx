import React, { useMemo } from 'react';
import { MapContainer, GeoJSON, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './turkeyMap.css';
import turkeyGeoJson from '../data/turkey-provinces.json';
import { CheckCircle2, Flame, XCircle } from 'lucide-react';

export default function TurkeyMap({ 
  cityPrices = [], 
  selectedCity, 
  onSelectCity, 
  activeFuelType = 'motorin'
}) {

  // Map city prices into lookup table with lowercased keys
  const priceMap = useMemo(() => {
    const map = {};
    if (Array.isArray(cityPrices)) {
      cityPrices.forEach(c => {
        if (c && c.city) {
          map[c.city.toLowerCase()] = c;
        }
      });
    }
    return map;
  }, [cityPrices]);

  // Calculate min/max price for color heat-mapping
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = Object.values(priceMap)
      .map(c => c?.[activeFuelType])
      .filter(p => typeof p === 'number' && p > 0);

    if (prices.length === 0) {
      return { minPrice: 66, maxPrice: 70 };
    }
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    };
  }, [priceMap, activeFuelType]);

  // STRICT Green to Red Gradient: NO YELLOW, NO BLUE
  const getCityColor = (cityName) => {
    if (!cityName) return '#14532d';

    const isSelected = Boolean(selectedCity && cityName && selectedCity.toLowerCase() === cityName.toLowerCase());
    if (isSelected) return '#ffffff'; // White highlight for selected city

    const cityData = priceMap[cityName.toLowerCase()];
    const price = cityData?.[activeFuelType];
    if (!price) return '#14532d';

    const range = maxPrice - minPrice || 1;
    const ratio = Math.max(0, Math.min(1, (price - minPrice) / range));

    if (ratio < 0.20) return '#16a34a'; // Vibrant Green
    if (ratio < 0.40) return '#65a30d'; // Olive / Lime-Green
    if (ratio < 0.60) return '#c2410c'; // Warm Terracotta
    if (ratio < 0.80) return '#ea580c'; // Orange-Red
    return '#dc2626'; // Pure Crimson Red
  };

  // GeoJSON style handler
  const styleFeature = (feature) => {
    const cityName = feature?.properties?.name || '';
    const isSelected = Boolean(selectedCity && cityName && selectedCity.toLowerCase() === cityName.toLowerCase());

    return {
      fillColor: getCityColor(cityName),
      weight: isSelected ? 2.5 : 1,
      opacity: 1,
      color: isSelected ? '#ffffff' : '#14532d',
      fillOpacity: isSelected ? 0.95 : 0.85
    };
  };

  // GeoJSON event handlers for each province
  const onEachFeature = (feature, layer) => {
    const cityName = feature?.properties?.name || '';
    const cityData = priceMap[cityName.toLowerCase()];

    // Custom HTML Tooltip
    const tooltipContent = `
      <div style="font-family: inherit;">
        <div style="font-weight: 700; font-size: 14px; color: #4ade80; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <span>📍 ${cityName}</span>
        </div>
        ${cityData ? `
          <div style="display: flex; flex-direction: column; gap: 2px; font-size: 12px;">
            <div style="color: #4ade80;">Gasoline: <b>${cityData.benzin ? cityData.benzin.toFixed(2) + ' ₺' : '--'}</b></div>
            <div style="color: #60a5fa;">Diesel: <b>${cityData.motorin ? cityData.motorin.toFixed(2) + ' ₺' : '--'}</b></div>
            <div style="color: #f472b6;">LPG: <b>${cityData.lpg ? cityData.lpg.toFixed(2) + ' ₺' : '--'}</b></div>
          </div>
        ` : '<div style="color: #94a3b8; font-size: 11px;">Price data pending...</div>'}
      </div>
    `;

    layer.bindTooltip(tooltipContent, {
      sticky: true,
      interactive: false,
      className: 'custom-leaflet-tooltip'
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 1,
          weight: 2,
          color: '#ffffff'
        });
      },
      mouseout: (e) => {
        const l = e.target;
        const isSelected = Boolean(selectedCity && cityName && selectedCity.toLowerCase() === cityName.toLowerCase());
        l.setStyle({
          fillColor: getCityColor(cityName),
          weight: isSelected ? 2.5 : 1,
          color: isSelected ? '#ffffff' : '#14532d',
          fillOpacity: isSelected ? 0.95 : 0.85
        });
      },
      click: () => {
        if (onSelectCity) {
          onSelectCity(cityName);
        }
      }
    });
  };

  const turkeyCenter = [39.0, 35.2];

  const fuelLabels = {
    benzin: 'Gasoline 95',
    motorin: 'Diesel',
    lpg: 'Autogas (LPG)'
  };

  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden mb-6">
      
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            Turkey Fuel Price Heatmap (81 Provinces)
          </h2>
          <p className="text-xs text-slate-400">
            Click on any province to view district details. Active Fuel: <span className="font-semibold text-emerald-400 uppercase">{fuelLabels[activeFuelType] || activeFuelType}</span>
          </p>
        </div>

        {/* Selected City Indicator with Clear Button */}
        {selectedCity && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Selected Province: <span className="text-white font-extrabold text-sm">{selectedCity}</span>
            <button 
              onClick={() => onSelectCity && onSelectCity('İstanbul')}
              className="ml-1 text-slate-400 hover:text-emerald-200 transition-colors cursor-pointer"
              title="Reset selection to İstanbul"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Leaflet Map Container */}
      <div className="w-full relative rounded-xl overflow-hidden shadow-2xl border border-slate-800">
        <MapContainer
          center={turkeyCenter}
          zoom={6}
          minZoom={5}
          maxZoom={9}
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ height: '480px', width: '100%' }}
        >
          <ZoomControl position="bottomright" />
          <GeoJSON 
            key={`${selectedCity || 'all'}-${activeFuelType}`}
            data={turkeyGeoJson}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>

      {/* Footer & Direct Green-to-Red Legend Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Lowest ({minPrice ? minPrice.toFixed(2) : '--'} ₺)</span>
          <div className="h-3 w-44 rounded-full bg-gradient-to-r from-[#16a34a] via-[#65a30d] via-[#c2410c] via-[#ea580c] to-[#dc2626] shadow-md border border-slate-800"></div>
          <span className="text-rose-400 font-medium">Highest ({maxPrice ? maxPrice.toFixed(2) : '--'} ₺)</span>
        </div>

        <div className="text-[11px] text-slate-400">
          💡 Hover over a province to view price breakdown or click to select.
        </div>
      </div>

    </div>
  );
}
