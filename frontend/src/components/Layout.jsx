import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, LayoutDashboard, Users, Building2, DollarSign,
  CalendarDays, Settings, ChevronLeft, ChevronRight, Moon, Sun
} from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = isAdmin()
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/employees', label: 'Employees', icon: Users },
        { to: '/departments', label: 'Departments', icon: Building2 },
        { to: '/leaves', label: 'Leaves', icon: CalendarDays },
        { to: '/settings', label: 'Settings', icon: Settings },
      ]
    : [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/my-salary', label: 'My Salary', icon: DollarSign },
        { to: '/my-leaves', label: 'My Leaves', icon: CalendarDays },
        { to: '/settings', label: 'Settings', icon: Settings },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-72'} transition-all duration-300 ease-in-out flex flex-col
        bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 relative`}>

        {/* Logo */}
        <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-6'} h-16 border-b border-zinc-200 dark:border-zinc-800`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <DollarSign size={18} className="text-white" />
            </div>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                PayrollPro
              </motion.span>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10">
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                  } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : ''}>
                <Icon size={20} className={active ? 'text-primary-600 dark:text-primary-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'} />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className={`px-3 py-2 ${collapsed ? 'flex justify-center' : ''}`}>
          <button onClick={toggleDarkMode}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200
              text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${collapsed ? 'justify-center' : ''}`}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* User Section */}
        <div className={`p-3 border-t border-zinc-200 dark:border-zinc-800 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? 'flex-col' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{user?.username}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 uppercase tracking-wider">{user?.role}</span>
              </div>
            )}
          </div>
          <button onClick={handleLogout}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

