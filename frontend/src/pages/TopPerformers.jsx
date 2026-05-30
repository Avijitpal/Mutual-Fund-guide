import { useState, useEffect } from 'react';
import { fundAPI } from '../services/api';
import FundCard from '../components/FundCard';

export default function TopPerformers() {
  const [allFunds, setAllFunds] = useState([]);
  const [activeTab, setActiveTab] = useState('large');
  // 🕒 Tracks the active timeline slice: 1M | 6M | 1Y | 3Y | 5Y
  const [timeframe, setTimeframe] = useState('1Y'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fundAPI.getAll()
      .then(res => setAllFunds(res.data.data))
      .catch(err => console.error('Error fetching leaderboard records:', err))
      .finally(() => setLoading(false));
  }, []);

  // Institutional sorting and segmentation logic engine
  const getSegmentFunds = () => {
    let filtered = [];
    
    // 1. Sort by market capitalization tier groups based on AUM indicators
    if (activeTab === 'large') {
      filtered = allFunds.filter(f => f.aum >= 20000);
    } else if (activeTab === 'mid') {
      filtered = allFunds.filter(f => f.aum >= 5000 && f.aum < 20000);
    } else if (activeTab === 'small') {
      filtered = allFunds.filter(f => f.aum < 5000 && !f.subCategory?.toLowerCase().includes('flexi'));
    } else if (activeTab === 'flexi') {
      filtered = allFunds.filter(f => f.subCategory?.toLowerCase().includes('flexi') || f.schemeName?.toLowerCase().includes('flexi'));
      if (filtered.length === 0) {
        filtered = allFunds.filter(f => f.category === 'Equity');
      }
    }

    // 🕒 2. Map dynamic return property keys based on selected timeframe
    let returnKey = 'oneYear'; 
    if (timeframe === '1M') returnKey = 'oneMonth';
    if (timeframe === '6M') returnKey = 'sixMonth';
    if (timeframe === '3Y') returnKey = 'threeYear'; // ◄── New 3 Year mapping
    if (timeframe === '5Y') returnKey = 'fiveYear';  // ◄── New 5 Year mapping

    // 🏆 3. Sort by chosen performance yield descending and slice top 3 podium spots
    return filtered
      .sort((a, b) => (b.returns?.[returnKey] || 0) - (a.returns?.[returnKey] || 0))
      .slice(0, 3);
  };

  const segmentPerformers = getSegmentFunds();

  const tabs = [
    { id: 'large', name: '🏢 Large Cap', desc: 'Stable, blue-chip market leaders (AUM > ₹20k Cr)' },
    { id: 'mid', name: '🚀 Mid Cap', desc: 'High-growth mid-sized enterprises (AUM ₹5k-20k Cr)' },
    { id: 'small', name: '⚡ Small Cap', desc: 'Aggressive, emerging startups (AUM < ₹5k Cr)' },
    { id: 'flexi', name: '🔄 Flexi Cap', desc: 'Dynamic asset allocation across all market caps' },
  ];

  // Configured timeline intervals for selection controls
  const timeframes = [
    { id: '1M', label: '1 Month' },
    { id: '6M', label: '6 Months' },
    { id: '1Y', label: '1 Year' },
    { id: '3Y', label: '3 Years' }, // ◄── Added
    { id: '5Y', label: '5 Years' }  // ◄── Added
  ];

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">🏆 Institutional Leaderboard Matrix</h1>
          <p className="text-blue-100 font-medium text-sm">Real-time sector analytics tracking the top 3 highest yielding funds by segment allocation</p>
        </div>

        {/* 🕒 Chronological Multi-Year Selector Container */}
        <div className="flex flex-wrap bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 gap-1">
          {timeframes.map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`px-4 py-2 text-xs font-black rounded-lg transition-all duration-150 ${
                timeframe === item.id
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Selectors Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-100 p-2 rounded-2xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-md transform scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Segment Context Summary Alert */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm font-semibold text-blue-800 text-center shadow-sm">
        🎯 Top performers evaluated by <span className="underline font-black text-indigo-700">{timeframes.find(t => t.id === timeframe).label} returns</span> within: <span>{tabs.find(t => t.id === activeTab).desc}</span>
      </div>

      {/* Podium Grid Render Layout */}
      {loading ? (
        <p className="text-center text-gray-500 animate-pulse text-xl pt-10">Auditing sector variables... ⏳</p>
      ) : segmentPerformers.length === 0 ? (
        <p className="text-center text-gray-500 bg-white p-12 rounded-2xl border">No seeded records fit this exact capitalization bracket currently.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segmentPerformers.map((fund, index) => {
            const podiumStyles = [
              'border-amber-400 ring-4 ring-amber-400/20 shadow-amber-100', // Rank 1: Gold Theme
              'border-slate-300 ring-4 ring-slate-300/20 shadow-slate-100', // Rank 2: Silver Theme
              'border-orange-300 ring-4 ring-orange-300/20 shadow-orange-100' // Rank 3: Bronze Theme
            ];
            const badges = ['🥇 Grand Performer', '🥈 Rank 2 Choice', '🥉 Rank 3 Choice'];

            // Safely retrieve the targeted dynamic return property value
            let returnKey = 'oneYear';
            if (timeframe === '1M') returnKey = 'oneMonth';
            if (timeframe === '6M') returnKey = 'sixMonth';
            if (timeframe === '3Y') returnKey = 'threeYear';
            if (timeframe === '5Y') returnKey = 'fiveYear';
            
            const currentYield = fund.returns?.[returnKey];

            return (
              <div key={fund._id} className={`relative rounded-2xl border p-1 bg-gradient-to-b from-white to-gray-50/30 shadow-xl ${podiumStyles[index]}`}>
                <div className="absolute -top-3 left-6 bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                  <span>{badges[index]}</span>
                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                    {currentYield ? `${currentYield.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
                <div className="pt-4">
                  <FundCard fund={fund} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}