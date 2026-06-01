import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FundDetails from './pages/FundDetails';
import AiAdvisor from './pages/AiAdvisor';
import AiChatbot from './pages/AiChatbot';
import SipCalculator from './pages/SipCalculator';
import TopPerformers from './pages/TopPerformers';
import PortfolioDashboard from './pages/PortfolioDashboard';
// 🛠️ 1. ADD THESE TWO MISSING IMPORTS RIGHT HERE:
import FundComparison from './pages/FundComparison';
import ExpenseAnalyzer from './pages/ExpenseAnalyzer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-[calc(100vh-72px)]">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            
            {/* Here We are having a Fund element Where we Calculationg the Tracking route */}
            <Route path="/fund/:fundId" element={<FundDetails/>} />
            
            <Route path="/sip-calculator" element={<SipCalculator />} />
            <Route path="/top-performers" element={<TopPerformers />} />
            <Route path="/ai-advisor" element={<AiAdvisor />} />
            <Route path="/chat" element={<AiChatbot />} />

            {/* 🛠️ 2. REGISTER THESE TWO NEW ROUTES INSIDE THE MATRIX: */}
            <Route path="/compare" element={<FundComparison />} />
            <Route path="/fee-analyzer" element={<ExpenseAnalyzer />} />
            <Route path="/portfolio" element={<PortfolioDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;