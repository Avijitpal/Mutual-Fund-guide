import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ExpenseAnalyzer() {
  const [inputs, setInputs] = useState({
    principal: 100000,
    expectedReturn: 12,
    lowExpense: 0.5,
    highExpense: 2.0
  });

  const [simulationData, setSimulationData] = useState([]);

  const handleCalculate = (e) => {
    e.preventDefault();
    const data = [];
    
    const principal = Number(inputs.principal);
    const growthRate = Number(inputs.expectedReturn) / 100;
    const netRateLow = growthRate - (Number(inputs.lowExpense) / 100);
    const netRateHigh = growthRate - (Number(inputs.highExpense) / 100);

    // Calculate compounding paths over regular 5-year interval chunks
    const yearsToSimulate = [5, 10, 15, 20];

    yearsToSimulate.forEach(year => {
      const lowCostValue = Math.round(principal * Math.pow(1 + netRateLow, year));
      const highCostValue = Math.round(principal * Math.pow(1 + netRateHigh, year));
      
      data.push({
        name: `Year ${year}`,
        Low_Expense: lowCostValue,
        High_Expense: highCostValue,
        Lost_Wealth: lowCostValue - highCostValue
      });
    });

    setSimulationData(data);
  };

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">💸 Expense Ratio Impact Calculator</h1>
        <p className="text-emerald-100 font-medium text-sm">Visualize how management fees impact your long-term compound growth portfolio valuation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Parameter Sliders Panel */}
        <form onSubmit={handleCalculate} className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-5">
          <h3 className="text-sm font-black uppercase text-gray-500 border-b pb-3">⚙️ Calculator Parameters</h3>
          
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Principal Capital (₹)</label>
            <input
              type="number" step="10000" min="10000"
              value={inputs.principal}
              onChange={(e) => setInputs({...inputs, principal: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 font-bold text-sm text-gray-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Expected Return ({inputs.expectedReturn}%)</label>
            <input
              type="range" min="5" max="25" step="0.5"
              value={inputs.expectedReturn}
              onChange={(e) => setInputs({...inputs, expectedReturn: e.target.value})}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Direct Fund Fee ({inputs.lowExpense}%)</label>
            <input
              type="range" min="0.1" max="1" step="0.05"
              value={inputs.lowExpense}
              onChange={(e) => setInputs({...inputs, lowExpense: e.target.value})}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Regular Fund Fee ({inputs.highExpense}%)</label>
            <input
              type="range" min="1.1" max="3.5" step="0.1"
              value={inputs.highExpense}
              onChange={(e) => setInputs({...inputs, highExpense: e.target.value})}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-black py-3 rounded-xl hover:bg-emerald-700 shadow-md transition-colors"
          >
            Run Impact Analysis
          </button>
        </form>

        {/* Output Bar Chart Rendering Target Wrapper Panel */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-md border border-gray-100 min-h-[400px] flex flex-col">
          <h3 className="text-sm font-black uppercase text-gray-500 tracking-wider mb-4">📊 Consolidated Compounding Fee Growth Decay Map</h3>
          
          {simulationData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 font-bold italic text-sm p-12">
              Click the button to run the mathematical modeling simulation.
            </div>
          ) : (
            <div className="w-full h-80 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simulationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Bar dataKey="Low_Expense" name="Low Fee Portfolio (Direct)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="High_Expense" name="High Fee Portfolio (Regular)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}