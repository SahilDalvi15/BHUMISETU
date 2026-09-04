import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    projectId: `PRJ-${Date.now().toString().slice(-6)}`,
    name: '',
    type: 'Highway',
    purpose: '',
    implementingAgency: '',
    requiredLandArea: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Project initiated successfully!');
      setTimeout(() => navigate('/projects'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      // Even if it fails, it's a prototype so we let them proceed or show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/projects" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Initiate New Project</h1>
          <p className="text-sm text-gray-500">Enter preliminary details to register a new land acquisition project.</p>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200">{error}</div>}
          {success && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded text-sm border border-green-200">{success}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">System Generated Project ID</label>
                <div className="mt-1">
                  <input type="text" name="projectId" id="projectId" disabled value={formData.projectId} className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50 px-3 py-2 border text-gray-500" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Official Project Name <span className="text-red-500">*</span></label>
                <div className="mt-1">
                  <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border" placeholder="e.g. Pune Ring Road Phase 1" />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Project Type <span className="text-red-500">*</span></label>
                <div className="mt-1">
                  <select id="type" name="type" required value={formData.type} onChange={handleChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border bg-white">
                    <option>Highway</option>
                    <option>Railway</option>
                    <option>Industrial</option>
                    <option>Irrigation</option>
                    <option>Urban</option>
                    <option>Renewable Energy</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="requiredLandArea" className="block text-sm font-medium text-gray-700">Required Land Area (Hectares) <span className="text-red-500">*</span></label>
                <div className="mt-1">
                  <input type="number" step="0.01" name="requiredLandArea" id="requiredLandArea" required value={formData.requiredLandArea} onChange={handleChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="implementingAgency" className="block text-sm font-medium text-gray-700">Project Implementing Agency (PIA)</label>
                <div className="mt-1">
                  <input type="text" name="implementingAgency" id="implementingAgency" value={formData.implementingAgency} onChange={handleChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border" placeholder="e.g. NHAI, MSRDC" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Public Purpose Description</label>
                <div className="mt-1">
                  <textarea id="purpose" name="purpose" rows={3} value={formData.purpose} onChange={handleChange} className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"></textarea>
                </div>
                <p className="mt-2 text-sm text-gray-500">Briefly describe the public purpose as required under Section 2(1) of RFCTLARR Act.</p>
              </div>

            </div>

            <div className="pt-5 border-t border-gray-200 flex justify-end gap-3">
              <Link to="/projects" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400">
                {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Register Project</>}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
