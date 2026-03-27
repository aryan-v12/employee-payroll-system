import { useState } from 'react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, CalendarDays, Loader2 } from 'lucide-react';

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });

  const loadLeaves = () => {
    if (employeeId) {
      setLoading(true);
      API.get(`/leaves/employee/${employeeId}`).then(res => setLeaves(res.data)).catch(console.error).finally(() => setLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/leaves/apply', { ...form, employee: { id: parseInt(employeeId) } });
    setShowForm(false);
    setForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
    loadLeaves();
  };

  const statusBadge = (status) => {
    const cls = { PENDING: 'badge-warning', APPROVED: 'badge-success', REJECTED: 'badge-danger' };
    return <span className={cls[status]}>{status}</span>;
  };

  const th = "px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider";

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">My Leaves</h1>
        <p className="page-subtitle mt-1">Apply for leave and track your requests</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6 mt-6 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Your Employee ID</label>
          <input type="number" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="input w-40" placeholder="e.g. 1" />
        </div>
        <button onClick={loadLeaves} className="btn-primary"><Search size={18} /> Load Leaves</button>
        <button onClick={() => setShowForm(!showForm)} className="btn-success"><Plus size={18} /> Apply Leave</button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="card p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <select value={form.leaveType} onChange={e => setForm({...form, leaveType: e.target.value})} className="input">
              <option value="CASUAL">Casual</option><option value="SICK">Sick</option><option value="EARNED">Earned</option>
            </select>
            <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input" required />
            <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="input" required />
            <input placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="input" />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-success">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary"><X size={16} /> Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="table-container">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary-500" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="table-header"><tr>
              <th className={th}>Type</th><th className={th}>From</th>
              <th className={th}>To</th><th className={th}>Reason</th>
              <th className={th}>Status</th>
            </tr></thead>
            <tbody>{leaves.map(l => (
              <tr key={l.id} className="table-row">
                <td className="px-5 py-4"><span className="badge-info">{l.leaveType}</span></td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{l.startDate}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{l.endDate}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{l.reason}</td>
                <td className="px-5 py-4">{statusBadge(l.status)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {!loading && leaves.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays size={40} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
            <p className="text-zinc-400">Enter your Employee ID and click "Load Leaves"</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

