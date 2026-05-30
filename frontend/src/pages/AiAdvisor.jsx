import { useState } from 'react';
import axios from 'axios';
import FundCard from '../components/FundCard';

export default function AiAdvisor() {
  const [profile, setProfile] = useState({
    riskTolerance: 'Moderate',
    investmentHorizon: '5',
    primaryGoal: 'Long-term wealth accumulation',
    monthlyBudget: '5000'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/advisor/recommend`, profile);
      setResult(response.data);
    } catch (err) {
      console.error("AI Allocation retrieval fault:", err);
      alert("Error communicating with the AI Advisor. Make sure your server is running and your API key is configured!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      {/* Page Title Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-3xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">🤖 Smart AI Robo-Advisor</h1>
        <p className="text-purple-100 font-medium text-sm">Orchestrate machine learning to evaluate profile constraints and map customized asset allocation models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Interactive Questionnaire Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-5">
          <h3 className="text-lg font-bold text-gray-950 border-b pb-3 border-gray-100">📋 Investor Profile Constraints</h3>
          
          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Risk Appetite Profile</label>
            <select 
              value={profile.riskTolerance}
              onChange={(e) => setProfile({...profile, riskTolerance: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-sm text-gray-800 focus:outline-none focus:border-purple-500"
            >
              <option value="Conservative">🛡️ Conservative (Low Volatility risk)</option>
              <option value="Moderate">⚖️ Moderate (Balanced growth)</option>
              <option value="Aggressive">⚡ Aggressive (High growth focus)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Time Horizon: {profile.investmentHorizon} Years</label>
            <input 
              type="range" min="1" max="25" step="1"
              value={profile.investmentHorizon}
              onChange={(e) => setProfile({...profile, investmentHorizon: e.target.value})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
              <span>1 YR</span>
              <span>12 YRS</span>
              <span>25 YRS</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Primary Capital Objective</label>
            <select 
              value={profile.primaryGoal}
              onChange={(e) => setProfile({...profile, primaryGoal: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-sm text-gray-800 focus:outline-none focus:border-purple-500"
            >
              <option value="Retirement security planning">🌅 Retirement Nest Egg Planning</option>
              <option value="Long-term wealth accumulation">📈 Multi-Asset Wealth Accumulation</option>
              <option value="Tax saving options optimization">🛑 Tax Saving Optimization</option>
              <option value="Emergency liquid capital reserve creation">🌊 High Liquidity Emergency Fund Setup</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-500 mb-2">Target Monthly Budget (₹)</label>
            <input 
              type="number" step="500" min="500" max="100000"
              value={profile.monthlyBudget}
              onChange={(e) => setProfile({...profile, monthlyBudget: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-sm text-gray-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Analyzing Portfolios... 🧠" : "Generate Custom AI Portfolio"}
          </button>
        </form>

        {/* Right Side: Output Results Area Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="bg-white rounded-3xl p-12 text-center border shadow-sm space-y-4">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 font-bold text-lg animate-pulse">Gemini Engine parsing institutional parameters... ⏳</p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-purple-50/50 border border-purple-100 rounded-3xl p-12 text-center text-purple-900 font-semibold">
              💡 Complete the questionnaire criteria form on the left to see your personalized, AI-curated portfolio allocation.
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fadeIn">
              {/* AI Strategic Advice Callout */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 border-l-4 border-l-purple-600">
                <h4 className="font-black text-purple-900 uppercase text-xs tracking-wider mb-2">💡 Strategic Allocation Advice</h4>
                <p className="text-gray-700 font-medium text-sm leading-relaxed">{result.rationale}</p>
              </div>

              {/* Curated Recommendations List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.recommendations.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="bg-purple-50 px-5 py-3 border-b border-purple-100 text-xs font-extrabold text-purple-800">
                      🎯 Advisor Target Pick #{idx + 1}
                    </div>
                    <div className="p-4 flex-1">
                      <FundCard fund={item.fundDetails} />
                    </div>
                    <div className="bg-gray-50 px-5 py-4 border-t text-xs font-medium text-gray-600 italic leading-snug">
                      <span className="font-black text-purple-700 block not-italic mb-1 uppercase tracking-wider">AI Recommendation Rationale:</span>
                      "{item.reasonWhy}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}