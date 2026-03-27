import { useState, useEffect } from 'react';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLeaves(); }, []);

  const loadLeaves = () => {
    setLoading(true);
    API.get('/leaves').then(res => setLeaves(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  const approve = async (id) => { await API.put(`/leaves/approve/${id}`); loadLeaves(); };
  const reject = async (id) => { await API.put(`/leaves/reject/${id}`); loadLeaves(); };

  const statusBadge = (status) => {
    const cls = { PENDING: 'badge-warning', APPROVED: 'badge-success', REJECTED: 'badge-danger' };
    return <span className={cls[status]}>{status}</span>;
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Leave Requests</h1>
        <p className="page-subtitle mt-1">{leaves.length} total requests</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="table-container mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary-500" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="table-header"><tr>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Employee</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Type</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">From</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">To</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Reason</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody>{leaves.map(l => (
              <tr key={l.id} className="table-row">
                <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">{l.employee?.name}</td>
                <td className="px-5 py-4"><span className="badge-info">{l.leaveType}</span></td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{l.startDate}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{l.endDate}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">{l.reason}</td>
                <td className="px-5 py-4">{statusBadge(l.status)}</td>
                <td className="px-5 py-4">
                  {l.status === 'PENDING' && (
                    <div className="flex gap-1">
                      <button onClick={() => approve(l.id)} className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors" title="Approve"><Check size={16} /></button>
                      <button onClick={() => reject(l.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors" title="Reject"><X size={16} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {!loading && leaves.length === 0 && <p className="text-center py-12 text-zinc-400">No leave requests</p>}
      </motion.div>
    </div>
  );
}

