import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FileText, Plus, ChevronRight, Activity, Search, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

const Proposals = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const allProposals = useAppStore(state => state.proposals);
  const addProposal = useAppStore(state => state.addProposal);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('BHU-115');
  const [newLandRequired, setNewLandRequired] = useState('');

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
      case 'Draft': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newLandRequired) return;

    // Create a mock new proposal
    const newId = `PROP-${1000 + allProposals.length + 1}`;
    const proposal = {
      id: newId,
      projectId: newProject,
      title: newTitle,
      submittedBy: user.id,
      stateId: user.stateId || 'MH',
      districtId: user.districtId || 'THN',
      landRequiredHectares: parseFloat(newLandRequired),
      status: 'Draft',
      documents: []
    };

    addProposal(proposal);
    setIsModalOpen(false);
    setNewTitle('');
    setNewLandRequired('');
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
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none transition-colors"
            >
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
            proposals.slice().reverse().map((prop) => (
              <li key={prop.id} className="hover:bg-gray-50 transition-colors">
                <div className="px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col flex-1">
                    <p className="text-sm font-bold text-gov-green break-words whitespace-normal leading-relaxed">{prop.id} - {prop.title}</p>
                    <p className="flex items-center text-xs sm:text-sm text-gray-500 mt-1.5">
                      Project: {prop.projectId} &bull; Required: {prop.landRequiredHectares} Ha
                    </p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusStyle(prop.status)}`}>
                      {prop.status}
                    </span>
                    <Link to="/tasks" className="mt-0 sm:mt-2 text-sm text-gray-500 font-semibold flex items-center hover:text-gov-green cursor-pointer transition-colors">
                      <Activity className="w-4 h-4 mr-1" /> View Tracking <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* New Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                    Create New Land Proposal
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Land Acquisition for Phase 3 Bypass"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gov-green focus:border-gov-green text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Project ID</label>
                    <select 
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gov-green focus:border-gov-green text-sm"
                    >
                      <option value="BHU-107">BHU-107 (Facility Project 7)</option>
                      <option value="BHU-115">BHU-115 (Corridor Project 15)</option>
                      <option value="BHU-201">BHU-201 (Expressway Alpha)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Required (Hectares)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      placeholder="e.g. 125.5"
                      value={newLandRequired}
                      onChange={(e) => setNewLandRequired(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gov-green focus:border-gov-green text-sm" 
                    />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs text-yellow-800">
                    <strong>Note:</strong> Uploading KML/Shapefiles and supporting documents is simulated for this prototype. 
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none"
                    >
                      Submit Draft
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;
