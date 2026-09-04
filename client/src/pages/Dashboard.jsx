import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, Map, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProposals: 0,
    parcelsIdentified: 0,
    disbursedCrores: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would be an API call to a stats endpoint.
    // We will simulate fetching stats from our backend for the prototype.
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Parallel requests to our API endpoints
        const [projectsRes, proposalsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', config),
          axios.get('http://localhost:5000/api/proposals', config)
        ]);

        setStats({
          totalProjects: projectsRes.data.count || 0,
          activeProposals: proposalsRes.data.count || 0,
          parcelsIdentified: 1420, // Mocked for now
          disbursedCrores: 450.5 // Mocked for now
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: Activity, color: 'bg-blue-500' },
    { title: 'Active Proposals', value: stats.activeProposals, icon: ShieldCheck, color: 'bg-yellow-500' },
    { title: 'Parcels Identified', value: stats.parcelsIdentified, icon: Map, color: 'bg-purple-500' },
    { title: 'Compensation (Cr)', value: `₹${stats.disbursedCrores}`, icon: TrendingUp, color: 'bg-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">National Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of land acquisition activities and milestones.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none">
            Generate Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {[1,2,3,4].map(i => (
             <div key={i} className="bg-white overflow-hidden shadow rounded-lg h-24"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <div key={item.title} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${item.color} text-white`}>
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.title}</dt>
                      <dd className="text-2xl font-bold text-gray-900">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Mock */}
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Recent Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Section 11 Preliminary Notification</p>
                <p className="text-sm text-gray-500">Project: Pune Ring Road • Issued by District Officer</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <ShieldCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Compensation Award Declared</p>
                <p className="text-sm text-gray-500">Project: Mumbai-Ahmedabad HSR • Parcel ID: P-4022</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* SLA / Workflow Mock */}
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">My Pending Actions</h2>
          <div className="flex flex-col justify-center items-center h-40 bg-gray-50 rounded border border-dashed border-gray-300">
            <Users className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center px-4">
              You currently have 0 tasks in your inbox.<br/>
              Check the workflow tab for assignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
