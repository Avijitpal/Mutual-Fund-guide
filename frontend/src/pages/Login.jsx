import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/'); // Redirect to the dashboard layout upon token verification
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md pt-20">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-950">🔐 Welcome Back</h2>
        <p className="text-gray-500 text-center mb-6 text-sm font-medium">Access your personal portfolio ledger</p>
        
        {error && <p className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl mb-5 text-sm font-medium">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 font-semibold text-gray-600 text-sm">Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>
          <div>
            <label className="block mb-1.5 font-semibold text-gray-600 text-sm">Security Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>
          
          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400">
            {submitting ? 'Verifying Session... ⏳' : 'Login Securely'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-600 font-medium">
          New to the platform? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}