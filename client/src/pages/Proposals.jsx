import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FileText, Plus, ChevronRight, Activity, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

const Proposals = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const allProposals = useAppStore(state => state.proposals);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view proposals.</div>;
  }

  // Filter based on role
  const getRoleFilteredProposals = () => {
    if (user.role === 'National Admin') return allProposals;
    if (user.role === 'State Officer') return allProposals.filter(p => p.stateId === user.stateId);
    if (user.role === 'District Officer') return allProposals.filter(p => p.districtId === user.districtId);
    if (user.role === 'Land Requiring Body') return allProposals.filter(p => p.submittedBy === user.id);
    return allProposals;
  };

  const proposals = getRoleFilteredProposals().filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Under Verification': return 'bg-blue-100 text-blue-800';
      case 'Clarification Required': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-gov-green" />
            {t("pages.proposals.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Submit and track land requirement proposals from Requiring Bodies.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {['Land Requiring Body', 'Project Implementing Agency', 'National Admin'].includes(user?.role) && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none">
              <Plus className="w-4 h-4 mr-2" />
              Submit Proposal
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
          {proposals.length === 0 ? (
            <li className="px-6 py-10 text-center text-gray-500">No proposals found in your jurisdiction.</li>
          ) : (
            proposals.map((prop) => (
              <li key={prop.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gov-green truncate">{prop.id} - {prop.title}</p>
                    <p className="flex items-center text-sm text-gray-500 mt-1">
                      Project: {prop.projectId} • Required: {prop.landRequiredHectares} Ha
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(prop.status)}`}>
                      {prop.status}
                    </span>
                    <Link to="/tasks" className="mt-2 text-sm text-gray-500 flex items-center hover:text-gov-green cursor-pointer transition-colors">
                      <Activity className="w-4 h-4 mr-1" /> View Tracking <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Proposals;
