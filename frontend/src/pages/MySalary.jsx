import { useState } from 'react';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { DollarSign, Search, Loader2 } from 'lucide-react';

export default function MySalary() {
  const [employeeId, setEmployeeId] = useState('');
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSalaries = () => {
    if (employeeId) {
      setLoading(true);
      API.get(`/salaries/${employeeId}`).then(res => setSalaries(res.data)).catch(console.error).finally(() => setLoading(false));
    }
  };

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const th = "px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider";

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">My Salary Slips</h1>
        <p className="page-subtitle mt-1">View your salary history and payslips</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6 mt-6 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Your Employee ID</label>
          <input type="number" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="input w-40" placeholder="e.g. 1" />
        </div>
        <button onClick={loadSalaries} className="btn-primary">
          <Search size={18} /> Load Salary History
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="table-container">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary-500" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="table-header"><tr>
              <th className={th}>Period</th><th className={th}>Basic</th><th className={th}>HRA</th>
              <th className={th}>DA</th><th className={th}>Bonus</th><th className={th}>Tax</th>
              <th className={th}>Deductions</th><th className={th}>Net Salary</th>
            </tr></thead>
            <tbody>{salaries.map(s => (
              <tr key={s.id} className="table-row">
                <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">{months[s.month]} {s.year}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">₹{s.basicSalary?.toLocaleString()}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">₹{s.hra?.toLocaleString()}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">₹{s.da?.toLocaleString()}</td>
                <td className="px-5 py-4"><span className="badge-success">+₹{s.bonus?.toLocaleString()}</span></td>
                <td className="px-5 py-4"><span className="badge-danger">-₹{s.tax?.toLocaleString()}</span></td>
                <td className="px-5 py-4"><span className="badge-danger">-₹{s.deductions?.toLocaleString()}</span></td>
                <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">₹{s.netSalary?.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {!loading && salaries.length === 0 && (
          <div className="text-center py-16">
            <DollarSign size={40} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
            <p className="text-zinc-400">Enter your Employee ID to view salary slips</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

