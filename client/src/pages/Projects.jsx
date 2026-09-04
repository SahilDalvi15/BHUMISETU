import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, AlertCircle, Briefcase, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Basic filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.data);
    } catch (err) {
      setError('Failed to fetch projects. Please try again.');
      // Fallback dummy data for prototype if backend is not running
      setProjects([
        { _id: '1', projectId: 'PRJ-MH-001', name: 'Mumbai-Ahmedabad High Speed Rail', type: 'Railway', stage: 'Land Identified', requiredLandArea: 1400, riskLevel: 'HIGH', updatedAt: new Date().toISOString() },
        { _id: '2', projectId: 'PRJ-MH-002', name: 'Pune Ring Road', type: 'Highway', stage: 'Notified', requiredLandArea: 800, riskLevel: 'MEDIUM', updatedAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (stage) => {
    switch(stage) {
      case 'Proposed': return 'bg-gray-100 text-gray-800';
      case 'Verified': return 'bg-blue-100 text-blue-800';
      case 'Land Identified': return 'bg-indigo-100 text-indigo-800';
      case 'Notified': return 'bg-yellow-100 text-yellow-800';
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
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.projectId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.stage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-gov-green" />
            Project Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View, track, and manage land acquisition projects across jurisdictions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {['National Admin', 'State Officer'].includes(user?.role) && (
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Search by Project Name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="Proposed">Proposed</option>
            <option value="Land Identified">Land Identified</option>
            <option value="Notified">Notified</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
              <p className="text-xs text-yellow-600 mt-1">Showing dummy data for prototype visualization.</p>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID & Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Area</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stage</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700 mr-3"></div>
                      Loading projects...
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No projects found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{project.projectId}</span>
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
                      <Link to={`/projects/${project._id}`} className="text-gov-green hover:text-green-900 flex items-center justify-end">
                        View Details
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
