import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Briefcase, Building2, Calendar, DollarSign, Loader2 } from 'lucide-react';

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    API.get(`/employees/${id}`).then(res => setEmployee(res.data)).catch(console.error);
  }, [id]);

  if (!employee) return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-primary-500" /></div>;

  const details = [
    { icon: Mail, label: 'Email', value: employee.email },
    { icon: Phone, label: 'Phone', value: employee.phone },
    { icon: Briefcase, label: 'Position', value: employee.position },
    { icon: Building2, label: 'Department', value: employee.department?.name },
    { icon: Calendar, label: 'Joining Date', value: employee.joiningDate },
    { icon: DollarSign, label: 'Basic Salary', value: `₹${employee.basicSalary?.toLocaleString()}` },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/employees" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 mb-6">
          <ArrowLeft size={16} /> Back to Employees
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/20">
            {employee.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{employee.name}</h1>
            <span className={employee.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}>{employee.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <Icon size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <Link to={`/salaries/${employee.id}`} className="btn-primary inline-flex">
            <DollarSign size={18} /> View Salary History
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

