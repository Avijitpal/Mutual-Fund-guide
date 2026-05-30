import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md pt-16">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-950">📝 Get Started</h2>
        <p className="text-gray-500 text-center mb-6 text-sm font-medium">Build a secure financial tracking portal</p>
        
        {error && <p className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl mb-5 text-sm font-medium">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 font-semibold text-gray-600 text-sm">Full Name</label>
            <input type="text" placeholder="John Doe" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>
          <div>
            <label className="block mb-1.5 font-semibold text-gray-600 text-sm">Email Address</label>
            <input type="email" placeholder="john@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
          </div>
          <div>
            <label className="block mb-1.5 font-semibold text-gray-600 text-sm">Password (Min 6 characters)</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required minLength={6} />
          </div>
          
          <button type="submit" disabled={submitting}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md disabled:bg-gray-400">
            {submitting ? 'Creating Secure Profile... ⏳' : 'Register Profile'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-600 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}