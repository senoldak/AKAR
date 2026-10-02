import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TurkeyMap from './components/TurkeyMap';
import PriceChart from './components/PriceChart';
import CityDetailTable from './components/CityDetailTable';
import FuelCalculator from './components/FuelCalculator';
import { Database, ShieldCheck, ExternalLink } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [latestPrices, setLatestPrices] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('İstanbul');
  const [cityDetails, setCityDetails] = useState([]);
  const [activeFuelType, setActiveFuelType] = useState('benzin');
  const [days, setDays] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Fetch initial summary & latest prices
  const fetchData = useCallback(async () => {
    try {
      const [latestRes, summaryRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE}/prices/latest`),
        axios.get(`${API_BASE}/summary`),
        axios.get(`${API_BASE}/prices/historical?days=${days}`)
      ]);

      if (latestRes.data && latestRes.data.cities) {
        setLatestPrices(latestRes.data.cities);
        setLastUpdated(latestRes.data.date);
      }
      if (summaryRes.data) {
        setSummaryData(summaryRes.data);
      }
      if (historyRes.data) {
        setHistoricalData(historyRes.data);
      }
    } catch (err) {
      console.warn('API error fetching initial data:', err.message);
    }
  }, [days]);

  // Fetch city specific district details when selected city changes
  const fetchCityDetails = useCallback(async (city) => {
    if (!city) {
      setCityDetails([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/prices/city/${encodeURIComponent(city)}`);
      if (res.data) {
        setCityDetails(res.data);
      }
    } catch (err) {
      console.warn('Error fetching city details:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedCity) {
      fetchCityDetails(selectedCity);
    } else {
      setCityDetails([]);
    }
  }, [selectedCity, fetchCityDetails]);

  // Handle Manual Scrape & Refresh
  const handleScrapeRefresh = async () => {
    setIsRefreshing(true);
    try {
      await axios.post(`${API_BASE}/scrape`);
      await fetchData();
      if (selectedCity) await fetchCityDetails(selectedCity);
    } catch (err) {
      console.error('Error triggering scrape:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      
      {/* Top Header Navigation */}
      <div>
        <Header
          lastUpdated={lastUpdated}
          onRefresh={handleScrapeRefresh}
          isRefreshing={isRefreshing}
          activeFuelType={activeFuelType}
          setActiveFuelType={setActiveFuelType}
        />

        {/* Main Content Layout */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
          
          {/* 1. Stat Summary Cards */}
          <SummaryCards 
            summaryData={summaryData} 
            onSelectCity={setSelectedCity}
          />

          {/* 2. Interactive GeoJSON Turkey Map */}
          <TurkeyMap
            cityPrices={latestPrices}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            activeFuelType={activeFuelType}
          />

          {/* 3. District Details Table for Selected City */}
          <CityDetailTable
            cityDetails={cityDetails}
            selectedCity={selectedCity}
          />

          {/* 4. Fuel & Trip Cost Calculators */}
          <FuelCalculator summaryData={summaryData} />

          {/* 5. Historical Price Charts & Analytics */}
          <PriceChart
            historicalData={historicalData}
            activeFuelType={activeFuelType}
            days={days}
            setDays={setDays}
          />

        </main>
      </div>

      {/* Footer Info */}
      <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-md py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Petrol Ofisi &amp; EPDK Fuel Market Dataset</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              DuckDB Analytics Engine
            </span>
            <a
              href="https://www.petrolofisi.com.tr"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              EPDK &amp; PO Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
