import React, { useState } from 'react';
import { IndianRupee, CheckCircle, FileText, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { Link } from 'react-router-dom';

const Compensation = () => {
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

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <IndianRupee className="w-6 h-6 mr-2 text-green-600" />
            Compensation Awards
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve land compensation according to RFCTLARR guidelines.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Total Claims</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{jurisdictionalCompensations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Pending Approval</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {jurisdictionalCompensations.filter(c => c.status === 'Pending Assessment').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-500">Total Amount Disbursed</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {formatCurrency(jurisdictionalCompensations.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.totalAmount, 0))}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${claim.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {claim.status === 'Pending Assessment' && (user.role === 'District Officer' || user.role === 'National Admin') ? (
                        <button
                          onClick={() => handleApprove(claim.id)}
                          className="inline-flex items-center text-sm font-medium text-gov-green hover:text-green-900"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve Award
                        </button>
                      ) : (
                        <Link to="/workflow/tasks" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                          <FileText className="w-4 h-4 mr-1" />
                          View Details
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
