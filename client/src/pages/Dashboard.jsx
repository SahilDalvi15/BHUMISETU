import React, { useEffect, useState } from 'react';
import { Map, Users, TrendingUp, AlertTriangle, Wifi, FileText, CheckCircle, FilePlus, ArrowRight, Activity, DollarSign, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const projects = useAppStore(state => state.projects);
  const proposals = useAppStore(state => state.proposals);
  const alerts = useAppStore(state => state.alerts);
  const tasks = useAppStore(state => state.tasks);

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view the dashboard.</div>;
  }

  // Robust filtering based on jurisdiction
  const filterByJurisdiction = (items) => {
    if (user.role === 'National Admin' || user.role === 'Land Requiring Body') return items;
    if (user.districtId) return items.filter(item => item.districtId === user.districtId);
    if (user.stateId) return items.filter(item => item.stateId === user.stateId);
    return items;
  };

  const myProjects = filterByJurisdiction(projects);
  const myProposals = filterByJurisdiction(proposals);
  
  // Filter alerts by jurisdiction as well
  const myAlerts = filterByJurisdiction(alerts).filter(a => a.status === 'Unresolved');
  
  // Pending tasks assigned to current role
  const myTasks = tasks.filter(t => t.assignedRole === user.role && t.status !== 'Completed');

  const stats = {
    totalProjects: myProjects.length,
    activeProposals: myProposals.length,
    parcelsIdentified: myProjects.length * 450, // mock derived data
    disbursedCrores: myProjects.reduce((acc, p) => acc + (p.estimatedCompensation / 10000000), 0).toFixed(2),
    avgProgress: myProjects.length > 0 ? Math.round(myProjects.reduce((acc, p) => acc + p.progressPercentage, 0) / myProjects.length) : 0
  };

  // Mock data for charts
  const progressData = [
    { name: 'Jan', acquired: 120, target: 150 },
    { name: 'Feb', acquired: 250, target: 300 },
    { name: 'Mar', acquired: 400, target: 450 },
    { name: 'Apr', acquired: 600, target: 650 },
    { name: 'May', acquired: 850, target: 800 },
    { name: 'Jun', acquired: 1100, target: 1000 },
  ];

  const stageData = [
    { name: 'Proposed', value: myProjects.filter(p => p.stage === 'Proposed').length, color: '#94a3b8' },
    { name: 'Survey', value: myProjects.filter(p => p.stage === 'Survey').length, color: '#f59e0b' },
    { name: 'Assessment', value: myProjects.filter(p => p.stage === 'Compensation Assessment').length, color: '#3b82f6' },
    { name: 'Acquisition', value: myProjects.filter(p => p.stage === 'Acquisition').length, color: '#8b5cf6' },
    { name: 'Handover', value: myProjects.filter(p => p.stage === 'Handover').length, color: '#10b981' },
  ];

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-2 min-w-[150px]">
          {label && <p className="font-extrabold text-gray-900 border-b border-gray-100 pb-2 mb-1">{label}</p>}
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.fill || entry.payload?.fill }}></span>
                <span className="text-gray-500 capitalize">{entry.name}:</span>
              </div>
              <span className="text-gray-900 font-bold">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            {user.role === 'National Admin' ? t('dashboard.nationalCommandCenter') : 
             user.role === 'State Officer' ? t('dashboard.stateDashboard', { state: user.stateId }) :
             user.role === 'District Officer' ? t('dashboard.districtDashboard', { district: user.districtId }) : 
             user.role === 'Land Requiring Body' ? t('dashboard.requiringBodyPortal') :
             t('dashboard.defaultDashboard', { role: user.role })}
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            {user.role === 'National Admin' ? t('dashboard.nationalDesc') :
             user.role === 'Land Requiring Body' ? t('dashboard.requiringBodyDesc') :
             t('dashboard.defaultDesc')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col items-end space-y-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 shadow-inner">
            <Wifi className="w-3 h-3 mr-1 animate-pulse" />
            {t('dashboard.liveSyncActive')}
          </span>
          
          <div className="flex space-x-2">
            {user.role === 'National Admin' && (
              <button className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all">
                <FileText className="w-4 h-4 mr-2" />
                {t('dashboard.executiveReport')}
              </button>
            )}
            {user.role === 'Land Requiring Body' && (
              <Link to="/proposals" className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
                <FilePlus className="w-4 h-4 mr-2" />
                {t('dashboard.newProposal')}
              </Link>
            )}
            {['District Officer', 'State Officer'].includes(user.role) && (
              <button className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('dashboard.approveActions')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Statistics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-emerald-50 rounded-full w-24 h-24 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
          <dt className="text-sm font-bold text-gray-500 tracking-wide flex items-center mb-4"><Map className="w-5 h-5 mr-2 text-emerald-600"/> {user.role === 'Land Requiring Body' ? t('dashboard.myProjects') : t('dashboard.activeProjects')}</dt>
          <dd className="text-4xl font-extrabold text-gray-900">{stats.totalProjects}</dd>
          <p className="text-xs font-semibold text-emerald-600 mt-2">↑ 12% from last quarter</p>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-blue-50 rounded-full w-24 h-24 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
          <dt className="text-sm font-bold text-gray-500 tracking-wide flex items-center mb-4"><Target className="w-5 h-5 mr-2 text-blue-600"/> {t('dashboard.avgProgress')}</dt>
          <dd className="text-4xl font-extrabold text-gray-900">{stats.avgProgress}%</dd>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${stats.avgProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-purple-50 rounded-full w-24 h-24 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
          <dt className="text-sm font-bold text-gray-500 tracking-wide flex items-center mb-4"><Users className="w-5 h-5 mr-2 text-purple-600"/> {t('dashboard.affectedParcels')}</dt>
          <dd className="text-4xl font-extrabold text-gray-900">{stats.parcelsIdentified.toLocaleString()}</dd>
          <p className="text-xs font-semibold text-purple-600 mt-2">{t('dashboard.acrossCorridors', { count: myProjects.length })}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-amber-50 rounded-full w-24 h-24 group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
          <dt className="text-sm font-bold text-gray-500 tracking-wide flex items-center mb-4"><DollarSign className="w-5 h-5 mr-2 text-amber-500"/> {user.role === 'Land Requiring Body' ? t('dashboard.estBudget') : t('dashboard.disbursed')}</dt>
          <dd className="text-4xl font-extrabold text-gray-900">₹{stats.disbursedCrores}</dd>
          <p className="text-xs font-semibold text-amber-600 mt-2">{t('dashboard.dbtTransfers')}</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
            {t('dashboard.acquisitionTrajectory')}
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcquired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <filter id="shadow" height="200%">
                    <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#10b981" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => val === 0 ? '0' : `${val}`} />
                <RechartsTooltip content={<CustomChartTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  fill="none" 
                  strokeDasharray="6 6" 
                  strokeWidth={2} 
                  name="Target Area"
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#94a3b8' }} 
                />
                
                <Area 
                  type="monotone" 
                  dataKey="acquired" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorAcquired)" 
                  strokeWidth={4} 
                  name="Acquired Area" 
                  filter="url(#shadow)"
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3, fill: '#10b981', style: {filter: 'drop-shadow(0px 4px 6px rgba(16, 185, 129, 0.5))'} }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            {t('dashboard.projectsByStage')}
          </h2>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={3}
                  cornerRadius={8}
                >
                  {stageData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      style={{ filter: `drop-shadow(0px 4px 6px ${entry.color}40)` }}
                      className="hover:opacity-80 transition-opacity duration-300 outline-none"
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {stageData.map((stage) => (
              <div key={stage.name} className="flex items-center p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="w-3 h-3 rounded-full mr-3 shadow-sm" style={{ backgroundColor: stage.color }}></span>
                <span className="text-gray-700 font-semibold flex-1">{stage.name}</span>
                <span className="text-gray-900 font-bold bg-white px-2 py-0.5 rounded shadow-sm text-xs">{stage.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              {t('dashboard.riskIntelligence')}
              <span className="ml-3 bg-red-100 text-red-700 text-xs font-extrabold px-2 py-0.5 rounded-full">{myAlerts.length}</span>
            </h2>
            <Link to="/alerts" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center group">
              {t('dashboard.viewAuditLog')} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-96">
            {myAlerts.length > 0 ? (
              myAlerts.slice(0, 4).map((evt, idx) => (
                <div key={idx} className="group relative bg-white p-4 rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all">
                  <div className="flex">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${evt.severity === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="ml-4 w-full">
                      <div className="flex justify-between items-center">
                        <p className={`text-sm font-bold ${evt.severity === 'Critical' ? 'text-red-700' : 'text-amber-700'}`}>{evt.severity} Alert</p>
                        <span className="text-xs font-semibold text-gray-400">{new Date(evt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                      </div>
                      <p className="text-sm text-gray-800 mt-1 font-medium">{evt.trigger}</p>
                      <div className="mt-3 flex justify-between items-center border-t border-gray-50 pt-2">
                        <span className="text-xs font-bold text-gray-500">Ref: {evt.entityId}</span>
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800">Resolve</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-gray-900 font-bold">{t('dashboard.allClear')}</p>
                <p className="text-sm text-gray-500 text-center mt-1">{t('dashboard.noActiveRisks')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Workflow Inbox */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              {t('dashboard.myActionItems')}
              <span className="ml-3 bg-blue-100 text-blue-700 text-xs font-extrabold px-2 py-0.5 rounded-full">{myTasks.length}</span>
            </h2>
            <Link to="/workflow/tasks" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center group">
              {t('dashboard.openInbox')} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          
          <div className="p-6 space-y-3 flex-1 overflow-y-auto max-h-96">
            {myTasks.length > 0 ? (
              myTasks.slice(0, 5).map(task => (
                <div key={task.id} className="group flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-4 ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-400'}`}></div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{task.title}</h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Due: {new Date(task.dueAt).toLocaleDateString()} • {task.entityId}</p>
                    </div>
                  </div>
                  <Link to="/workflow/tasks" className="opacity-0 group-hover:opacity-100 text-xs font-bold bg-white shadow-sm border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-700 transition-all">
                    Action
                  </Link>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center py-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-900 font-bold">{t('dashboard.inboxZero')}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('dashboard.noPendingApprovals')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
