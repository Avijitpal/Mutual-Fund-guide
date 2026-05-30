import { useState, useEffect } from 'react';
import { fundAPI } from '../services/api';
import FundCard from '../components/FundCard';
import FilterSidebar from '../components/FilterSidebar';

export default function Home() {
  const [funds, setFunds] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  // Data Fetching Effect: Re-runs whenever the search/filter parameters change
  useEffect(() => {
    setLoading(true);
    fundAPI.getAll(filters)
      .then(res => setFunds(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [filters]); // Dynamic dependency injection

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950">
          📊 Market Explore Dashboard
        </h1>
        <p className="text-gray-600 font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          Live funds monitored: <span className="text-blue-700 font-bold">{funds.length}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* The dynamic filter sidebar with debouncing (Phase 1) */}
        <div className="lg:col-span-1">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* The Dynamic Card Grid View */}
        <div className="lg:col-span-3">
          {loading ? (
            <p className="text-center text-xl text-gray-500 pt-10 animate-pulse">Synchronizing market data... ⏳</p>
          ) : funds.length === 0 ? (
            <div className="bg-yellow-100 text-yellow-800 p-8 rounded-2xl border border-yellow-200 text-center">
              <p className="text-xl font-semibold mb-2">No funds match your current filter parameters.</p>
              <p>Try resetting your search query or broadening your category selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Map seeded data through the visual cards */}
              {funds.map(fund => <FundCard key={fund._id} fund={fund} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}