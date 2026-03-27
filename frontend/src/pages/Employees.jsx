import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, DollarSign, X, Loader2, Search, Filter, XCircle } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '', joiningDate: '',
    basicSalary: '', status: 'ACTIVE', department: { id: '' }
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [empRes, deptRes] = await Promise.all([API.get('/employees'), API.get('/departments')]);
    setEmployees(empRes.data); setDepartments(deptRes.data);
    setLoading(false);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = !searchQuery ||
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = !filterDept || String(emp.department?.id) === filterDept;
      const matchesStatus = !filterStatus || emp.status === filterStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, filterDept, filterStatus]);

  const hasActiveFilters = searchQuery || filterDept || filterStatus;

  const clearFilters = () => { setSearchQuery(''); setFilterDept(''); setFilterStatus(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, basicSalary: parseFloat(form.basicSalary), department: { id: parseInt(form.department.id) } };
    if (editing) await API.put(`/employees/${editing}`, payload);
    else await API.post('/employees', payload);
    setShowForm(false); setEditing(null);
    setForm({ name: '', email: '', phone: '', position: '', joiningDate: '', basicSalary: '', status: 'ACTIVE', department: { id: '' } });
    loadData();
  };

  const handleEdit = (emp) => {
    setForm({ ...emp, department: { id: emp.department?.id || '' } });
    setEditing(emp.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this employee?')) { await API.delete(`/employees/${id}`); loadData(); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle mt-1">{filteredEmployees.length} of {employees.length} employees</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); }} className="btn-primary">
          <Plus size={18} /> Add Employee
        </button>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input type="text" placeholder="Search by name, email, or position..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="input pl-10 w-full" />
          </div>
          {/* Department Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
              className="input pl-9 pr-8 min-w-[180px] appearance-none">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          {/* Status Filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="input min-w-[140px]">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          {/* Clear Filters */}
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors whitespace-nowrap">
              <XCircle size={15} /> Clear
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="card p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" required />
            <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" required />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" />
            <input placeholder="Position" value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="input" required />
            <input type="date" value={form.joiningDate} onChange={e => setForm({...form, joiningDate: e.target.value})} className="input" />
            <input placeholder="Basic Salary" type="number" value={form.basicSalary} onChange={e => setForm({...form, basicSalary: e.target.value})} className="input" required />
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input">
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
            </select>
            <select value={form.department.id} onChange={e => setForm({...form, department: {id: e.target.value}})} className="input" required>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-success">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary">
                <X size={16} /> Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="table-container">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-primary-500" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="table-header"><tr>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Name</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Position</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Department</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Salary</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody>{filteredEmployees.map(emp => (
              <tr key={emp.id} className="table-row">
                <td className="px-5 py-4"><Link to={`/employees/${emp.id}`} className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">{emp.name}</Link></td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{emp.email}</td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{emp.position}</td>
                <td className="px-5 py-4"><span className="badge-info">{emp.department?.name}</span></td>
                <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">₹{emp.basicSalary?.toLocaleString()}</td>
                <td className="px-5 py-4"><span className={emp.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}>{emp.status}</span></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(emp)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(emp.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-500 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                    <Link to={`/salaries/${emp.id}`} className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-600 transition-colors"><DollarSign size={15} /></Link>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {!loading && filteredEmployees.length === 0 && employees.length > 0 && (
          <div className="text-center py-12">
            <Search size={32} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
            <p className="text-zinc-400">No employees match your filters</p>
            <button onClick={clearFilters} className="mt-2 text-sm text-primary-500 hover:text-primary-400 font-medium">Clear all filters</button>
          </div>
        )}
        {!loading && employees.length === 0 && <p className="text-center py-12 text-zinc-400">No employees yet. Add your first employee above.</p>}
      </motion.div>
    </div>
  );
}

