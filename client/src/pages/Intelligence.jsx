import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, AlertTriangle, TrendingDown, Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

const Intelligence = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const allProjects = useAppStore(state => state.projects);
  const allTasks = useAppStore(state => state.tasks);
  const allAlerts = useAppStore(state => state.alerts);
  
  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view intelligence data.</div>;
  }

  // Calculate MIS Data
  const misData = {
    totalProjects: allProjects.length,
    totalAreaRequired: allProjects.reduce((acc, p) => acc + (p.requiredLandArea || 0), 0),
    totalCompensationDisbursed: allProjects.reduce((acc, p) => acc + (p.estimatedCompensation || 0), 0) / 10000000 // In Crores
  };

  // Calculate Risk Data
  const highRiskSLA = allTasks.filter(t => t.status !== 'Completed' && new Date(t.dueAt) < new Date()).length;
  const mediumRiskSLA = allTasks.filter(t => {
    if (t.status === 'Completed') return false;
    const due = new Date(t.dueAt);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }).length;
  const systemHealth = highRiskSLA > 5 ? 'Critical' : highRiskSLA > 0 ? 'Warning' : 'Stable';

  // Calculate Bottlenecks
  const bottlenecksByRole = {};
  allTasks.filter(t => t.status !== 'Completed' && new Date(t.dueAt) < new Date()).forEach(t => {
    bottlenecksByRole[t.assignedRole] = (bottlenecksByRole[t.assignedRole] || 0) + 1;
  });

  const automatedRecommendations = Object.entries(bottlenecksByRole).map(([role, count]) => 
    `Reallocate resources or escalate tasks assigned to: ${role} (Backlog: ${count})`
  );
  if (automatedRecommendations.length === 0) {
    automatedRecommendations.push("System workflow is currently optimal. No immediate reallocations required.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            Decision Intelligence Engine
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time analytics, delay prediction, and automated recommendations.
          </p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in-up">
        {/* Executive Overview (MIS) */}
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">MIS Overview (National)</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="glass-panel overflow-hidden rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <dt className="text-sm font-semibold text-gray-500 truncate">Total Managed Projects</dt>
              <dd className="mt-2 text-3xl font-extrabold text-gray-900">{misData.totalProjects}</dd>
            </div>
            <div className="glass-panel overflow-hidden rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <dt className="text-sm font-semibold text-gray-500 truncate">Required Area (Hectares)</dt>
              <dd className="mt-2 text-3xl font-extrabold text-gray-900">{misData.totalAreaRequired.toLocaleString()}</dd>
            </div>
            <div className="glass-panel overflow-hidden rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <dt className="text-sm font-semibold text-gray-500 truncate">Funds Disbursed (Cr)</dt>
              <dd className="mt-2 text-3xl font-extrabold text-gray-900">₹{misData.totalCompensationDisbursed.toFixed(2)}</dd>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk & Delay Prediction */}
          <section className="glass-panel rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-red-500" />
              Risk & Delay Prediction
            </h2>
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg mb-4 border border-gray-100">
              <span className="text-sm font-medium text-gray-700">System Health</span>
              <span className={`px-2 py-1 text-xs font-bold rounded ${systemHealth === 'Critical' ? 'bg-red-100 text-red-800' : systemHealth === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {systemHealth}
              </span>
            </div>
            
            <ul className="space-y-3">
              <li className="flex justify-between items-center p-3 border border-red-100 bg-red-50 rounded-md">
                <div className="flex items-center text-sm text-red-800 font-medium">
                  <AlertTriangle className="w-4 h-4 mr-2" /> High Risk (Overdue SLA)
                </div>
                <span className="font-bold text-red-600">{highRiskSLA} tasks</span>
              </li>
              <li className="flex justify-between items-center p-3 border border-yellow-100 bg-yellow-50 rounded-md">
                <div className="flex items-center text-sm text-yellow-800 font-medium">
                  <Clock className="w-4 h-4 mr-2" /> Medium Risk (Due &lt; 3 days)
                </div>
                <span className="font-bold text-yellow-600">{mediumRiskSLA} tasks</span>
              </li>
            </ul>
          </section>

          {/* Bottlenecks & Recommendations */}
          <section className="glass-panel rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-purple-600" />
              Bottleneck AI & Recommendations
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Identified Backlogs</h3>
                {Object.keys(bottlenecksByRole).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(bottlenecksByRole).map(([role, count]) => (
                      <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {role}: {count} delayed tasks
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No major backlogs detected.</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">AI Recommendations</h3>
                <ul className="space-y-3">
                  {automatedRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start bg-gray-50 p-3 rounded border border-gray-200">
                      <Brain className="w-4 h-4 text-purple-500 mr-2 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
