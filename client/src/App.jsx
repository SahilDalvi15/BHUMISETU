import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './modules/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Proposals from './pages/Proposals';
import Inbox from './pages/Inbox';

// Placeholder components for routing
const GIS = () => <div className="p-6 bg-white rounded shadow text-center border-t-4 border-gov-green">GIS & Parcels Module Coming Soon</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/create" element={<CreateProject />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/gis" element={<GIS />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
