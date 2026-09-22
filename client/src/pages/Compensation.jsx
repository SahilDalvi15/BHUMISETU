import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IndianRupee, Search, CheckCircle, FileText, Download, Users, AlertTriangle, TrendingUp, DollarSign, Clock, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { generateSyntheticPDF } from '../utils/pdfGenerator';

const Compensation = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const allCompensations = useAppStore(state => state.compensations);
  const updateCompensation = useAppStore(state => state.updateCompensation);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view compensation data.</div>;
  }

  // Filter based on user's jurisdiction
  const jurisdictionalCompensations = allCompensations.filter(c => {
    if (user.role === 'National Admin') return true;
    if (user.role === 'State Officer') return c.stateId === user.stateId;
    if (user.role === 'District Officer' || user.role === 'Rehabilitation Authority') return c.districtId === user.districtId;
    return false;
  });

  const filteredData = jurisdictionalCompensations.filter(c => 
    c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id) => {
    updateCompensation(id, { status: 'Approved' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = () => {
    generateSyntheticPDF('Treasury Disbursment Report', 'Ledger', [
      ['Date Generated', new Date().toLocaleDateString(), 'Authority', user.role],
      ['Total Claims', jurisdictionalCompensations.length, 'Total Approved Amount', formatCurrency(jurisdictionalCompensations.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.totalAmount, 0))],
      ['Export ID', `TR-${Date.now().toString().slice(-6)}`, 'Status', 'Verified']
    ]);
  };

  const handleBatchAuth = () => {
    generateSyntheticPDF('Batch DBT Authorization', 'Clearance Certificate', [
      ['Date Generated', new Date().toLocaleDateString(), 'Authority', user.role],
      ['Action', 'Batch Direct Benefit Transfer Authorization', 'Target', 'PFMS Sandbox'],
      ['Export ID', `DBT-${Date.now().toString().slice(-6)}`, 'Status', 'Authorized']
    ]);
  };

  // Mock data for charts
  const velocityData = [
    { name: 'Jan', value: 120 }, { name: 'Feb', value: 340 }, { name: 'Mar', value: 210 },
    { name: 'Apr', value: 580 }, { name: 'May', value: 430 }, { name: 'Jun', value: 890 }
  ];

  const stateBenchmarks = [
    { name: 'Gujarat', value: 92, color: '#10b981' },
    { name: 'Karnataka', value: 86, color: '#10b981' },
    { name: 'Maharashtra', value: 90, color: '#10b981' },
    { name: 'Uttar Pradesh', value: 45, color: '#f59e0b' }
  ];

  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-gray-700">
          <p className="font-bold text-sm mb-1">{payload[0].payload.name}</p>
          <div className="flex items-center text-xs">
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: payload[0].color || payload[0].payload.color }}></span>
            <span className="text-gray-300">{payload[0].value}{payload[0].dataKey === 'value' && payload[0].payload.color ? '%' : ' Cr'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <IndianRupee className="w-6 h-6 mr-2 text-emerald-600" />
            Compensation Awards
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve land compensation according to RFCTLARR guidelines.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button onClick={handleExport} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            Export Treasury Report
          </button>
          <button onClick={handleBatchAuth} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors">
            Batch DBT Authorization
          </button>
        </div>
      </div>

      {/* 6-Column KPI Row - Executive Styling */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Assessed Value <IndianRupee className="w-3 h-3 text-indigo-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">₹64,280 Cr</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">▲ 5,120 Active Projects</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Disbursed via DBT <DollarSign className="w-3 h-3 text-emerald-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">₹51,890 Cr</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">▲ 80.7% Cleared</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Escrow Balance <Shield className="w-3 h-3 text-red-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">₹12,390 Cr</p>
          <span className="text-[10px] font-bold text-red-500 flex items-center mt-1">▼ In CALA Escrow Acct</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Beneficiaries <Users className="w-3 h-3 text-blue-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">4,12,890</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">▲ 1,24,500 Verified</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-amber-200 bg-amber-50/20 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Delayed {'>'} 30 Days <Clock className="w-3 h-3 text-amber-500" />
          </h3>
          <p className="text-2xl font-black text-amber-700 mt-2 tracking-tight">1,418 Cases</p>
          <span className="text-[10px] font-bold text-red-500 flex items-center mt-1">▼ Auto-SLA Notice Issued</span>
        </div>
        
        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            R&R Families <Users className="w-3 h-3 text-purple-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">2,98,400</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">▲ 8.12% of 3,45,190 Re-settled</span>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base font-bold text-gray-900 flex flex-col tracking-tight">
              Monthly Disbursement Velocity (FY 2025-26)
              <span className="text-xs font-normal text-gray-400 mt-1">Target vs Actual DBT throughput to Aadhaar Seeded Accounts (in ₹ Crores)</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Avg ₹4,450 Cr/Mo
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dx={-10} />
                <RechartsTooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorVelocity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base font-bold text-gray-900 flex flex-col tracking-tight">
              State Disbursement Benchmarks
              <span className="text-xs font-normal text-gray-400 mt-1">% of Awarded Amount Disbursed via PFMS DBT</span>
            </h2>
            <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">
              View All 28
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {stateBenchmarks.map((state, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>{state.name}</span>
                  <span className={state.value < 50 ? 'text-amber-600' : 'text-emerald-600'}>
                    ₹{(state.value * 123.4).toFixed(0)} Cr <span className="text-gray-400 ml-1 font-normal">{state.value}%</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${state.value}%`, backgroundColor: state.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500 font-medium">
            <span>National Average: 80.7%</span>
            <span className="text-emerald-500">▲ 3.2% vs Last Quarter</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Search by ID or Owner Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID & Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Land Owner & Area</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Computed Value (INR)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("common.status")}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t("common.action")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No compensation claims found in your jurisdiction.
                  </td>
                </tr>
              ) : (
                filteredData.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{claim.id}</span>
                        <span className="text-xs text-gray-500">Project: {claim.projectId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{claim.ownerName}</span>
                        <span className="text-xs text-gray-500">{claim.landArea} Hectares</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(claim.totalAmount)}</span>
                        <span className="text-xs text-gray-500">Base: {formatCurrency(claim.marketValue)} (x{claim.multiplier}) + {claim.solatium}% Solatium</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-[11px] leading-4 font-bold rounded-full border ${claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 self-center ${claim.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {claim.status === 'Pending Assessment' && (user.role === 'District Officer' || user.role === 'National Admin') ? (
                        <button
                          onClick={() => handleApprove(claim.id)}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve Award
                        </button>
                      ) : (
                        <Link to="/workflow/tasks" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                          <FileText className="w-4 h-4 mr-1" />
                          {t("common.viewDetails")}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compensation;
