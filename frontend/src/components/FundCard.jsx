import { useState } from 'react';
import { Link } from 'react-router-dom';
import InvestmentModal from './InvestmentModal'; // ◄── 1. Add Import

export default function FundCard({ fund }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // ◄── 2. Add State Hook

  if (!fund) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md uppercase">
            {fund.category}
          </span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${fund.riskLevel === 'High' || fund.riskLevel === 'Very High' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            🎯 {fund.riskLevel} Risk
          </span>
        </div>
        <h3 className="font-black text-gray-900 text-md tracking-tight leading-snug line-clamp-2 mb-1">{fund.schemeName}</h3>
        <p className="text-xs font-bold text-gray-400 mb-4">{fund.fundHouse}</p>
        
        <div className="grid grid-cols-2 gap-4 border-t border-b py-3 border-gray-50 mb-4">
          <div>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Current NAV</span>
            <span className="font-mono font-bold text-sm text-gray-900">₹{fund.nav}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Expense Ratio</span>
            <span className="font-bold text-sm text-gray-800">{fund.expenseRatio}%</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5">
        <Link 
          to={`/fund/${fund._id}`} 
          className="flex-1 bg-gray-50 text-gray-700 font-bold text-xs py-2.5 rounded-xl hover:bg-gray-100 border text-center transition-colors"
        >
          View Details
        </Link>
        
        {/* 🛒 THE INVESTMENT MODAL TRIGGER BUTTON TRIGGER ROW */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-blue-600 text-white font-black text-xs py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          Invest Now
        </button>
      </div>

      {/* 🛠️ INJECT THE INVESTMENT MODAL BOUNDARY MARKER CARD EDGE */}
      <InvestmentModal 
        fund={fund} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}