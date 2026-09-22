import React, { useEffect, useState } from 'react';
import { Map, Users, TrendingUp, AlertTriangle, Wifi, FileText, CheckCircle, FilePlus, ArrowRight, Activity, DollarSign, Target, Shield, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner">
              <Map className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
              ▲ 12%
            </span>
          </div>
          <dt className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-1">{user.role === 'Land Requiring Body' ? t('dashboard.myProjects') : t('dashboard.activeProjects')}</dt>
          <dd className="text-4xl font-black text-gray-900 tracking-tight">{stats.totalProjects}</dd>
          <p className="text-xs font-semibold text-gray-400 mt-3 flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-emerald-500"/> Verified active corridors</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-inner">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 shadow-sm">
              ▲ On Track
            </span>
          </div>
          <dt className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-1">{t('dashboard.avgProgress')}</dt>
          <div className="flex items-baseline space-x-2">
            <dd className="text-4xl font-black text-gray-900 tracking-tight">{stats.avgProgress}%</dd>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full" style={{ width: `${stats.avgProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 shadow-sm">
              Verified
            </span>
          </div>
          <dt className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-1">{t('dashboard.affectedParcels')}</dt>
          <dd className="text-4xl font-black text-gray-900 tracking-tight">{stats.parcelsIdentified.toLocaleString()}</dd>
          <p className="text-xs font-semibold text-gray-400 mt-3 flex items-center"><MapPin className="w-3 h-3 mr-1 text-purple-500"/> {t('dashboard.acrossCorridors', { count: myProjects.length })}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-inner">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm">
              ▲ PFMS Sync
            </span>
          </div>
          <dt className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-1">{user.role === 'Land Requiring Body' ? t('dashboard.estBudget') : t('dashboard.disbursed')}</dt>
          <dd className="text-4xl font-black text-gray-900 tracking-tight">₹{stats.disbursedCrores}</dd>
          <p className="text-xs font-semibold text-gray-400 mt-3 flex items-center"><Shield className="w-3 h-3 mr-1 text-amber-500"/> Direct Benefit Transfers</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
              <TrendingUp className="w-6 h-6 mr-3 text-emerald-600 bg-emerald-50 p-1 rounded-lg" />
              {t('dashboard.acquisitionTrajectory')}
            </h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
              FY 2026-27 YTD
            </span>
          </div>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} tickFormatter={(val) => val === 0 ? '0' : `${val}`} dx={-10} />
                <RechartsTooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} />
                
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

        <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
              <Activity className="w-6 h-6 mr-3 text-blue-600 bg-blue-50 p-1 rounded-lg" />
              {t('dashboard.projectsByStage')}
            </h2>
          </div>
          <div className="h-64 flex justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalProjects}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={12}
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

      {/* Geospatial Tracker & State Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Map className="w-5 h-5 mr-2 text-indigo-600" />
            National Land Acquisition Geospatial Tracker
          </h2>
          <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden relative min-h-[350px] z-0">
            <MapContainer center={[21.0, 78.0]} zoom={4} className="h-full w-full" zoomControl={false}>
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              />
              {[
                { lat: 19.07, lng: 72.87, color: '#10b981', label: 'Mumbai-Ahmedabad HSR' },
                { lat: 28.61, lng: 77.20, color: '#f59e0b', label: 'Delhi-Mumbai Expressway' },
                { lat: 13.08, lng: 80.27, color: '#10b981', label: 'Chennai Metro' },
                { lat: 17.38, lng: 78.48, color: '#ef4444', label: 'Hyderabad Ring Road (Disputed)' },
                { lat: 22.57, lng: 88.36, color: '#f59e0b', label: 'Kolkata Port Expansion' },
                { lat: 26.91, lng: 75.78, color: '#10b981', label: 'Jaipur Solar Park' },
              ].map((marker, i) => (
                <CircleMarker
                  key={i}
                  center={[marker.lat, marker.lng]}
                  pathOptions={{ color: marker.color, fillColor: marker.color, fillOpacity: 0.8 }}
                  radius={6}
                >
                  <LeafletTooltip>{marker.label}</LeafletTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
            
            {/* Overlay Map Controls */}
            <div className="absolute top-4 left-4 z-[1000] flex space-x-2">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 px-3 py-1.5 rounded-full shadow-sm border border-gray-200">National View</span>
              <span className="bg-white/90 backdrop-blur-sm text-xs font-bold text-indigo-600 px-3 py-1.5 rounded-full shadow-sm border border-indigo-100 cursor-pointer hover:bg-white">Live Geo-Sync</span>
            </div>
            
            <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 w-48">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Map Legend</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span> Cleared</span>
                  <span className="font-bold text-gray-700">124</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span> Pending</span>
                  <span className="font-bold text-gray-700">47</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span> Critical</span>
                  <span className="font-bold text-gray-700">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-emerald-600" />
            State Disbursement Benchmarks
          </h2>
          <div className="space-y-5 mt-2">
            {[
              { state: 'Gujarat', value: 92, target: 100 },
              { state: 'Karnataka', value: 85, target: 100 },
              { state: 'Maharashtra', value: 78, target: 100 },
              { state: 'Uttar Pradesh', value: 64, target: 100 },
              { state: 'Madhya Pradesh', value: 58, target: 100 },
            ].map(bench => (
              <div key={bench.state}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-700">{bench.state}</span>
                  <span className="font-bold text-emerald-600">{bench.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${bench.value > 80 ? 'bg-emerald-500' : bench.value > 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${bench.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex justify-between">
              <span>National Average: 80.5%</span>
              <span className="text-emerald-600 font-bold">▲ 3.2% vs Last FY</span>
            </p>
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
