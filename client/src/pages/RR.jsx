import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Home, CheckCircle, Search, FileText, AlertTriangle, ChevronRight, Activity, Download, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { generateSyntheticPDF } from '../utils/pdfGenerator';

const RR = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const allRRFamilies = useAppStore(state => state.rrFamilies);
  const updateRRFamily = useAppStore(state => state.updateRRFamily);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view R&R data.</div>;
  }

  // Filter based on user's jurisdiction
  const jurisdictionalRR = allRRFamilies.filter(f => {
    if (user.role === 'National Admin') return true;
    if (user.role === 'State Officer') return f.stateId === user.stateId;
    if (user.role === 'District Officer' || user.role === 'Rehabilitation Authority') return f.districtId === user.districtId;
    return false;
  });

  const filteredData = jurisdictionalRR.filter(f => 
    f.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (id, newStatus) => {
    updateRRFamily(id, { status: newStatus });
  };

  const handleExportRR = () => {
    generateSyntheticPDF('R&R Statutory Execution Report', 'Compliance Ledger', [
      ['Date Generated', new Date().toLocaleDateString(), 'Authority', user?.role || 'Guest'],
      ['Total Affected Families', jurisdictionalRR.length, 'Total R&R Award Value', `₹${jurisdictionalRR.reduce((acc, c) => acc + (c.rrAmount || 0), 0)}`],
      ['Export ID', `RR-${Date.now().toString().slice(-6)}`, 'Status', 'Verified']
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-indigo-600" />
            Statutory Rehabilitation & Resettlement (R&R) Authority Command
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("pages.rr.desc")}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button onClick={handleExportRR} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            Export Census Report
          </button>
          <button onClick={handleExportRR} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Progress Report
          </button>
        </div>
      </div>

      {/* 6-Column KPI Row - Executive Styling */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Total PAP Census <Users className="w-3 h-3 text-indigo-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">{jurisdictionalRR.length.toLocaleString()}</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">▲ Infrastructure Corridors</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Displaced Families <Home className="w-3 h-3 text-blue-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">{Math.floor(jurisdictionalRR.length * 0.4).toLocaleString()}</p>
          <span className="text-[10px] font-bold text-blue-600 flex items-center mt-1">▲ R&R Plans Sanctioned</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            DBT Disbursal <DollarSign className="w-3 h-3 text-emerald-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">₹4,210 Cr</p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">▲ PFMS Credited</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Model Townships <Home className="w-3 h-3 text-purple-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">29 / 38</p>
          <span className="text-[10px] font-bold text-purple-600 flex items-center mt-1">▲ Colonies Handed Over</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            Livelihood Restored <Users className="w-3 h-3 text-emerald-400" />
          </h3>
          <p className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {jurisdictionalRR.filter(f => f.status === 'Rehabilitated').length}
          </p>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">▲ NSDC Trained</span>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-amber-200 bg-amber-50/20 p-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-500 flex justify-between items-center">
            SIA Pendency <AlertTriangle className="w-3 h-3 text-amber-500" />
          </h3>
          <p className="text-2xl font-black text-amber-700 mt-2 tracking-tight">242</p>
          <span className="text-[10px] font-bold text-red-500 flex items-center mt-1">▼ Action Required</span>
        </div>
      </div>

      {/* Statutory R&R Execution Lifecycle (Sec 15-31) Stepper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-6 flex justify-between">
          <span>Statutory R&R Execution Lifecycle (RFCTLARR Act Sec 15-31)</span>
          <span className="text-indigo-600">Overall Corridor Projection: 72.4% Compliant</span>
        </h3>
        <div className="relative pt-2 pb-2">
          {/* Background tracks fixed to top-4 (16px) which is exact center of the 32px circles */}
          <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded"></div>
          <div className="absolute top-4 left-0 w-[72%] h-1 bg-indigo-500 rounded transition-all duration-1000"></div>
          
          <div className="relative flex justify-between items-start text-center">
            {[
              { id: '1', title: 'SIA & Census', sub: '100% Cleared', color: 'bg-emerald-500 text-white shadow-md' },
              { id: '2', title: 'Gram Sabha Consent', sub: '100% Panchayats', color: 'bg-emerald-500 text-white shadow-md' },
              { id: '3', title: 'Draft Scheme Notif', sub: '100% Issued', color: 'bg-emerald-500 text-white shadow-md' },
              { id: '4', title: 'Final Scheme', sub: 'Published', color: 'bg-emerald-500 text-white shadow-md' },
              { id: '5', title: 'R&R Plan Award', sub: 'Section 31', color: 'bg-indigo-600 text-white border-4 border-indigo-100 shadow-xl scale-110' },
              { id: '6', title: 'DBT / Escrow Auth', sub: 'Pending', color: 'bg-white text-gray-400 border-2 border-gray-200' },
              { id: '7', title: 'Grievance Redressal', sub: 'Pending', color: 'bg-white text-gray-400 border-2 border-gray-200' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center z-10 w-24">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step.color} transition-all`}>
                  {step.color.includes('emerald') ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-gray-800 uppercase leading-tight tracking-wider">{step.title}</p>
                  <p className={`text-[10px] mt-1 font-semibold ${step.color.includes('emerald') ? 'text-emerald-600' : 'text-gray-400'}`}>{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Search R&R Ledger..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Family ID & Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Family Head & Dependents</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Entitlement Package</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Disbursement Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{t("common.action")}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                    No R&R families found in your jurisdiction.
                  </td>
                </tr>
              ) : (
                filteredData.map((family) => (
                  <tr key={family.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{family.id}</span>
                        <span className="text-[11px] text-indigo-600 font-medium">Project: {family.projectId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{family.familyHead}</span>
                        <span className="text-[11px] text-gray-500">{family.dependents} Dependents | {family.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 flex items-center font-medium">
                        <Home className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {family.entitlementChosen}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-[11px] leading-4 font-bold rounded-full border ${family.status === 'Rehabilitated' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 self-center ${family.status === 'Rehabilitated' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        {family.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {family.status !== 'Rehabilitated' && (user.role === 'Rehabilitation Authority' || user.role === 'National Admin') ? (
                        <button
                          onClick={() => handleStatusUpdate(family.id, 'Rehabilitated')}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Mark Awarded
                        </button>
                      ) : (
                        <button className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                          <FileText className="w-4 h-4 mr-1" />
                          Details
                        </button>
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

export default RR;
