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
import SupervisorPotentialProjectAdd from './pages/supervisor/SupervisorAddProject';
import SupervisorPotentialProject from './pages/supervisor/SupervisorPotentialProject';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import SingleProjects from './pages/admin/SingleProjects';
import UserProjects from './pages/user/UserProjects';
import UserSingleProject from './pages/user/UserSingleProject';
import SupervisorOngoigProject from './pages/supervisor/SupervisorOngoigProject';
import SupervisorSingleProject from './pages/supervisor/SupervisorSingleOngoingProject';
import SupervisorSinglePotentialProject from './pages/supervisor/SupervisorSinglePotentialProject';
import SupervisorSingleOngoingProject from './pages/supervisor/SupervisorSingleOngoingProject';


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
            <Route path="allprojects/:id" element={<SingleProjects />} />

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
            <Route path="addproject" element={<SupervisorPotentialProjectAdd />} />
            <Route path="potentialproject" element={<SupervisorPotentialProject />} />
            <Route path="potentialproject/:id" element={<SupervisorSinglePotentialProject />} />
            <Route path="ongoingprojects" element={<SupervisorOngoigProject />} />
            <Route path="ongoingprojects/:id" element={<SupervisorSingleOngoingProject />} />
           
          </Route>
          
          {/* User Routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['labour']}>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="projects" element={<UserProjects />} />
            <Route path="projects/:id" element={<UserSingleProject />} />
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