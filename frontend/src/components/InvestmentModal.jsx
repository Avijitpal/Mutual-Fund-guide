import { useState } from 'react';
import axios from 'axios';

export default function InvestmentModal({ fund, isOpen, onClose, onInvestmentSuccess }) {
  const [amount, setAmount] = useState('5000');
  const [type, setType] = useState('LUMP_SUM');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !fund) return null;

  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post(`${API_URL}/portfolio/buy`, {
        fundId: fund._id,
        amount: Number(amount),
        type: type
      }, config);

      alert(`🎉 Successfully invested ₹${Number(amount).toLocaleString('en-IN')} into ${fund.schemeName}!`);
      if (onInvestmentSuccess) onInvestmentSuccess();
      onClose();
    } catch (err) {
      console.error("Transaction deployment fault:", err);
      alert(err.response?.data?.error || "Transaction failed. Please make sure you are logged in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        {/* Header Block */}
        <div className="bg-blue-600 text-white p-6">
          <span className="text-[10px] bg-blue-500 text-blue-100 font-black px-2.5 py-1 rounded-md uppercase tracking-wider block w-max mb-2">
            {fund.category}
          </span>
          <h3 className="text-lg font-black leading-snug truncate">{fund.schemeName}</h3>
          <p className="text-xs text-blue-200 font-medium mt-1">Current NAV: ₹{fund.nav}</p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleInvestmentSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Investment Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('LUMP_SUM')}
                className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${type === 'LUMP_SUM' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
              >
                💰 Lump Sum
              </button>
              <button
                type="button"
                onClick={() => setType('SIP')}
                className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${type === 'SIP' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
              >
                ⏱️ Monthly SIP
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">
              {type === 'SIP' ? 'Monthly Allocation Amount (₹)' : 'One-Time Principal Capital (₹)'}
            </label>
            <input
              type="number" step="500" min="500" max="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="bg-gray-50 border p-4 rounded-xl text-[11px] text-gray-500 font-medium leading-relaxed">
            💡 Estimated Units to Acquire: <span className="font-bold text-gray-900">{fund.nav > 0 ? (Number(amount) / fund.nav).toFixed(4) : 0} units</span>
            {type === 'SIP' && <span className="block mt-1 font-semibold text-blue-600">Note: Automation script engine will run recurring deductions every month.</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 shadow-md transition-colors text-sm disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Mock Buy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}