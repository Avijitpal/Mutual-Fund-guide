import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo Identity Link */}
        <Link to="/" className="text-2xl font-bold tracking-wider flex items-center gap-2">
          📊 <span className="hidden sm:inline">OptimaFunds</span> 
        </Link>
        
        {/* Navigation Group Area */}
        <div className="flex gap-5 items-center font-medium text-sm md:text-base">
          
          {/* ========================================== */}
          {/* 🌐 GLOBAL PERMANENT LINKS (Always Visible)  */}
          {/* ========================================== */}
          <Link to="/" className="hover:text-blue-200 transition-colors">Explore</Link>
          <Link to="/compare" className="hover:text-blue-200 transition-colors">📈 Compare</Link>
          <Link to="/fee-analyzer" className="hover:text-blue-200 transition-colors">💸 Fee Impact</Link>
          <Link to="/sip-calculator" className="hover:text-blue-200 transition-colors">SIP Calculator</Link>
          <Link to="/ai-advisor" className="hover:text-blue-200 transition-colors font-semibold text-purple-200">🤖 AI Advisor</Link>
          <Link to="/chat" className="hover:text-blue-200 transition-colors font-bold text-emerald-300">💬 AI Chat</Link>

          {/* ========================================== */}
          {/* 🔐 DYNAMIC CONDITIONAL LINKS              */}
          {/* ========================================== */}
          {user ? (
            // Authenticated Session View Layout State
            <div className="flex gap-4 items-center">
    {/* 💼 LINK TO THE NEW PORTFOLIO TRACKER VIEWER */}
    <Link to="/portfolio" className="hover:text-blue-200 transition-colors font-bold text-yellow-300 mr-2">💼 My Portfolio</Link>

    <span className="text-blue-100 hidden lg:inline">👋 Welcome, {user.name}</span>
    <button 
      onClick={handleLogout} 
      className="bg-red-500 px-4 py-1.5 rounded-lg hover:bg-red-600 transition-colors shadow font-semibold"
    >
      Logout
    </button>
  </div>
          ) : (
            // Unauthenticated Guest Session View Layout State
            <div className="flex gap-3 items-center pl-2 border-l border-blue-500">
              <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
              <Link 
                to="/register" 
                className="bg-emerald-500 px-4 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors shadow font-semibold"
              >
                Register
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </nav>
  );
}