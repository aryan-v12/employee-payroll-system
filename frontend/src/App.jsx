import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Departments from './pages/Departments';
import SalaryHistory from './pages/SalaryHistory';
import Leaves from './pages/Leaves';
import MyLeaves from './pages/MyLeaves';
import MySalary from './pages/MySalary';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute adminOnly><Layout><Employees /></Layout></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute adminOnly><Layout><EmployeeDetail /></Layout></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute><Layout><Departments /></Layout></ProtectedRoute>} />
          <Route path="/salaries/:employeeId" element={<ProtectedRoute><Layout><SalaryHistory /></Layout></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute adminOnly><Layout><Leaves /></Layout></ProtectedRoute>} />
          <Route path="/my-leaves" element={<ProtectedRoute><Layout><MyLeaves /></Layout></ProtectedRoute>} />
          <Route path="/my-salary" element={<ProtectedRoute><Layout><MySalary /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

