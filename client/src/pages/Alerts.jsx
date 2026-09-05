import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

const Alerts = () => {
  const { user } = useAuth();
  const allAlerts = useAppStore(state => state.alerts);
  const resolveAlert = useAppStore(state => state.resolveAlert);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Unresolved');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view alerts.</div>;
  }

  // Simplified: Show all alerts. In a real system, alerts would be bound to user jurisdictions.
  const filteredAlerts = allAlerts.filter(a => {
    const matchesSearch = a.trigger.toLowerCase().includes(searchTerm.toLowerCase()) || a.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 border-red-200';
      case 'Warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-red-600" />
            System Alerts & Anomalies
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time notifications for delays, risks, and compliance breaches.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 shadow rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Alerts</option>
            <option value="Unresolved">Unresolved</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 text-center shadow rounded-lg border border-gray-200 text-gray-500">
            No alerts found matching your criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div key={alert.id} className={`p-4 rounded-lg shadow-sm border ${getSeverityStyle(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {alert.severity} Alert for {alert.entityId}
                    </h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>{alert.trigger}</p>
                    </div>
                    {alert.recommendedAction && (
                      <div className="mt-2 text-sm text-gray-700 bg-white bg-opacity-50 p-2 rounded inline-block">
                        <strong>Action Recommended:</strong> {alert.recommendedAction}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Generated: {new Date(alert.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div>
                  {alert.status === 'Unresolved' ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve Alert
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
