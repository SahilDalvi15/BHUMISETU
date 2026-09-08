import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Eye, Clock, Search, Upload, Shield, FolderOpen, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

// Synthetic document data tied to real projects
const generateDocuments = (projects) => {
  const docTypes = [
    { type: 'Land Acquisition Proposal', category: 'Proposal' },
    { type: 'Survey & Measurement Report', category: 'Survey' },
    { type: 'Scrutiny Report', category: 'Scrutiny' },
    { type: 'Section 4 Notification', category: 'Notification' },
    { type: 'Section 11 Award Declaration', category: 'Award' },
    { type: 'Compensation Assessment Sheet', category: 'Compensation' },
    { type: 'R&R Scheme Document', category: 'R&R' },
    { type: 'Possession Certificate', category: 'Possession' },
    { type: 'GIS Survey Map', category: 'GIS' },
    { type: 'Environmental Impact Assessment', category: 'Compliance' },
    { type: 'Social Impact Assessment (SIA)', category: 'Compliance' },
    { type: 'District Collector Approval', category: 'Approval' },
  ];

  const users = ['National Admin', 'Maharashtra State Officer', 'Pune District Collector', 'NHAI Project Manager', 'Field Officer Patil'];
  const statuses = ['Approved', 'Under Review', 'Draft', 'Published'];

  const docs = [];
  let docId = 1;

  projects.slice(0, 15).forEach((project) => {
    const numDocs = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < numDocs; i++) {
      const docType = docTypes[Math.floor(Math.random() * docTypes.length)];
      const version = Math.floor(Math.random() * 4) + 1;
      const daysAgo = Math.floor(Math.random() * 180);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      docs.push({
        id: `DOC-${String(docId).padStart(4, '0')}`,
        projectId: project.id,
        projectName: project.name,
        name: docType.type,
        category: docType.category,
        version: `v${version}.${Math.floor(Math.random() * 10)}`,
        uploadedBy: users[Math.floor(Math.random() * users.length)],
        uploadedAt: date.toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        fileSize: `${(Math.random() * 5 + 0.2).toFixed(1)} MB`,
        stateId: project.stateId,
        districtId: project.districtId,
      });
      docId++;
    }
  });

  return docs;
};

const Documents = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const projects = useAppStore(state => state.projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view documents.</div>;
  }

  const allDocs = generateDocuments(projects);

  // Filter by jurisdiction
  const jurisdictionalDocs = allDocs.filter(d => {
    if (user.role === 'National Admin') return true;
    if (user.role === 'State Officer') return d.stateId === user.stateId;
    if (user.role === 'District Officer') return d.districtId === user.districtId;
    return true;
  });

  const categories = ['All', ...new Set(allDocs.map(d => d.category))];

  const filteredDocs = jurisdictionalDocs.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Published': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="w-6 h-6 mr-2 text-amber-600" />
            {t('pages.documents.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('pages.documents.desc')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gov-green hover:bg-green-800 focus:outline-none">
            <Upload className="w-4 h-4 mr-2" />
            {t('pages.documents.upload')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-amber-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('pages.documents.totalDocs')}</p>
              <p className="text-2xl font-bold text-gray-900">{jurisdictionalDocs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('pages.documents.approved')}</p>
              <p className="text-2xl font-bold text-gray-900">{jurisdictionalDocs.filter(d => d.status === 'Approved').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('pages.documents.underReview')}</p>
              <p className="text-2xl font-bold text-gray-900">{jurisdictionalDocs.filter(d => d.status === 'Under Review').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('pages.documents.versions')}</p>
              <p className="text-2xl font-bold text-gray-900">{jurisdictionalDocs.length * 2}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-green-500 focus:border-green-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.id')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pages.documents.docName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pages.documents.project')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pages.documents.version')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('pages.documents.uploadedBy')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.action')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocs.slice(0, 25).map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{doc.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.fileSize} • {doc.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doc.projectId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {doc.version}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{doc.uploadedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="text-green-600 hover:text-green-900" title="Download"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDocs.length === 0 && (
          <div className="p-8 text-center text-gray-500">No documents found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default Documents;
