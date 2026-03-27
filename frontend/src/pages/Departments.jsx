import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Building2, X, Loader2, Users, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDept, setExpandedDept] = useState(null);
  const [deptEmployees, setDeptEmployees] = useState({});
  const [loadingMembers, setLoadingMembers] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const { isAdmin } = useAuth();

  useEffect(() => { loadDepartments(); }, []);

  const loadDepartments = () => {
    setLoading(true);
    API.get('/departments').then(res => setDepartments(res.data)).catch(console.error).finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await API.put(`/departments/${editing}`, form);
    else await API.post('/departments', form);
    setShowForm(false); setEditing(null); setForm({ name: '', description: '' });
    loadDepartments();
  };

  const handleEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description || '' });
    setEditing(dept.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this department?')) { await API.delete(`/departments/${id}`); loadDepartments(); }
  };

  const toggleMembers = async (deptId) => {
    if (expandedDept === deptId) {
      setExpandedDept(null);
      return;
    }
    setExpandedDept(deptId);
    if (!deptEmployees[deptId]) {
      setLoadingMembers(deptId);
      try {
        const res = await API.get(`/departments/${deptId}`);
        setDeptEmployees(prev => ({ ...prev, [deptId]: res.data.employees || [] }));
      } catch (err) { console.error(err); }
      setLoadingMembers(null);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle mt-1">{departments.length} departments</p>
        </div>
        {isAdmin() && (
          <button onClick={() => { setShowForm(!showForm); setEditing(null); }} className="btn-primary">
            <Plus size={18} /> Add Department
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="card p-6 mb-6 flex flex-col gap-4 max-w-lg">
            <input placeholder="Department Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" required />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" rows={3} />
            <div className="flex gap-3">
              <button type="submit" className="btn-success">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary">
                <X size={16} /> Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept, i) => (
            <motion.div key={dept.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-hover p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Building2 size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{dept.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{dept.description || 'No description'}</p>
                  <div className="mt-2">
                    <span className="badge-info"><Users size={12} className="mr-1" />{dept.employeeCount ?? 0} Employee{dept.employeeCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button onClick={() => toggleMembers(dept.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors">
                  {expandedDept === dept.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {expandedDept === dept.id ? 'Hide Members' : 'View Members'}
                </button>
                <div className="flex-1" />
                {isAdmin() && (
                  <>
                    <button onClick={() => handleEdit(dept)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(dept.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-500 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                  </>
                )}
              </div>

              {/* Expandable Members List */}
              <AnimatePresence>
                {expandedDept === dept.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden">
                    <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      {loadingMembers === dept.id ? (
                        <div className="flex items-center justify-center py-4"><Loader2 size={18} className="animate-spin text-primary-500" /></div>
                      ) : (deptEmployees[dept.id] && deptEmployees[dept.id].length > 0) ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {deptEmployees[dept.id].map(emp => (
                            <div key={emp.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                {emp.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{emp.name}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1"><Briefcase size={10} />{emp.position}</p>
                              </div>
                              <span className={emp.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}>{emp.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-400 text-center py-3">No employees in this department</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
      {!loading && departments.length === 0 && <p className="text-center py-12 text-zinc-400">No departments yet. Create your first department above.</p>}
    </div>
  );
}

