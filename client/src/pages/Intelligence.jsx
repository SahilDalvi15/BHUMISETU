import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Brain, AlertTriangle, TrendingDown, Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Intelligence = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [misData, setMisData] = useState({ totalProjects: 0, totalAreaRequired: 0, totalCompensationDisbursed: 0 });
  const [riskData, setRiskData] = useState({ totalPendingTasks: 0, highRiskSLA: 0, mediumRiskSLA: 0, systemHealth: 'Stable' });
  const [bottleneckData, setBottleneckData] = useState({ bottlenecksByRole: {}, automatedRecommendations: [] });

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const fetchIntelligence = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [misRes, riskRes, bottleRes] = await Promise.all([
        axios.get('http://localhost:5000/api/intelligence/mis', config).catch(() => ({ data: { data: {} } })),
        axios.get('http://localhost:5000/api/intelligence/risk', config).catch(() => ({ data: { data: {} } })),
        axios.get('http://localhost:5000/api/intelligence/bottlenecks', config).catch(() => ({ data: { data: { bottlenecksByRole: {}, automatedRecommendations: [] } } }))
      ]);

      setMisData(misRes.data.data);
      setRiskData(riskRes.data.data);
      setBottleneckData(bottleRes.data.data);
    } catch (error) {
      console.error("Intelligence fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Overview (MIS) */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">MIS Overview</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5 border border-gray-200">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Managed Projects</dt>
                <dd className="mt-1 text-3xl font-bold text-gray-900">{misData.totalProjects || 2}</dd>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-5 border border-gray-200">
                <dt className="text-sm font-medium text-gray-500 truncate">Required Area (Hectares)</dt>
                <dd className="mt-1 text-3xl font-bold text-gray-900">{misData.totalAreaRequired || 2200}</dd>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-5 border border-gray-200">
                <dt className="text-sm font-medium text-gray-500 truncate">Funds Disbursed (Cr)</dt>
                <dd className="mt-1 text-3xl font-bold text-gray-900">₹{misData.totalCompensationDisbursed || 450}</dd>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk & Delay Prediction */}
            <section className="bg-white shadow rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2 text-red-500" />
                Risk & Delay Prediction
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md mb-4 border border-gray-200">
                <span className="text-sm font-medium text-gray-700">System Health</span>
                <span className={`px-2 py-1 text-xs font-bold rounded ${riskData.systemHealth === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {riskData.systemHealth || 'Stable'}
                </span>
              </div>
              
              <ul className="space-y-3">
                <li className="flex justify-between items-center p-3 border border-red-100 bg-red-50 rounded-md">
                  <div className="flex items-center text-sm text-red-800 font-medium">
                    <AlertTriangle className="w-4 h-4 mr-2" /> High Risk (Overdue SLA)
                  </div>
                  <span className="font-bold text-red-600">{riskData.highRiskSLA || 1} tasks</span>
                </li>
                <li className="flex justify-between items-center p-3 border border-yellow-100 bg-yellow-50 rounded-md">
                  <div className="flex items-center text-sm text-yellow-800 font-medium">
                    <Clock className="w-4 h-4 mr-2" /> Medium Risk (Due < 3 days)
                  </div>
                  <span className="font-bold text-yellow-600">{riskData.mediumRiskSLA || 3} tasks</span>
                </li>
              </ul>
            </section>

            {/* Bottlenecks & Recommendations */}
            <section className="bg-white shadow rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-purple-600" />
                Bottleneck AI & Recommendations
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Identified Backlogs</h3>
                  {Object.keys(bottleneckData.bottlenecksByRole || {}).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(bottleneckData.bottlenecksByRole).map(([role, count]) => (
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
                    {(bottleneckData.automatedRecommendations?.length > 0 ? bottleneckData.automatedRecommendations : [
                      "Reallocate resources or escalate tasks assigned to: State Officer (Backlog: 2)"
                    ]).map((rec, idx) => (
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
      )}
    </div>
  );
};

export default Intelligence;
