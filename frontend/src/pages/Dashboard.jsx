import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { Users, Building2, CalendarDays, DollarSign, TrendingUp, ArrowUpRight, Clock, UserCheck, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const StatCard = ({ label, value, icon: Icon, gradient, delay, to }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
    <Link to={to} className="block card-hover p-6 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{value ?? '—'}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        View details <ArrowUpRight size={12} />
      </div>
    </Link>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="card p-6">
    <div className="flex items-start justify-between">
      <div>
        <div className="skeleton h-4 w-24 mb-3" />
        <div className="skeleton h-8 w-16" />
      </div>
      <div className="skeleton w-12 h-12 rounded-2xl" />
    </div>
  </div>
);

const ChartCard = ({ title, children, delay = 0.3, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className={`card p-6 ${className}`}>
    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{title}</h3>
    {children}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-zinc-700">
        <p className="font-medium">{label || payload[0].name}</p>
        <p className="text-zinc-300">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ departments: [], leaves: [], salaries: [] });
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      API.get('/dashboard/summary').then(res => setSummary(res.data)).catch(console.error).finally(() => setLoading(false));
      // Load chart data
      Promise.all([
        API.get('/departments'),
        API.get('/leaves'),
        API.get('/employees')
      ]).then(([deptRes, leaveRes, empRes]) => {
        // Department-wise employee count
        const departments = deptRes.data.map(d => ({ name: d.name, employees: d.employeeCount || 0 }));
        // Leave status breakdown
        const leaveMap = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
        leaveRes.data.forEach(l => { if (leaveMap[l.status] !== undefined) leaveMap[l.status]++; });
        const leaves = Object.entries(leaveMap).map(([name, value]) => ({ name, value }));
        // Salary distribution (top 8 employees by salary)
        const salaries = empRes.data
          .filter(e => e.basicSalary)
          .sort((a, b) => b.basicSalary - a.basicSalary)
          .slice(0, 8)
          .map(e => ({ name: e.name?.split(' ')[0], salary: e.basicSalary }));
        setChartData({ departments, leaves, salaries });
      }).catch(console.error).finally(() => setChartsLoading(false));
    } else {
      setLoading(false);
      setChartsLoading(false);
    }
  }, []);

  const cards = [
    { label: 'Total Employees', value: summary?.totalEmployees, icon: Users, gradient: 'bg-gradient-to-br from-blue-500 to-blue-600', to: '/employees' },
    { label: 'Active Employees', value: summary?.activeEmployees, icon: UserCheck, gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600', to: '/employees' },
    { label: 'Departments', value: summary?.totalDepartments, icon: Building2, gradient: 'bg-gradient-to-br from-purple-500 to-purple-600', to: '/departments' },
    { label: 'Pending Leaves', value: summary?.pendingLeaves, icon: Clock, gradient: 'bg-gradient-to-br from-amber-500 to-amber-600', to: '/leaves' },
  ];

  const leaveColors = { PENDING: '#f59e0b', APPROVED: '#22c55e', REJECTED: '#ef4444' };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="page-title text-3xl">Welcome back, {user?.username} 👋</h1>
        <p className="page-subtitle mt-1">Here's what's happening with your payroll system today.</p>
      </motion.div>

      {isAdmin() ? (
        <>
          {/* Bento Grid Stats */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((card, i) => <StatCard key={card.label} {...card} delay={i * 0.1} />)}
            </div>
          )}

          {/* Charts Section */}
          {chartsLoading ? (
            <div className="flex items-center justify-center py-16 mt-8">
              <Loader2 size={24} className="animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Department-wise Employees Bar Chart */}
              {chartData.departments.length > 0 && (
                <ChartCard title="Department-wise Employees" delay={0.3}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData.departments} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="employees" radius={[8, 8, 0, 0]}>
                        {chartData.departments.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* Leave Status Pie Chart */}
              {chartData.leaves.some(l => l.value > 0) && (
                <ChartCard title="Leave Status Overview" delay={0.4}>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={chartData.leaves} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                        paddingAngle={4} dataKey="value" strokeWidth={0}>
                        {chartData.leaves.map((entry) => (
                          <Cell key={entry.name} fill={leaveColors[entry.name] || '#6366f1'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={(value) => <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* Salary Distribution Bar Chart */}
              {chartData.salaries.length > 0 && (
                <ChartCard title="Top Salaries (₹)" delay={0.5} className="lg:col-span-2">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData.salaries} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="salary" radius={[8, 8, 0, 0]} fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>
          )}

          {/* Quick Actions Bento */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link to="/employees" className="card-hover p-6 group md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                  <TrendingUp size={22} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Manage Employees</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Add, edit, or remove employees from the system</p>
                </div>
              </div>
            </Link>
            <Link to="/departments" className="card-hover p-6 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                  <Building2 size={22} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Departments</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Organize teams</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to="/my-salary" className="card-hover p-8 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
              <DollarSign size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">My Salary Slips</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">View your salary history and payslips</p>
            <div className="mt-4 flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 font-medium">
              View <ArrowUpRight size={14} />
            </div>
          </Link>
          <Link to="/my-leaves" className="card-hover p-8 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
              <CalendarDays size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">My Leaves</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Apply for leave and track your requests</p>
            <div className="mt-4 flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 font-medium">
              View <ArrowUpRight size={14} />
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

