import { useState, useEffect } from 'react';

export default function FilterSidebar({ filters, setFilters }) {
  // Local state to capture fast, real-time typing feedback
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce Controller Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 400); // 400ms delay window

    return () => clearTimeout(delayDebounceFn); // Reset timer if the user types another letter
  }, [searchTerm, setFilters]);

  const handleChange = (e) => {
    if (e.target.name === 'search') {
      setSearchTerm(e.target.value);
    } else {
      setFilters({ ...filters, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100">
      <h3 className="font-bold text-xl text-gray-800 mb-5 flex items-center gap-2">🔍 Refine Search</h3>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-600 text-sm">Search Funds</label>
        <input
          type="text"
          name="search"
          value={searchTerm}
          onChange={handleChange}
          placeholder="e.g. Axis Liquid..."
          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-600 text-sm">Category</label>
        <select 
          name="category" 
          value={filters.category || ''} 
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Equity">Equity (High Growth)</option>
          <option value="Debt">Debt (Stable)</option>
          <option value="Hybrid">Hybrid (Balanced)</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-600 text-sm">Sort Market Data</label>
        <select 
          name="sortBy" 
          value={filters.sortBy || '-returns.oneYear'} 
          onChange={handleChange}
          className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="-returns.oneYear">Highest 1Y Yield</option>
          <option value="returns.oneYear">Lowest 1Y Yield</option>
          <option value="-nav">Highest NAV Asset Value</option>
          <option value="nav">Lowest NAV Asset Value</option>
        </select>
      </div>

      <button 
        onClick={() => { setSearchTerm(''); setFilters({}); }}
        className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
}