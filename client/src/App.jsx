import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './modules/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Simple temporary dashboard component
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6 border-t-4 border-green-700">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">BHUMISETU Command Center</h1>
        <p className="mb-4">Welcome, <strong>{user?.name}</strong>!</p>
        <div className="bg-gray-50 p-4 rounded border mb-6 text-sm text-gray-600 font-mono">
          <p>Role: {user?.role}</p>
          <p>State ID: {user?.stateId || 'N/A'}</p>
          <p>District ID: {user?.districtId || 'N/A'}</p>
        </div>
        <button 
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
        >
          Secure Logout
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Future routes like /projects, /parcels will go here */}
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
