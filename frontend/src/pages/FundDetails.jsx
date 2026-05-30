import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fundAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function FundDetails() {
  const { fundId } = useParams();
  const { user } = useAuth();
  const [fund, setFund] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Execute concurrent backend network dispatches
    Promise.all([
      fundAPI.getById(fundId),
      fundAPI.getHistory(fundId)
    ])
    .then(([fundRes, historyRes]) => {
      setFund(fundRes.data.data);
      
      // Filter out raw API payloads, take the last 365 calendar days, and reverse chronologically for chart orientation
      const rawHistory = historyRes.data.data?.data || [];
      const formattedHistory = rawHistory.slice(0, 365).reverse().map(entry => {
        // Format 'dd-mm-yyyy' to standard 'MMM DD' to create a cleaner chart axis
        const parts = entry.date.split('-');
        const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
        return {
          date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          nav: parseFloat(entry.nav)
        };
      });
      setHistory(formattedHistory);
    })
    .catch(err => console.error('Error fetching analytics profiles:', err))
    .finally(() => setLoading(false));
  }, [fundId]);

  if (loading) {
    return <p className="text-center text-xl text-gray-500 pt-20 animate-pulse">Parsing deep fund analytics canvas... ⏳</p>;
  }

  if (!fund) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-600 font-bold text-xl">Error: Analytics profile not found.</p>
        <Link to="/" className="text-blue-600 font-medium underline mt-4 block">Return to Explore Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      {/* Structural Header Grid Card */}
      <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {fund.category} Scheme
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 mt-2">{fund.schemeName}</h1>
            <p className="text-gray-500 font-medium mt-1">{fund.fundHouse} • {fund.subCategory}</p>
          </div>
          
          {user && (
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
              ⭐ Bookmark Watchlist
            </button>
          )}
        </div>

        {/* Financial Yield Grid Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-50">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Current NAV</p>
            <p className="text-2xl font-black text-blue-900">₹{fund.nav?.toFixed(2)}</p>
          </div>
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-50">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">1-Year Return</p>
            <p className="text-2xl font-black text-emerald-600">+{fund.returns?.oneYear?.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-50">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">3-Year Return</p>
            <p className="text-2xl font-black text-purple-700">+{fund.returns?.threeYear?.toFixed(1)}%</p>
          </div>
          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-50">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Net Asset AUM</p>
            <p className="text-2xl font-black text-amber-700">₹{fund.aum} Cr</p>
          </div>
        </div>
      </div>

      {/* Interactive Graph Engine Canvas */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            📈 Annual NAV Trajectory Trend
          </h2>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} minTickGap={40} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="nav" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}