import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Moon, Sun, User, Shield, Monitor } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('displayName', displayName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
              <User size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Profile</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Your account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary-500/20">
                {user?.username?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user?.username}</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 mt-1">
                  <Shield size={12} /> {user?.role}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="input" placeholder="Enter display name" />
            </div>

            <button onClick={handleSave} className="btn-primary">
              {saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Monitor size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Appearance</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Customize the look and feel</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={20} className="text-primary-400" /> : <Sun size={20} className="text-amber-500" />}
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">Dark Mode</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{darkMode ? 'Currently using dark theme' : 'Currently using light theme'}</p>
                </div>
              </div>
              <button onClick={toggleDarkMode}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${darkMode ? 'bg-primary-600' : 'bg-zinc-300'}`}>
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ${darkMode ? 'left-7.5 translate-x-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Theme Preview */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => darkMode && toggleDarkMode()}
                className={`p-4 rounded-xl border-2 transition-all ${!darkMode ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}`}>
                <div className="w-full h-16 rounded-lg bg-white border border-zinc-200 mb-2 flex items-center justify-center">
                  <Sun size={20} className="text-amber-500" />
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Light</p>
              </button>
              <button onClick={() => !darkMode && toggleDarkMode()}
                className={`p-4 rounded-xl border-2 transition-all ${darkMode ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}`}>
                <div className="w-full h-16 rounded-lg bg-zinc-900 border border-zinc-700 mb-2 flex items-center justify-center">
                  <Moon size={20} className="text-primary-400" />
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Dark</p>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

