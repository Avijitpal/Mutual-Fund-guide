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
          📊 <span className="hidden sm:inline">FinTech</span> Funds
        </Link>
        
        {/* Navigation Group Area */}
        <div className="flex gap-6 items-center font-medium">
          
          {/* ========================================== */}
          {/* 🌐 GLOBAL PERMANENT LINKS (Always Visible)  */}
          {/* ========================================== */}
          <Link to="/" className="hover:text-blue-200 transition-colors">Explore</Link>
          <Link to="/top-performers" className="hover:text-blue-200 transition-colors">🏆 Top Performers</Link>
          <Link to="/ai-advisor" className="hover:text-blue-200 transition-colors">🤖 AI Advisor</Link>
          <Link to="/sip-calculator" className="hover:text-blue-200 transition-colors">SIP Calculator</Link>

          {/* ========================================== */}
          {/* 🔐 DYNAMIC CONDITIONAL LINKS              */}
          {/* ========================================== */}
          {user ? (
            // Authenticated Session View Layout State
            <div className="flex gap-4 items-center">
              <span className="text-blue-100 hidden md:inline">👋 Welcome, {user.name}</span>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 px-4 py-1.5 rounded-lg hover:bg-red-600 transition-colors shadow"
              >
                Logout
              </button>
            </div>
          ) : (
            // Unauthenticated Guest Session View Layout State
            <div className="flex gap-3 items-center">
              <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
              <Link 
                to="/register" 
                className="bg-emerald-500 px-4 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors shadow"
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