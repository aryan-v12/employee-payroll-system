import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, User, Lock, ChevronRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('EMPLOYEE');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password, role);
        setIsRegister(false);
        alert('Registration successful! Please login.');
      } else {
        await login(username, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30 mb-4">
            <DollarSign size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">PayrollPro</h1>
          <p className="text-zinc-300 mt-1 font-medium">Employee Payroll Management</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <h2 className="text-xl font-bold text-white mb-1">
            {isRegister ? 'Create Account' : 'Welcome back'}
          </h2>
          <p className="text-zinc-300 text-sm mb-6">
            {isRegister ? 'Register to get started' : 'Sign in to continue'}
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-2">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:outline-none text-white placeholder:text-zinc-400 transition-all"
                  placeholder="Enter username" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-200 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:outline-none text-white placeholder:text-zinc-400 transition-all"
                  placeholder="Enter password" required />
              </div>
            </div>

            {isRegister && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm font-semibold text-zinc-200 mb-2">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:outline-none text-white transition-all">
                  <option value="EMPLOYEE" className="bg-zinc-900">Employee</option>
                  <option value="ADMIN" className="bg-zinc-900">Admin</option>
                </select>
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>{isRegister ? 'Create Account' : 'Sign In'}<ChevronRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-300 text-sm">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

