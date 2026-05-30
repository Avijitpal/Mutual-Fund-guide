import { Link } from 'react-router-dom';

export default function FundCard({ fund }) {
  // Utility function to color-code metrics based on performance yield
  const getReturnColor = (value) => {
    if (value > 15) return 'text-emerald-600 font-bold'; // Premium performers
    if (value > 0) return 'text-blue-600 font-semibold'; // Positive growth
    return 'text-red-600 font-medium'; // Negative growth
  };

  // Safely extract the valid MongoDB Hex Id reference string
  const fundId = fund._id || fund.id;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-700">
          {fund.schemeName}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getReturnColor(fund.returns?.oneYear)} bg-gray-100`}>
          {fund.returns?.oneYear?.toFixed(1)}% (1Y)
        </span>
      </div>
      
      <p className="text-sm text-gray-500 mb-4 font-medium tracking-tight">{fund.fundHouse}</p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5 text-sm border-t border-b border-gray-100 py-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Current NAV:</span>
          <span className="font-semibold text-gray-900">₹{fund.nav?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expense Ratio:</span>
          <span className="font-semibold text-gray-900">{fund.expenseRatio?.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Category:</span>
          <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-lg text-xs font-medium">
            {fund.category}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Risk Profile:</span>
          <span className={`font-medium ${fund.riskLevel === 'Very High' ? 'text-red-700' : 'text-gray-900'}`}>
            {fund.riskLevel}
          </span>
        </div>
      </div>

      <Link 
        to={`/fund/${fundId}`}
        className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
      >
        View Complex Analytics     
      </Link>
    </div>
  );
}