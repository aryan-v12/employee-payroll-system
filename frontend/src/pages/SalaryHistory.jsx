import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, ArrowLeft, Loader2 } from 'lucide-react';

export default function SalaryHistory() {
  const { employeeId } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [bonus, setBonus] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => { loadSalaries(); }, [employeeId]);

  const loadSalaries = () => {
    setLoading(true);
    API.get(`/salaries/${employeeId}`).then(res => setSalaries(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  const generateSalary = async () => {
    try {
      await API.post(`/salaries/generate/${employeeId}?bonus=${bonus}&deductions=${deductions}`);
      loadSalaries();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Error generating salary');
    }
  };

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const th = "px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider";

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/employees" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-4">
          <ArrowLeft size={16} /> Back to Employees
        </Link>
        <h1 className="page-title">Salary History</h1>
        <p className="page-subtitle mt-1">Employee #{employeeId} &mdash; {salaries.length} records</p>
      </motion.div>

      {isAdmin() && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-6 mb-6 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Bonus</label>
            <input type="number" value={bonus} onChange={e => setBonus(e.target.value)} className="input w-36" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Deductions</label>
            <input type="number" value={deductions} onChange={e => setDeductions(e.target.value)} className="input w-36" />
          </div>
          <button onClick={generateSalary} className="btn-success">
            <DollarSign size={18} /> Generate Salary
          </button>
        </motion.div>
      )}

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
        {!loading && salaries.length === 0 && <p className="text-center py-12 text-zinc-400">No salary records found</p>}
      </motion.div>
    </div>
  );
}

