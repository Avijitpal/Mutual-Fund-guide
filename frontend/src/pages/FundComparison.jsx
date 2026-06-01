import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FundComparison() {
  const [funds, setFunds] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/funds`);
        setFunds(res.data.data || res.data);
      } catch (err) {
        console.error("Failed fetching fund catalog for comparison:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, []);

  const handleSelectFund = (e) => {
    const fundId = e.target.value;
    if (!fundId) return;

    const fundToAppend = funds.find(f => f._id === fundId);
    if (fundToAppend && !selectedFunds.some(f => f._id === fundId) && selectedFunds.length < 3) {
      const updatedSelection = [...selectedFunds, fundToAppend];
      setSelectedFunds(updatedSelection);
      generateComparisonData(updatedSelection);
    }
  };

  const handleRemoveFund = (fundId) => {
    const updatedSelection = selectedFunds.filter(f => f._id !== fundId);
    setSelectedFunds(updatedSelection);
    generateComparisonData(updatedSelection);
  };

  // Generates historical trajectories based on the fund's actual performance data
  const generateComparisonData = (selected) => {
    const timelineIntervals = ['Initial', '1 Year', '3 Year', '5 Year'];
    
    const mappedMetrics = timelineIntervals.map(interval => {
      const dataPoint = { name: interval };
      
      selected.forEach((fund) => {
        let compoundingMultiplier = 1;
        const historicalReturn = fund.returns?.threeYear || fund.returns?.oneYear || 12;

        if (interval === '1 Year') compoundingMultiplier = 1 + (historicalReturn / 100);
        if (interval === '3 Year') compoundingMultiplier = Math.pow(1 + (historicalReturn / 100), 3);
        if (interval === '5 Year') compoundingMultiplier = Math.pow(1 + (historicalReturn / 100), 5);

        // Project the growth calculation against a base amount of ₹10,000
        dataPoint[fund.schemeName] = Math.round(10000 * compoundingMultiplier);
      });
      
      return dataPoint;
    });

    setChartData(mappedMetrics);
  };

  const borderHexColors = ['#2563eb', '#10b981', '#f59e0b'];

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">📊 Fund Comparison X-Ray Dashboard</h1>
        <p className="text-blue-100 font-medium text-sm">Analyze up to 3 mutual asset growth vectors side-by-side to track compound performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Dropdown Selector Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Select Target Asset (Max 3)</label>
            <select
              onChange={handleSelectFund}
              defaultValue=""
              disabled={selectedFunds.length >= 3 || loading}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>{loading ? "Loading..." : "Choose a fund to compare"}</option>
              {funds.map(f => (
                <option key={f._id} value={f._id}>{f.schemeName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400">Currently Comparing</h4>
            {selectedFunds.length === 0 && (
              <p className="text-xs text-gray-400 font-medium italic">No mutual funds selected yet.</p>
            )}
            {selectedFunds.map((fund, idx) => (
              <div key={fund._id} className="flex justify-between items-center bg-gray-50 border px-4 py-3 rounded-xl">
                <div className="truncate pr-2">
                  <p className="text-xs font-bold text-gray-900 truncate">{fund.schemeName}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{fund.category}</p>
                </div>
                <button
                  onClick={() => handleRemoveFund(fund._id)}
                  className="text-red-500 hover:text-red-700 text-xs font-black p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Multi-line Chart Container */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-between min-h-[400px]">
          <h3 className="text-sm font-black uppercase text-gray-500 tracking-wider mb-4">📈 Projected ₹10,000 Investment Trajectory</h3>
          
          {selectedFunds.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 font-bold italic text-sm p-12">
              Select mutual funds from the sidebar panel to render comparative charts.
            </div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <YAxis stroke="#94a3b8" tickFormatter={(val) => `₹${val}`} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Projected Capital']} />
                  <Legend />
                  {selectedFunds.map((fund, idx) => (
                    <Line
                      key={fund._id}
                      type="monotone"
                      dataKey={fund.schemeName}
                      stroke={borderHexColors[idx]}
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}