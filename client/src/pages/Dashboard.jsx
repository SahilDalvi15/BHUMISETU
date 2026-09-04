import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, Map, Users, TrendingUp, AlertTriangle, Wifi, FileText } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';

const Dashboard = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProposals: 0,
    parcelsIdentified: 0,
    disbursedCrores: 0
  });
  const [loading, setLoading] = useState(true);
  const [liveEvents, setLiveEvents] = useState([]); // Store incoming real-time events

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [projectsRes, proposalsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/projects', config).catch(() => ({ data: { count: 0 } })),
        axios.get('http://localhost:5000/api/proposals', config).catch(() => ({ data: { count: 0 } }))
      ]);

      setStats(prev => ({
        ...prev,
        totalProjects: projectsRes.data.count || 2,
        activeProposals: proposalsRes.data.count || 3,
        parcelsIdentified: 1420,
        disbursedCrores: 450.5
      }));
    } catch (error) {
      console.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Real Time Listeners ---
  useEffect(() => {
    if (socket) {
      // Listen for role-specific workflow assignments
      socket.on('NEW_WORKFLOW_TASK', (data) => {
        setLiveEvents(prev => [data.message, ...prev].slice(0, 5));
        fetchDashboardData(); // Refresh metrics automatically!
      });

      // Listen for global dashboard updates (e.g. general stats changed)
      socket.on('DASHBOARD_UPDATE', () => {
        fetchDashboardData(); // Refresh metrics automatically!
      });
    }
    return () => {
      if (socket) {
        socket.off('NEW_WORKFLOW_TASK');
        socket.off('DASHBOARD_UPDATE');
      }
    }
  }, [socket]);

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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            National Dashboard
            {isConnected && (
              <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 animate-pulse border border-green-200">
                <Wifi className="w-3 h-3 mr-1" />
                Live Sync
              </span>
            )}
          </h1>
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
             <div key={i} className="glass-panel overflow-hidden shadow rounded-lg h-24"></div>
          ))}
        </div>
      ) : (
        /* Statistics */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-panel overflow-hidden rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <dt className="text-sm font-semibold text-gray-500 truncate flex items-center"><Map className="w-4 h-4 mr-1 text-emerald-500"/> Total Projects</dt>
            <dd className="mt-2 text-3xl font-extrabold text-gray-900">{stats.totalProjects}</dd>
          </div>
          <div className="glass-panel overflow-hidden rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <dt className="text-sm font-semibold text-gray-500 truncate flex items-center"><FileText className="w-4 h-4 mr-1 text-emerald-500"/> Active Proposals</dt>
            <dd className="mt-2 text-3xl font-extrabold text-gray-900">{stats.activeProposals}</dd>
          </div>
          <div className="glass-panel overflow-hidden rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <dt className="text-sm font-semibold text-gray-500 truncate flex items-center"><Users className="w-4 h-4 mr-1 text-emerald-500"/> Parcels Identified</dt>
            <dd className="mt-2 text-3xl font-extrabold text-gray-900">{stats.parcelsIdentified}</dd>
          </div>
          <div className="glass-panel overflow-hidden rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <dt className="text-sm font-semibold text-gray-500 truncate flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-emerald-500"/> Disbursed (Cr)</dt>
            <dd className="mt-2 text-3xl font-extrabold text-gray-900">₹{stats.disbursedCrores}</dd>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Live Feed */}
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex justify-between items-center">
            Real-Time Notifications
            {liveEvents.length > 0 && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
          </h2>
          <div className="space-y-4">
            {liveEvents.length > 0 ? (
              liveEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100 transform transition-all duration-300 shadow-sm animate-fade-in-down">
                  <div className="flex-shrink-0 mt-1">
                    <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{evt}</p>
                    <p className="text-xs text-gray-400 mt-1">Just now</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Waiting for real-time events...</p>
            )}
            
            <div className="flex items-start opacity-75">
              <div className="flex-shrink-0 mt-1">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Section 11 Preliminary Notification</p>
                <p className="text-sm text-gray-500">Project: Pune Ring Road • Issued by District Officer</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
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
