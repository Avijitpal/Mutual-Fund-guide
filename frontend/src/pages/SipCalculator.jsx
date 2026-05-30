import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);

  // Financial compounding evaluation logic
  const calculateMaturity = () => {
    const P = monthlyInvestment;
    const i = (expectedReturn / 100) / 12;
    const n = years * 12;

    const totalInvested = P * n;
    // Standard future annuity formula adjusted for monthly payments at start of period
    const maturityValue = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const wealthGained = Math.max(0, maturityValue - totalInvested);

    return {
      invested: Math.round(totalInvested),
      gained: Math.round(wealthGained),
      total: Math.round(maturityValue)
    };
  };

  const { invested, gained, total } = calculateMaturity();

  // Map data values neatly for our visual allocation Pie chart
  const chartData = [
    { name: 'Total Invested Capital', value: invested },
    { name: 'Estimated Wealth Gain', value: gained }
  ];

  const COLORS = ['#3b82f6', '#10b981']; // Fintech Blue & Emerald Green

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 mb-2">💰 SIP Wealth Projection Tool</h1>
        <p className="text-gray-500 font-medium text-sm">Estimate the long-term compounding potential of your systematic investments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Interactive Control Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-md border border-gray-100 space-y-6">
          <div>
            <div className="flex justify-between font-bold text-gray-700 mb-2">
              <span>Monthly Investment</span>
              <span className="text-blue-600">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
            </div>
            <input type="range" min="500" max="100000" step="500" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div>
            <div className="flex justify-between font-bold text-gray-700 mb-2">
              <span>Expected Return Rate</span>
              <span className="text-emerald-600">{expectedReturn}% p.a.</span>
            </div>
            <input type="range" min="1" max="30" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          </div>

          <div>
            <div className="flex justify-between font-bold text-gray-700 mb-2">
              <span>Investment Time Horizon</span>
              <span className="text-purple-600">{years} Years</span>
            </div>
            <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm font-medium text-gray-500">
              <span>Invested Capital:</span>
              <span className="font-bold text-gray-900">₹{invested.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500">
              <span>Wealth Growth:</span>
              <span className="font-bold text-emerald-600">₹{gained.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-extrabold text-gray-900 border-t border-dashed">
              <span>Total Maturity Value:</span>
              <span className="text-xl font-black text-blue-700">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Right Graphical Visualizer Canvas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col justify-center items-center">
          <h3 className="font-bold text-gray-800 text-lg mb-4 text-center">Asset Allocation Matrix Breakdown</h3>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={4} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}