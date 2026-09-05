import React, { useState } from 'react';
import { Users, Home, CheckCircle, Search, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

const RR = () => {
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

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-indigo-600" />
            Rehabilitation & Resettlement (R&R)
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage displaced families and their rehabilitation entitlements.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Total Affected Families</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{jurisdictionalRR.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Awaiting Entitlement</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {jurisdictionalRR.filter(f => f.status !== 'Rehabilitated').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Fully Rehabilitated</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {jurisdictionalRR.filter(f => f.status === 'Rehabilitated').length}
          </p>
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search by ID or Family Head..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family ID & Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family Head & Dependents</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entitlement Chosen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No R&R families found in your jurisdiction.
                  </td>
                </tr>
              ) : (
                filteredData.map((family) => (
                  <tr key={family.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{family.id}</span>
                        <span className="text-xs text-gray-500">Project: {family.projectId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{family.familyHead}</span>
                        <span className="text-xs text-gray-500">{family.dependents} Dependents | {family.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 flex items-center">
                        <Home className="w-4 h-4 mr-1 text-gray-400" />
                        {family.entitlementChosen}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${family.status === 'Rehabilitated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {family.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {family.status !== 'Rehabilitated' && (user.role === 'Rehabilitation Authority' || user.role === 'National Admin') ? (
                        <button
                          onClick={() => handleStatusUpdate(family.id, 'Rehabilitated')}
                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as Rehabilitated
                        </button>
                      ) : (
                        <button className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                          <FileText className="w-4 h-4 mr-1" />
                          View Details
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
