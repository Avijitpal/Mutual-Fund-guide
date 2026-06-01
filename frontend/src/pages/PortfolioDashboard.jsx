import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioSummary = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/portfolio/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(res.data);
    } catch (err) {
      console.error("Failed fetching portfolio analytics summary state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioSummary();
  }, []);

  const handleToggleSip = async (holdingId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/portfolio/toggle-sip`, { holdingId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPortfolioSummary(); // Refresh balances immediately after toggle
    } catch (err) {
      console.error("Failed updating background SIP status:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-12 text-center font-bold text-gray-400">
        Compiling active ledger P&L balances... ⏳
      </div>
    );
  }

  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <div className="container mx-auto p-8 max-w-2xl text-center space-y-4">
        <div className="bg-amber-50 border border-amber-100 text-amber-900 rounded-3xl p-12 font-bold italic">
          💼 Your Virtual Ledger Wallet is empty! Go explore our fund catalogs and place mock purchases to generate tracking stats.
        </div>
      </div>
    );
  }

  const { summary } = portfolio;

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      {/* Metrics Scoreboard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 bg-slate-900 text-white rounded-3xl shadow-xl p-6 border border-slate-800">
        <div className="p-4 border-r border-slate-800 last:border-0">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Portfolio Valuation</p>
          <h2 className="text-2xl font-black mt-1 text-blue-400">₹{Math.round(summary.currentPortfolioValue).toLocaleString('en-IN')}</h2>
        </div>
        <div className="p-4 border-r border-slate-800 last:border-0">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Invested Principal</p>
          <h2 className="text-2xl font-black mt-1 text-slate-100">₹{summary.totalInvestedCapital.toLocaleString('en-IN')}</h2>
        </div>
        <div className="p-4 border-r border-slate-800 last:border-0">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Absolute Returns (P&L)</p>
          <h2 className={`text-2xl font-black mt-1 ${summary.overallPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.overallPnL >= 0 ? '+' : ''}₹{Math.round(summary.overallPnL).toLocaleString('en-IN')}
          </h2>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Return Rate</p>
          <h2 className={`text-2xl font-black mt-1 ${summary.overallReturnsPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.overallReturnsPercentage.toFixed(2)}%
          </h2>
        </div>
      </div>

      {/* Holdings Details Grid Ledger */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/70 border-b">
          <h3 className="font-black text-gray-800 text-sm uppercase tracking-wide">📦 Current Asset Inventory Stack</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-medium">
            <thead className="bg-gray-100 text-[10px] text-gray-400 font-black uppercase border-b">
              <tr>
                <th className="px-6 py-4">Mutual Fund Details</th>
                <th className="px-6 py-4">Total Units</th>
                <th className="px-6 py-4">Invested Capital</th>
                <th className="px-6 py-4">Current Value</th>
                <th className="px-6 py-4">Profit / Loss</th>
                <th className="px-6 py-4 text-center">Automated SIP Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {portfolio.holdings.map((holding) => (
                <tr key={holding.holdingId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 max-w-xs">
                    <p className="font-bold text-gray-950 truncate">{holding.schemeName}</p>
                    <span className="text-[9px] bg-gray-100 font-extrabold text-gray-500 rounded px-1.5 py-0.5 uppercase mt-1 inline-block">
                      {holding.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">{holding.totalUnits.toFixed(4)}</td>
                  <td className="px-6 py-4 font-bold text-gray-600">₹{holding.totalInvested.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">₹{Math.round(holding.currentValue).toLocaleString('en-IN')}</td>
                  <td className={`px-6 py-4 font-bold ${holding.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {holding.pnl >= 0 ? '+' : ''}{holding.returnsPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleSip(holding.holdingId)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors border shadow-sm ${holding.sipStatus.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                    >
                      {holding.sipStatus.isActive ? `🟢 SIP: ₹${holding.sipStatus.amount}/mo` : '⚫ Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}