import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download, Map, ChevronDown, CheckCircle, AlertCircle, FileText, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { generateSyntheticPDF } from '../utils/pdfGenerator';

const generateMockParcels = (projects) => {
  const parcels = [];
  let pId = 1;
  const statuses = ['Pending Award', 'Award Declared', 'Disbursed - PFMS', 'Title Dispute', 'Possession Taken'];
  const owners = ['Rahul More', 'Priya Desai', 'Suresh Patil', 'Amit Shah', 'Kavita Joshi', 'Ramesh Kumar', 'State Govt'];
  
  projects.slice(0, 10).forEach(project => {
    const numParcels = Math.floor(Math.random() * 15) + 5;
    for (let i = 0; i < numParcels; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      parcels.push({
        id: `PRC-${String(pId).padStart(5, '0')}`,
        projectId: project.id,
        village: `Village-${Math.floor(Math.random() * 50)}, ${project.stateId}`,
        surveyNo: `Sur-${Math.floor(Math.random() * 500) + 100}`,
        area: (Math.random() * 5 + 0.5).toFixed(2),
        type: Math.random() > 0.2 ? 'Agricultural' : 'Commercial',
        owner: owners[Math.floor(Math.random() * owners.length)],
        valuation: `₹${(Math.random() * 50 + 10).toFixed(2)} L`,
        status: status,
        stateId: project.stateId,
        districtId: project.districtId,
      });
      pId++;
    }
  });
  return parcels;
};

const Parcels = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const projects = useAppStore(state => state.projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view parcel data.</div>;
  }

  // Generate mock parcels once based on existing projects
  const [allParcels] = useState(() => generateMockParcels(projects));

  // Filter based on user's jurisdiction
  const jurisdictionalParcels = allParcels.filter(p => {
    if (user.role === 'National Admin') return true;
    if (user.role === 'State Officer') return p.stateId === user.stateId;
    if (user.role === 'District Officer') return p.districtId === user.districtId;
    return true; // For other roles show all for now
  });

  const statuses = ['All Statuses', 'Pending Award', 'Award Declared', 'Disbursed - PFMS', 'Title Dispute', 'Possession Taken'];

  const filteredData = jurisdictionalParcels.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disbursed - PFMS':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Possession Taken':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Award':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Title Dispute':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Disbursed - PFMS': return 'bg-green-500';
      case 'Possession Taken': return 'bg-blue-500';
      case 'Pending Award': return 'bg-amber-500';
      case 'Title Dispute': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleExportParcels = () => {
    generateSyntheticPDF('National Land Parcels Registry', 'Cadastral Report', [
      ['Date Generated', new Date().toLocaleDateString(), 'Authority', user?.role || 'Guest'],
      ['Total Parcels', filteredData.length, 'Total Area', `${filteredData.reduce((acc, p) => acc + parseFloat(p.area), 0).toFixed(2)} Hectares`],
      ['Export ID', `PR-${Date.now().toString().slice(-6)}`, 'Data Source', 'Bhuvan API']
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Map className="w-6 h-6 mr-2 text-emerald-600" />
            National Land Parcels Registry
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Cadastral parcel database with PostGIS spatial sync and statutory entitlement ledger.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button onClick={handleExportParcels} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors">
            <FileText className="w-4 h-4 mr-2 text-gray-400" />
            Export Shapefile (ZIP)
          </button>
          <button onClick={handleExportParcels} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Parcel Registry
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Parcels</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{jurisdictionalParcels.length}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">Mapped in System</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Area</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-emerald-600">
              {jurisdictionalParcels.reduce((sum, p) => sum + parseFloat(p.area), 0).toFixed(1)} Ha
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-1">Across all projects</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500">Possession Taken</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-blue-600">
              {jurisdictionalParcels.filter(p => p.status === 'Possession Taken').length}
            </p>
            <span className="text-sm font-medium text-green-600 ml-2">▲ 8%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Legally transferred</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500">Title Disputes</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-red-600">
              {jurisdictionalParcels.filter(p => p.status === 'Title Dispute').length}
            </p>
            <span className="text-sm font-medium text-red-500 ml-2">▼ High Risk</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Pending resolution</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Search Parcel ID, Owner, or Village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Parcel ID</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location & Survey</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Area & Type</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Entitlement Holder</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Award Valuation</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.slice(0, 30).map((parcel) => (
                <tr key={parcel.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{parcel.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{parcel.village}</span>
                      <span className="text-[11px] text-gray-500">Survey No: {parcel.surveyNo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{parcel.area} Ha</span>
                      <span className="text-[11px] text-gray-500">{parcel.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{parcel.owner}</span>
                      <span className="text-[11px] text-emerald-600">Verified Titleholder</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{parcel.valuation}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-[11px] leading-4 font-bold rounded-full border ${getStatusBadge(parcel.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 self-center ${getStatusDot(parcel.status)}`}></span>
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-emerald-600 transition-colors p-1 rounded-full hover:bg-emerald-50">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No parcels found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Parcels;
