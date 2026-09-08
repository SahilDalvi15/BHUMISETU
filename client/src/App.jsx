import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Login from './modules/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Proposals from './pages/Proposals';
import Inbox from './pages/Inbox';
import GIS from './pages/GIS';
import Intelligence from './pages/Intelligence';
import Compensation from './pages/Compensation';
import RR from './pages/RR';
import Possession from './pages/Possession';
import Tasks from './pages/Tasks';
import Alerts from './pages/Alerts';
import Documents from './pages/Documents';
import AuditLog from './pages/AuditLog';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/create" element={<CreateProject />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/compensation" element={<Compensation />} />
              <Route path="/rr" element={<RR />} />
              <Route path="/possession" element={<Possession />} />
              <Route path="/workflow/tasks" element={<Tasks />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/gis" element={<GIS />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/intelligence" element={<Intelligence />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/audit" element={<AuditLog />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
