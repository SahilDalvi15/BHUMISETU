import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { History, Search, User, Clock, CheckCircle, AlertTriangle, FileText, Eye, Edit, Trash2, Upload, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';

// Generate synthetic audit log entries tied to real data
const generateAuditLog = (projects, tasks, compensations, possessions) => {
  const actions = [
    { action: 'PROJECT_CREATED', icon: 'create', desc: (p) => `Created project "${p.name}" (${p.id})` },
    { action: 'STAGE_UPDATED', icon: 'update', desc: (p) => `Updated stage to "${p.stage}" for project ${p.id}` },
    { action: 'PROPOSAL_APPROVED', icon: 'approve', desc: (p) => `Approved land proposal for project ${p.id}` },
    { action: 'SCRUTINY_COMPLETED', icon: 'approve', desc: (p) => `Completed scrutiny review for project ${p.id}` },
    { action: 'DOCUMENT_UPLOADED', icon: 'upload', desc: (p) => `Uploaded Survey Report v2.1 for ${p.id}` },
    { action: 'DOCUMENT_VERSIONED', icon: 'version', desc: (p) => `Created new version of Compensation Sheet for ${p.id}` },
    { action: 'COMPENSATION_APPROVED', icon: 'approve', desc: (p) => `Approved compensation of ₹${(p.estimatedCompensation / 10000000).toFixed(1)} Cr for ${p.id}` },
    { action: 'TASK_COMPLETED', icon: 'complete', desc: (p) => `Completed workflow task for ${p.id}` },
    { action: 'ALERT_RESOLVED', icon: 'resolve', desc: (p) => `Resolved risk alert for ${p.id}` },
    { action: 'POSSESSION_TRANSFERRED', icon: 'transfer', desc: (p) => `Initiated land possession transfer for ${p.id}` },
    { action: 'GIS_PARCEL_TAGGED', icon: 'create', desc: (p) => `Geo-tagged parcel coordinates for ${p.id}` },
    { action: 'RR_STATUS_UPDATED', icon: 'update', desc: (p) => `Updated R&R rehabilitation status for ${p.id}` },
    { action: 'NOTIFICATION_ISSUED', icon: 'create', desc: (p) => `Issued Section 4 notification for ${p.id}` },
    { action: 'AWARD_DECLARED', icon: 'approve', desc: (p) => `Declared Section 11 award for ${p.id}` },
  ];

  const users = [
    { name: 'National Admin', role: 'National Admin', ip: '10.0.1.1' },
    { name: 'Maharashtra State Officer', role: 'State Officer', ip: '10.0.2.15' },
    { name: 'Pune District Collector', role: 'District Officer', ip: '10.0.3.42' },
    { name: 'NHAI Project Manager', role: 'Land Requiring Body', ip: '10.0.4.8' },
    { name: 'Field Officer Patil', role: 'Field Verification Officer', ip: '10.0.5.22' },
    { name: 'R&R Authority - Pune', role: 'Rehabilitation Authority', ip: '10.0.6.11' },
  ];

  const logs = [];
  let logId = 1;

  for (let i = 0; i < 80; i++) {
    const project = projects[Math.floor(Math.random() * Math.min(projects.length, 15))];
    if (!project) continue;
    const actionDef = actions[Math.floor(Math.random() * actions.length)];
    const userDef = users[Math.floor(Math.random() * users.length)];
    const hoursAgo = Math.floor(Math.random() * 720); // last 30 days
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    logs.push({
      id: `AUD-${String(logId).padStart(5, '0')}`,
      timestamp: timestamp.toISOString(),
      action: actionDef.action,
      description: actionDef.desc(project),
      userName: userDef.name,
      userRole: userDef.role,
      ipAddress: userDef.ip,
      entityId: project.id,
      iconType: actionDef.icon,
      stateId: project.stateId,
      districtId: project.districtId,
    });
    logId++;
  }

  // Sort by timestamp descending (most recent first)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return logs;
};

const AuditLog = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const projects = useAppStore(state => state.projects);
  const tasks = useAppStore(state => state.tasks);
  const compensations = useAppStore(state => state.compensations);
  const possessions = useAppStore(state => state.possessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User to view audit logs.</div>;
  }

  const allLogs = useMemo(() => generateAuditLog(projects, tasks, compensations, possessions), [projects, tasks, compensations, possessions]);

  // Filter by jurisdiction
  const jurisdictionalLogs = allLogs.filter(l => {
    if (user.role === 'National Admin') return true;
    if (user.role === 'State Officer') return l.stateId === user.stateId;
    if (user.role === 'District Officer') return l.districtId === user.districtId;
    return true;
  });

  const actionTypes = ['All', ...new Set(allLogs.map(l => l.action))];

  const filteredLogs = jurisdictionalLogs.filter(l => {
    const matchesSearch = l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'All' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (iconType) => {
    switch (iconType) {
      case 'create': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'update': return <Edit className="w-4 h-4 text-amber-500" />;
      case 'approve': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'upload': return <Upload className="w-4 h-4 text-purple-500" />;
      case 'version': return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'resolve': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'transfer': return <Eye className="w-4 h-4 text-teal-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionBadge = (action) => {
    if (action.includes('APPROVED') || action.includes('COMPLETED') || action.includes('DECLARED')) return 'bg-green-100 text-green-700 border-green-200';
    if (action.includes('CREATED') || action.includes('UPLOADED') || action.includes('TAGGED') || action.includes('ISSUED')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (action.includes('UPDATED') || action.includes('VERSIONED')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (action.includes('RESOLVED') || action.includes('TRANSFERRED')) return 'bg-teal-100 text-teal-700 border-teal-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <History className="w-6 h-6 mr-2 text-indigo-600" />
            {t('pages.audit.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('pages.audit.desc')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Shield className="w-3 h-3 mr-1" />
            {t('pages.audit.immutable')}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <div className="flex items-center">
            <History className="w-8 h-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('pages.audit.totalEntries')}</p>
              <p className="text-2xl font-bold text-gray-900">{jurisdictionalLogs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('pages.audit.uniqueUsers')}</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(jurisdictionalLogs.map(l => l.userName)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-amber-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('pages.audit.last24h')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {jurisdictionalLogs.filter(l => (Date.now() - new Date(l.timestamp).getTime()) < 86400000).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Table */}
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
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            {actionTypes.map(a => (
              <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Audit Log Timeline */}
        <div className="divide-y divide-gray-100">
          {filteredLogs.slice(0, 30).map((log) => (
            <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {getActionIcon(log.iconType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{log.description}</p>
                  <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold rounded border ${getActionBadge(log.action)} uppercase tracking-wider whitespace-nowrap`}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center"><User className="w-3 h-3 mr-1" />{log.userName} ({log.userRole})</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{formatTimestamp(log.timestamp)}</span>
                  <span className="font-mono text-gray-400">IP: {log.ipAddress}</span>
                  <span className="font-mono text-gray-400">{log.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">No audit log entries found.</div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
