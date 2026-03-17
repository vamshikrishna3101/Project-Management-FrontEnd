import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SelectRole from './pages/SelectRole';

import Login          from './pages/Login';
import Register       from './pages/Register';
import OAuth2Callback from './pages/OAuth2Callback';  // ✅ new
import Dashboard      from './pages/Dashboard';
import Projects       from './pages/Projects';
import CreateProject  from './pages/CreateProject';
import ProjectDetail  from './pages/ProjectDetail';
import Tasks          from './pages/Tasks';
import CreateTask     from './pages/CreateTask';
import Users          from './pages/Users';
import AuditLogs      from './pages/AuditLogs';

import './assets/styles/main.css';
import './App.css';

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      {children}
      <Footer />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} /> {/* ✅ new */}

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>
          } />
          <Route path="/projects/create" element={
            <ProtectedRoute><AppLayout><CreateProject /></AppLayout></ProtectedRoute>
          } />
          <Route path="/projects/:id" element={
            <ProtectedRoute><AppLayout><ProjectDetail /></AppLayout></ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute><AppLayout><Tasks /></AppLayout></ProtectedRoute>
          } />
          <Route path="/tasks/create" element={
            <ProtectedRoute><AppLayout><CreateTask /></AppLayout></ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute><AppLayout><Users /></AppLayout></ProtectedRoute>
          } />
          <Route path="/audit" element={
            <ProtectedRoute><AppLayout><AuditLogs /></AppLayout></ProtectedRoute>
          } />

          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/dashboard" replace />} />
          <Route path="/select-role" element={<SelectRole />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;