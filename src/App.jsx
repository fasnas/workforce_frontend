import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import AdminLayout from './components/admin/AdminLayout';
import SupervisorLayout from './components/supervisor/SupervisorLayout';
import UserLayout from './components/user/UserLayout';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAddProject from './pages/admin/AdminAddProject';
import AdminProjects from './pages/admin/AdminProjects';


// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';

// User Pages
import UserDashboard from './pages/user/UserDashboard';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="adduser" element={<AdminAddUser />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="addproject" element={<AdminAddProject />} />
            <Route path="allprojects" element={<AdminProjects />} />
            {/* <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="reports" element={<AdminReports />} /> */}
          </Route>
          
          {/* Supervisor Routes */}
          <Route path="/supervisor" element={
            <ProtectedRoute allowedRoles={['supervisor']}>
              <SupervisorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/supervisor/dashboard" replace />} />
            <Route path="dashboard" element={<SupervisorDashboard />} />
            {/* <Route path="team" element={<SupervisorTeam />} />
            <Route path="products" element={<SupervisorProducts />} />
            <Route path="orders" element={<SupervisorOrders />} /> */}
          </Route>
          
          {/* User Routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            {/* <Route path="orders" element={<UserOrders />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="wishlist" element={<UserWishlist />} /> */}
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;