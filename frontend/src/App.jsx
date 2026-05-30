import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login'
import Register from './pages/Register';
import FundDetails from './pages/FundDetails'
import AiAdvisor from './pages/AiAdvisor';
// Calculator component
import SipCalculator from './pages/SipCalculator';
import TopPerformers from './pages/TopPerformers';
// Placeholder layouts for the pages we will build over the next few days

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
            {/*Here We are having a Fund element Where we Calculationg the Tracking route*/}
            <Route path="/fund/:fundId" element={<FundDetails/>} />
            <Route path="/sip-calculator" element={<SipCalculator />} />
           <Route path="/top-performers" element={<TopPerformers />} />
           <Route path="/ai-advisor" element={<AiAdvisor />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;