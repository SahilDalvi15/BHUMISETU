import React, { useState } from 'react';
import { MapPin, ArrowRight, CheckCircle, Search, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

const Possession = () => {
  const { user } = useAuth();
  const allPossessions = useAppStore(state => state.possessions);
  const updatePossession = useAppStore(state => state.updatePossession);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view possession data.</div>;
  }

  // Filter based on user's jurisdiction
  const jurisdictionalPossessions = allPossessions.filter(p => {
    if (user.role === 'National Admin') return true;
    if (user.role === 'State Officer') return p.stateId === user.stateId;
    if (user.role === 'District Officer' || user.role === 'Land Requiring Body') return p.districtId === user.districtId;
    return false;
  });

  const filteredData = jurisdictionalPossessions.filter(p => 
    p.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTransfer = (id) => {
    updatePossession(id, { 
      status: 'Transferred',
      transferDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-teal-600" />
            Land Possession & Transfer
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the final handover of acquired land to the Requiring Body.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Total Parcels</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{jurisdictionalPossessions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Ready for Transfer</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {jurisdictionalPossessions.filter(p => p.status === 'Ready for Transfer').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Transferred Area (Ha)</h3>
          <p className="mt-2 text-3xl font-bold text-teal-600">
            {jurisdictionalPossessions.filter(p => p.status === 'Transferred').reduce((acc, p) => acc + p.area, 0).toFixed(2)}
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search by ID or Parcel ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID & Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcel Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer Route</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No possession records found in your jurisdiction.
                  </td>
                </tr>
              ) : (
                filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{record.id}</span>
                        <span className="text-xs text-gray-500">Project: {record.projectId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{record.parcelId}</span>
                        <span className="text-xs text-gray-500">{record.area} Hectares</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <span className="text-gray-600 max-w-[100px] truncate" title={record.currentOwner}>{record.currentOwner}</span>
                        <ArrowRight className="w-4 h-4 mx-2 text-teal-500" />
                        <span className="font-semibold text-teal-700">{record.transferee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-max ${record.status === 'Transferred' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {record.status}
                        </span>
                        {record.transferDate && <span className="text-[10px] text-gray-500 mt-1 ml-1">{record.transferDate}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {record.status === 'Ready for Transfer' && (user.role === 'District Officer' || user.role === 'National Admin') ? (
                        <button
                          onClick={() => handleTransfer(record.id)}
                          className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-900"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Execute Handover
                        </button>
                      ) : (
                        <button className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                          <FileText className="w-4 h-4 mr-1" />
                          Transfer Docs
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

export default Possession;
