import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, AlertTriangle, TrendingDown, Clock, ShieldAlert, Download, Activity, TrendingUp, BarChart2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, LineChart, Line, PieChart, Pie } from 'recharts';
import { generateSyntheticPDF } from '../utils/pdfGenerator';

const Intelligence = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const allProjects = useAppStore(state => state.projects);
  const allTasks = useAppStore(state => state.tasks);
  const allAlerts = useAppStore(state => state.alerts);
  const [budgetIncrease, setBudgetIncrease] = useState('0');
  const [rrFastTrack, setRrFastTrack] = useState('No Change');
  const [simResult, setSimResult] = useState(null);
  const [simRan, setSimRan] = useState(false);

  const runSimulation = () => {
    const budgetPct = parseFloat(budgetIncrease) || 0;
    const rrDays = rrFastTrack === 'Reduce time by 30 days' ? 30 : rrFastTrack === 'Reduce time by 15 days' ? 15 : 0;
    const overdueCount = allTasks.filter(t => t.status !== 'Completed' && new Date(t.dueAt) < new Date()).length;
    const monthsReduced = ((budgetPct / 100) * 3.5 + (rrDays / 30) * 1.2).toFixed(1);
    const tasksImpacted = Math.round(overdueCount * (budgetPct / 100 + rrDays / 90));
    const budgetEffect = budgetPct > 0 ? `Budget increase unlocks ${Math.round(budgetPct * 1.4)} additional parcel acquisitions.` : '';
    const rrEffect = rrDays > 0 ? `R&R fast-tracking clears ${rrDays}-day bottleneck, unblocking ${Math.ceil(rrDays / 5)} pending tasks.` : '';
    setSimResult({ monthsReduced, tasksImpacted, budgetEffect, rrEffect });
    setSimRan(true);
  };
  
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

  const handleExportMIS = () => {
    generateSyntheticPDF('National MIS Intelligence Report', 'Executive Summary', [
      ['Date Generated', new Date().toLocaleDateString(), 'Authority', user.role],
      ['Total Projects', misData.totalProjects, 'Total Disbursed', `₹${misData.totalCompensationDisbursed.toFixed(2)} Cr`],
      ['System Health', systemHealth, 'Active Bottlenecks', Object.keys(bottlenecksByRole).length]
    ]);
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
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button onClick={handleExportMIS} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export MIS Report (PDF)
          </button>
          <button onClick={handleExportMIS} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Export Raw Data (CSV)
          </button>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in-up">
        {/* Executive Overview (MIS) */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">MIS Overview (National)</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <dt className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Managed Projects</dt>
              <div className="mt-2 flex items-baseline">
                <dd className="text-3xl font-extrabold text-gray-900">{misData.totalProjects}</dd>
                <span className="text-sm font-medium text-emerald-600 ml-2">▲ 3 this month</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <dt className="text-xs uppercase tracking-wider font-semibold text-gray-500">Required Area (Hectares)</dt>
              <div className="mt-2 flex items-baseline">
                <dd className="text-3xl font-extrabold text-gray-900">{misData.totalAreaRequired.toLocaleString()}</dd>
                <span className="text-sm font-medium text-emerald-600 ml-2">▲ Verified</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <dt className="text-xs uppercase tracking-wider font-semibold text-gray-500">Funds Disbursed (Cr)</dt>
              <div className="mt-2 flex items-baseline">
                <dd className="text-3xl font-extrabold text-gray-900">₹{misData.totalCompensationDisbursed.toFixed(2)}</dd>
                <span className="text-sm font-medium text-emerald-600 ml-2">▲ Within Budget</span>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Executive Analytics (Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Acquisition Velocity (MoM)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Apr', velocity: 12 }, { month: 'May', velocity: 19 },
                  { month: 'Jun', velocity: 15 }, { month: 'Jul', velocity: 22 },
                  { month: 'Aug', velocity: 28 }, { month: 'Sep', velocity: 35 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Line type="monotone" dataKey="velocity" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} name="Parcels Cleared" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-rose-600" />
              Litigation Index (By State)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { state: 'MH', index: 85, settled: 40 }, { state: 'UP', index: 65, settled: 55 },
                  { state: 'MP', index: 45, settled: 60 }, { state: 'GJ', index: 30, settled: 70 },
                  { state: 'RJ', index: 55, settled: 45 }
                ]} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis type="category" dataKey="state" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="index" stackId="a" fill="#f43f5e" name="Active Disputes" radius={[0, 0, 0, 0]} barSize={16} />
                  <Bar dataKey="settled" stackId="a" fill="#10b981" name="Settled" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk & Delay Prediction */}
          <section className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center tracking-tight">
              <ShieldAlert className="w-6 h-6 mr-3 text-red-600 bg-red-50 p-1 rounded-lg" />
              Risk & Delay Prediction
            </h2>
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl mb-6 border border-gray-100">
                <span className="text-sm font-bold text-gray-700">System Health</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${systemHealth === 'Critical' ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' : systemHealth === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm' : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'}`}>
                  {systemHealth}
                </span>
              </div>
              
              <div className="h-48 relative mb-6">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-gray-900 tracking-tighter">{highRiskSLA + mediumRiskSLA + 342}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Tasks</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'High Risk', value: highRiskSLA, fill: '#ef4444' },
                        { name: 'Medium Risk', value: mediumRiskSLA, fill: '#f59e0b' },
                        { name: 'On Track', value: 342, fill: '#10b981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <ul className="space-y-3 mt-auto">
                <li className="flex justify-between items-center p-3 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                  <div className="flex items-center text-sm text-red-800 font-bold">
                    <AlertTriangle className="w-4 h-4 mr-2" /> High Risk (Overdue)
                  </div>
                  <span className="font-black text-red-600">{highRiskSLA} tasks</span>
                </li>
                <li className="flex justify-between items-center p-3 border border-amber-100 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                  <div className="flex items-center text-sm text-amber-800 font-bold">
                    <Clock className="w-4 h-4 mr-2" /> Medium Risk (&lt; 3 days)
                  </div>
                  <span className="font-black text-amber-600">{mediumRiskSLA} tasks</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Bottlenecks & Recommendations */}
          <section className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center tracking-tight">
              <TrendingDown className="w-6 h-6 mr-3 text-purple-600 bg-purple-50 p-1 rounded-lg" />
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

        {/* What-If Scenario Simulator */}
        <section className="glass-panel rounded-xl p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            What-If Scenario Simulator
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Adjust variables to simulate the impact on overall project timelines and budget.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Increase Land Acquisition Budget by</label>
                <select
                  value={budgetIncrease}
                  onChange={(e) => { setBudgetIncrease(e.target.value.replace('+','').replace('%','')); setSimRan(false); }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="0">0%</option>
                  <option value="10">+10%</option>
                  <option value="25">+25%</option>
                  <option value="50">+50%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fast-track R&R Approvals</label>
                <select
                  value={rrFastTrack}
                  onChange={(e) => { setRrFastTrack(e.target.value); setSimRan(false); }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>No Change</option>
                  <option>Reduce time by 15 days</option>
                  <option>Reduce time by 30 days</option>
                </select>
              </div>
              <button
                onClick={runSimulation}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
              >
                <Activity className="w-4 h-4 mr-2" />
                Run Simulation
              </button>
            </div>

            <div className="md:col-span-2 bg-blue-50 rounded-lg p-5 border border-blue-100 flex flex-col justify-center items-center text-center min-h-[160px]">
              {!simRan ? (
                <>
                  <Activity className="w-10 h-10 text-blue-200 mb-3" />
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Awaiting Simulation</h3>
                  <p className="text-sm text-blue-400 mt-2">Adjust variables and click "Run Simulation" to see projected outcomes.</p>
                </>
              ) : (
                <>
                  <Activity className="w-10 h-10 text-blue-500 mb-3" />
                  <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3">Simulation Results</h3>
                  <div className="grid grid-cols-2 gap-4 w-full mb-3">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-blue-500 font-medium">Delivery Time Reduced</p>
                      <p className="text-2xl font-extrabold text-blue-700">{simResult.monthsReduced} <span className="text-sm font-normal">months</span></p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-blue-500 font-medium">Tasks Unblocked</p>
                      <p className="text-2xl font-extrabold text-blue-700">{simResult.tasksImpacted}</p>
                    </div>
                  </div>
                  {simResult.budgetEffect && <p className="text-xs text-blue-600 mt-1">• {simResult.budgetEffect}</p>}
                  {simResult.rrEffect && <p className="text-xs text-blue-600 mt-1">• {simResult.rrEffect}</p>}
                  {!simResult.budgetEffect && !simResult.rrEffect && <p className="text-xs text-blue-400 mt-1">No changes selected — current state is baseline.</p>}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Intelligence;
