import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, AlertCircle, Briefcase, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const allProjects = useAppStore(state => state.projects);
  
  // Basic filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter based on role
  const getRoleFilteredProjects = () => {
    if (!user) return [];
    if (user.role === 'State Officer') return allProjects.filter(p => p.stateId === user.stateId);
    if (user.role === 'District Officer') return allProjects.filter(p => p.districtId === user.districtId);
    return allProjects;
  };

  const projects = getRoleFilteredProjects();

  const getStatusColor = (stage) => {
    switch(stage) {
      case 'Proposed': return 'bg-gray-100 text-gray-800';
      case 'Verified': return 'bg-blue-100 text-blue-800';
      case 'Land Identified': return 'bg-indigo-100 text-indigo-800';
      case 'Notified': return 'bg-yellow-100 text-yellow-800';
      case 'Compensation Assessment': return 'bg-purple-100 text-purple-800';
      case 'Awarded': return 'bg-orange-100 text-orange-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Filter logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.stage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-gov-green" />
            {t('pages.projects.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t('pages.projects.desc')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {['National Admin', 'State Officer', 'Land Requiring Body'].includes(user?.role) && (
            <Link 
              to="/projects/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Initiate New Project
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 shadow rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="block w-full sm:w-56 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="Proposed">Proposed</option>
            <option value="Land Identified">Land Identified</option>
            <option value="Notified">Notified</option>
            <option value="Compensation Assessment">Compensation Assessment</option>
            <option value="Awarded">Awarded</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {!user && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No Demo User Selected</p>
              <p className="text-xs text-yellow-600 mt-1">Please select a user from the top right switcher to view data.</p>
            </div>
          </div>
        </div>
      )}

      {/* Project Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.name')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.stage')} / Area</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.progress')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.status')}</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">{t('common.action')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No projects found matching the filters or jurisdiction.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{project.id}</span>
                        <span className="text-sm text-gray-500">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{project.type}</span>
                        <span className="text-xs text-gray-500">{project.requiredLandArea || '--'} Hectares</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.stage)}`}>
                        {project.stage || 'Proposed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-medium rounded border ${getRiskColor(project.riskLevel)}`}>
                        {project.riskLevel || 'LOW'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/projects/${project.id}`} className="text-emerald-600 hover:text-emerald-900 inline-flex items-center">
                        {t('common.viewDetails')}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
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

export default Projects;
