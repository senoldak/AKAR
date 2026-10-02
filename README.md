# AKAR — Turkey Fuel Prices Live Dashboard & Analytics Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-8.x-646CFF.svg)](https://vite.dev/)
[![React](https://img.shields.io/badge/react-19.x-61DAFB.svg)](https://react.dev/)
[![DuckDB](https://img.shields.io/badge/DuckDB-embedded-FFF000.svg)](https://duckdb.org/)

**AKAR** is a modern, high-performance web application and analytics platform designed to monitor, analyze, and visualize daily fuel prices across all 81 provinces of Turkey. Powered by an embedded **DuckDB** analytical engine, an **Express REST API**, and a reactive **React 19 + Tailwind CSS + Leaflet** frontend, AKAR provides real-time market data alongside multi-year historical trend analytics.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Linting and Building](#linting-and-building)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

1. **Interactive Turkey Choropleth Map (81 Provinces):**
   - GeoJSON-driven interactive map rendered with React Leaflet.
   - Dynamic price-based color gradient (green for lowest prices to red for highest).
   - Province selection with hover tooltips displaying Gasoline 95, Diesel, and Autogas (LPG) prices.

2. **Market Summary & Price Extremes:**
   - Real-time national average prices with day-over-day price diffs and percentage change indicators.
   - Highlights the lowest-cost and highest-cost provinces with one-click province selection.

3. **District & Brand Price Breakdown:**
   - Sortable, searchable table displaying prices across distributor brands (Petrol Ofisi, OPET, Shell, BP, TP, etc.) and districts.
   - Multi-fuel and brand filtering pills.

4. **Interactive Calculators:**
   - **Full Tank Cost Calculator:** Calculates total tank refill costs with adjustable vehicle tank volume (20L to 100L).
   - **Trip Cost Calculator:** Estimates fuel expenses and cost-per-kilometer based on route distance and fuel consumption rate (L/100km).

5. **Historical Analytics Chart:**
   - Multi-period line chart (7 Days, 30 Days, 90 Days, 1 Year, 3 Years).
   - Powered by Chart.js with responsive dark-mode styling.

6. **Embedded DuckDB Analytics Engine:**
   - Columnar, in-process analytical storage for fast SQL aggregation over tens of thousands of price records without an external database server.
   - Automatic schema initialization and historical dataset self-seeding.

---

## Architecture & Tech Stack

- **Frontend:**
  - **Framework:** React 19, Vite 8
  - **Styling:** Tailwind CSS 4, Glassmorphic CSS custom theme
  - **Mapping:** Leaflet, React Leaflet, Turkey GeoJSON boundary data
  - **Charting:** Chart.js, react-chartjs-2
  - **Icons:** Lucide React
  - **Linting:** Oxlint
- **Backend:**
  - **Runtime:** Node.js (ES Modules)
  - **Framework:** Express 4, CORS
  - **Database:** DuckDB (embedded columnar database)
  - **Scraper:** Axios, Cheerio (live web scraping from public fuel portals)

---

## Project Structure

```text
akar/
├── .gitignore               # Comprehensive Git ignore rules
├── .env.example             # Backend environment example
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
├── README.md                # Project documentation
├── SECURITY.md              # Vulnerability reporting policy
├── backend/
│   ├── .env.example         # Backend local config example
│   ├── db.js                # DuckDB connection, schema init, and query handlers
│   ├── package.json         # Backend dependencies and scripts
│   ├── scraper.js           # Multi-brand fuel price scraper and distributor engine
│   └── server.js            # Express REST API server
└── frontend/
    ├── .env.example         # Frontend environment example
    ├── .oxlintrc.json       # Oxlint linter configuration
    ├── index.html           # HTML entry point with metadata
    ├── package.json         # Frontend dependencies and scripts
    ├── vite.config.js       # Vite build configuration with React & Tailwind plugins
    └── src/
        ├── main.jsx         # React DOM mounting
        ├── App.jsx          # Root dashboard component and state orchestration
        ├── index.css        # Base styles, Tailwind directives, glassmorphic styles
        ├── components/
        │   ├── CityDetailTable.jsx  # District & distributor brand table
        │   ├── FuelCalculator.jsx   # Tank refill and trip cost calculators
        │   ├── Header.jsx           # Top navigation bar, fuel tabs, refresh button
        │   ├── PriceChart.jsx       # Chart.js time-series trend line chart
        │   ├── SummaryCards.jsx     # National fuel statistics and market extremes
        │   ├── TurkeyMap.jsx        # Interactive 81-province Leaflet heatmap
        │   └── turkeyMap.css        # Custom Leaflet container and tooltip styles
        └── data/
            └── turkey-provinces.json # GeoJSON boundary polygons for Turkey provinces
```

---

## Prerequisites

- **Node.js:** `>= 18.0.0` (LTS recommended)
- **npm:** `>= 9.0.0`

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/akar.git
   cd akar
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## Environment Configuration

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` (optional):
```ini
PORT=5000
DUCKDB_PATH=../fuel_prices.db
```

- `PORT`: HTTP port for Express server (default: `5000`).
- `DUCKDB_PATH`: File path for the DuckDB database (default: `../fuel_prices.db`).

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` (optional):
```ini
VITE_API_URL=http://localhost:5000/api
```

- `VITE_API_URL`: Base URL of the backend API (default: `http://localhost:5000/api`).

---

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm start
```
*For development mode with nodemon:*
```bash
npm run dev
```
The backend initializes the DuckDB database, seeds historical records if needed, and starts listening on `http://localhost:5000`.

### 2. Start the Frontend Dev Server

In a new terminal:
```bash
cd frontend
npm run dev
```
Open your browser and navigate to the displayed local Vite URL (typically `http://localhost:5173`).

---

## API Reference

The backend exposes the following REST endpoints under `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/prices/latest` | Returns latest average fuel prices for all 81 provinces |
| `GET` | `/api/prices/city/:cityName` | Returns district and distributor brand breakdown for a given city |
| `GET` | `/api/prices/historical?days=30` | Returns time-series historical price trends for the specified number of days |
| `GET` | `/api/summary` | Returns national averages, day-over-day price differences, and price extremes |
| `GET` | `/api/cities` | Returns a list of all distinct cities currently in the database |
| `POST` | `/api/scrape` | Manually triggers a live scrape run across EPDK registered brands |

---

## Linting and Building

### Frontend Linting
```bash
cd frontend
npm run lint
```
Uses **Oxlint** for ultra-fast code checking.

### Production Build
```bash
cd frontend
npm run build
```
Creates an optimized production bundle inside `frontend/dist/`.

---

## Security Considerations

- **No Secrets in Repo:** The project does not require API keys or private tokens. All market data is retrieved from public, official fuel transparency sources.
- **Configurable Database & API URLs:** Database paths and network URLs use safe environment variable fallbacks rather than hardcoded local filesystem paths.
- **Git Ignores:** All `.env` files, logs, build outputs (`dist/`), temporary debug files, and local DuckDB binary files (`*.db`, `*.db.wal`) are excluded by `.gitignore`.

---

## Contributing

Contributions, issues, and feature requests are welcome. Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## License

This project is licensed under the terms of the [MIT License](LICENSE).
