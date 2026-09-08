import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Eye, Clock, Search, Upload, Shield, FolderOpen, CheckCircle, User, X, Sparkles, AlertTriangle, BarChart2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAppStore from '../store/useAppStore';
import { jsPDF } from 'jspdf';

// ─── Synthetic document data ─────────────────────────────────────────────────
const DOC_TYPES = [
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
const USERS = ['National Admin', 'Maharashtra State Officer', 'Pune District Collector', 'NHAI Project Manager', 'Field Officer Patil'];
const STATUSES = ['Approved', 'Under Review', 'Draft', 'Published'];

const generateDocuments = (projects) => {
  const docs = [];
  let id = 1;
  projects.slice(0, 15).forEach((project) => {
    const n = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < n; i++) {
      const dt = DOC_TYPES[Math.floor(Math.random() * DOC_TYPES.length)];
      const version = Math.floor(Math.random() * 4) + 1;
      const daysAgo = Math.floor(Math.random() * 180);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      docs.push({
        id: `DOC-${String(id).padStart(4, '0')}`,
        projectId: project.id,
        projectName: project.name,
        name: dt.type,
        category: dt.category,
        version: `v${version}.${Math.floor(Math.random() * 10)}`,
        uploadedBy: USERS[Math.floor(Math.random() * USERS.length)],
        uploadedAt: date.toISOString().split('T')[0],
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        fileSize: `${(Math.random() * 5 + 0.2).toFixed(1)} MB`,
        stateId: project.stateId,
        districtId: project.districtId,
        area: project.requiredLandArea,
        compensation: project.estimatedCompensation,
      });
      id++;
    }
  });
  return docs;
};

// ─── Generate real PDF using jsPDF ───────────────────────────────────────────
const downloadDocumentPDF = (doc) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();

  // Header band
  pdf.setFillColor(22, 101, 52);
  pdf.rect(0, 0, W, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GOVERNMENT OF INDIA', W / 2, 10, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Ministry of Rural Development — Department of Land Resources', W / 2, 17, { align: 'center' });
  pdf.text('BHUMISETU — National Land Acquisition & Management System', W / 2, 23, { align: 'center' });

  // Doc title
  pdf.setTextColor(22, 101, 52);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(doc.name.toUpperCase(), W / 2, 42, { align: 'center' });

  // Divider
  pdf.setDrawColor(22, 101, 52);
  pdf.setLineWidth(0.5);
  pdf.line(15, 46, W - 15, 46);

  // Meta table
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  const meta = [
    ['Document ID', doc.id, 'Project ID', doc.projectId],
    ['Project Name', doc.projectName, 'Category', doc.category],
    ['Version', doc.version, 'Status', doc.status],
    ['Uploaded By', doc.uploadedBy, 'Date', doc.uploadedAt],
    ['File Size', doc.fileSize, 'State', doc.stateId],
  ];
  let y = 54;
  meta.forEach(([k1, v1, k2, v2]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(k1 + ':', 15, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(v1), 55, y);
    pdf.setFont('helvetica', 'bold');
    pdf.text(k2 + ':', 110, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(v2), 150, y);
    y += 7;
  });

  // Section divider
  y += 3;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(15, y, W - 15, y);
  y += 8;

  // Content section
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(22, 101, 52);
  pdf.text('DOCUMENT SUMMARY', 15, y);
  y += 7;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);

  const contentMap = {
    'Proposal': [
      `This Land Acquisition Proposal has been prepared in accordance with the Right to Fair Compensation`,
      `and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act).`,
      ``,
      `Required Land Area : ${doc.area} Hectares`,
      `Estimated Compensation : INR ${(doc.compensation / 10000000).toFixed(2)} Crore`,
      `Purpose : Infrastructure Development (Public Purpose)`,
      `Proposed Timeline : 24-36 Months`,
      ``,
      `The proposal has been reviewed by the concerned District Collector and found to be in conformity`,
      `with the provisions of the Act and applicable State Rules.`,
    ],
    'Survey': [
      `Survey and measurement operations were carried out under Section 4 of the RFCTLARR Act, 2013.`,
      ``,
      `Total Parcels Surveyed : ${Math.floor(Math.random() * 80) + 20}`,
      `Agricultural Land : ${Math.floor(doc.area * 0.6)} Hectares`,
      `Non-Agricultural Land : ${Math.floor(doc.area * 0.4)} Hectares`,
      `Encumbered Parcels : ${Math.floor(Math.random() * 10) + 1}`,
      ``,
      `All survey records have been verified and authenticated by the District Survey Authority.`,
      `GIS coordinates have been captured for all affected parcels and uploaded to the system.`,
    ],
    'Scrutiny': [
      `Scrutiny of the proposal was conducted as per SOP under RFCTLARR Act 2013.`,
      ``,
      `Scrutiny Outcome : APPROVED WITH CONDITIONS`,
      `Scrutiny Officer : ${doc.uploadedBy}`,
      `Date of Scrutiny : ${doc.uploadedAt}`,
      ``,
      `Observations :`,
      `1. The land identified is prima facie suitable for the stated public purpose.`,
      `2. Social Impact Assessment (SIA) is required before proceeding to Section 4 notification.`,
      `3. Environmental clearance to be obtained from the competent authority.`,
      ``,
      `Conditions imposed have been communicated to the Land Requiring Body for compliance.`,
    ],
    'Notification': [
      `NOTIFICATION UNDER SECTION 4 OF THE RFCTLARR ACT, 2013`,
      ``,
      `Whereas it appears to the Collector of the District that land is likely to be needed for a`,
      `public purpose, notice is hereby given that for the purpose specified, the land described`,
      `hereunder is likely to be needed.`,
      ``,
      `Project : ${doc.projectName}`,
      `Land Required : ${doc.area} Hectares (approximately)`,
      `Purpose : Public Infrastructure`,
      ``,
      `All persons interested in the said land are hereby notified to appear personally or by agent`,
      `before the Collector on the date to be notified, and state the nature of their respective`,
      `interests in the land and the amount and particulars of their claims to compensation.`,
    ],
    'Award': [
      `AWARD DECLARATION UNDER SECTION 11 OF THE RFCTLARR ACT, 2013`,
      ``,
      `In exercise of powers conferred under Section 11 of the Right to Fair Compensation and`,
      `Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, the Collector`,
      `hereby declares the following award:`,
      ``,
      `Total Compensation Awarded : INR ${(doc.compensation / 10000000).toFixed(2)} Crore`,
      `Number of Landowners : ${Math.floor(Math.random() * 50) + 10}`,
      `Date of Award : ${doc.uploadedAt}`,
      ``,
      `The award includes market value of land, solatium @ 100%, and interest as applicable.`,
      `All eligible landowners are directed to collect their compensation from the District Treasury.`,
    ],
  };

  const lines = contentMap[doc.category] || [
    `This document pertains to Project ${doc.projectId} — ${doc.projectName}.`,
    ``,
    `Category : ${doc.category}`,
    `Version  : ${doc.version}`,
    `Status   : ${doc.status}`,
    ``,
    `This document has been duly processed and approved through the BHUMISETU platform`,
    `in accordance with the applicable provisions of the RFCTLARR Act, 2013.`,
    `All records are subject to audit and inspection by the competent authorities.`,
  ];

  lines.forEach(line => {
    pdf.text(line, 15, y);
    y += 6;
  });

  // Footer
  const pageH = pdf.internal.pageSize.getHeight();
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, pageH - 18, W, 18, 'F');
  pdf.setFontSize(7);
  pdf.setTextColor(120, 120, 120);
  pdf.text(`BHUMISETU | ${doc.id} | ${doc.version} | Generated: ${new Date().toLocaleString('en-IN')}`, W / 2, pageH - 10, { align: 'center' });
  pdf.text('This is a digitally generated document from the BHUMISETU National Land Acquisition Management System.', W / 2, pageH - 5, { align: 'center' });

  pdf.save(`${doc.id}_${doc.name.replace(/\s+/g, '_')}.pdf`);
};

// ─── Synthetic AI Insights from "uploaded" document ──────────────────────────
const generateInsights = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  return {
    fileName,
    fileType: ext.toUpperCase(),
    detectedType: 'Land Survey & Compensation Report',
    confidence: '94.2%',
    extractedFields: [
      { label: 'Project ID', value: 'BHU-' + Math.floor(Math.random() * 200 + 100) },
      { label: 'District', value: 'Pune, Maharashtra' },
      { label: 'Land Area', value: `${(Math.random() * 200 + 50).toFixed(1)} Hectares` },
      { label: 'No. of Parcels', value: `${Math.floor(Math.random() * 80 + 20)}` },
      { label: 'Affected Families', value: `${Math.floor(Math.random() * 150 + 30)}` },
      { label: 'Estimated Compensation', value: `₹${(Math.random() * 50 + 10).toFixed(2)} Crore` },
      { label: 'Document Date', value: new Date().toLocaleDateString('en-IN') },
      { label: 'Issuing Authority', value: 'District Collector, Pune' },
    ],
    flags: [
      { type: 'warning', text: '2 parcels flagged as encumbered — legal clearance pending.' },
      { type: 'ok', text: 'Compensation rate compliant with RFCTLARR Act 2013 Schedule I.' },
      { type: 'ok', text: 'SIA completed and approved by State Authority.' },
      { type: 'warning', text: 'R&R plan for 14 displaced families requires final submission.' },
    ],
    recommendation: 'Document is 94% compliant. Resolve 2 encumbrance flags before proceeding to Section 11 Award.',
  };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Documents = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const projects = useAppStore(state => state.projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [uploadInsights, setUploadInsights] = useState(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const fileInputRef = useRef();

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please select a Demo User from the top right to view documents.</div>;
  }

  const allDocs = generateDocuments(projects);

  const jurisdictionalDocs = allDocs.filter(d => {
    if (user.role === 'National Admin') return true;
    if (user.role === 'State Officer') return d.stateId === user.stateId;
    if (user.role === 'District Officer') return d.districtId === user.districtId;
    return true;
  });

  const categories = ['All', ...new Set(DOC_TYPES.map(d => d.category))];

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
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Published': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const insights = generateInsights(file.name);
    setUploadInsights(insights);
    setShowInsightsModal(true);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="w-6 h-6 mr-2 text-amber-600" />
            {t('pages.documents.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t('pages.documents.desc')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.csv,.png,.jpg"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('pages.documents.upload')}
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('pages.documents.totalDocs'), value: jurisdictionalDocs.length, icon: FileText, color: 'text-amber-500' },
          { label: t('pages.documents.approved'), value: jurisdictionalDocs.filter(d => d.status === 'Approved').length, icon: CheckCircle, color: 'text-green-500' },
          { label: t('pages.documents.underReview'), value: jurisdictionalDocs.filter(d => d.status === 'Under Review').length, icon: Clock, color: 'text-blue-500' },
          { label: t('pages.documents.versions'), value: jurisdictionalDocs.length * 2, icon: Shield, color: 'text-purple-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow border border-gray-100 p-5 flex items-center">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + Table ────────────────────────────────────────────── */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-amber-500 focus:border-amber-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[t('common.id'), t('pages.documents.docName'), t('pages.documents.project'), t('pages.documents.version'), t('pages.documents.uploadedBy'), t('common.date'), t('common.status'), t('common.action')].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocs.slice(0, 30).map((doc) => (
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
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadDocumentPDF(doc)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
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

      {/* ── Upload Insights Modal ─────────────────────────────────────── */}
      {showInsightsModal && uploadInsights && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900">AI Document Analysis</h2>
              </div>
              <button onClick={() => setShowInsightsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* File summary */}
              <div className="flex items-center space-x-3 bg-purple-50 border border-purple-100 rounded-lg p-4">
                <FileText className="w-8 h-8 text-purple-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">{uploadInsights.fileName}</p>
                  <p className="text-xs text-gray-500">{uploadInsights.fileType} • Detected: <span className="font-medium text-purple-700">{uploadInsights.detectedType}</span> • Confidence: <span className="font-bold text-green-600">{uploadInsights.confidence}</span></p>
                </div>
              </div>

              {/* Extracted fields */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1 text-blue-500" /> Extracted Data Fields
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {uploadInsights.extractedFields.map((f) => (
                    <div key={f.label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-medium">{f.label}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-amber-500" /> Compliance Flags
                </h3>
                <div className="space-y-2">
                  {uploadInsights.flags.map((flag, i) => (
                    <div key={i} className={`flex items-start space-x-2 p-3 rounded-lg border ${flag.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                      {flag.type === 'warning'
                        ? <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        : <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                      <span className={`text-sm ${flag.type === 'warning' ? 'text-yellow-800' : 'text-green-800'}`}>{flag.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-bold text-blue-700 uppercase mb-1">AI Recommendation</p>
                <p className="text-sm text-blue-800">{uploadInsights.recommendation}</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
                >
                  ✓ Accept & Save to Repository
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ─────────────────────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-base font-bold text-gray-900 flex items-center">
                <Eye className="w-4 h-4 mr-2 text-blue-500" /> Document Preview
              </h2>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <FileText className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <p className="font-bold text-gray-800">{previewDoc.name}</p>
                <p className="text-xs text-gray-500 mt-1">{previewDoc.id} • {previewDoc.version} • {previewDoc.fileSize}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['Project', previewDoc.projectId],
                  ['Status', previewDoc.status],
                  ['Uploaded By', previewDoc.uploadedBy],
                  ['Date', previewDoc.uploadedAt],
                  ['Category', previewDoc.category],
                  ['Land Area', `${previewDoc.area} ha`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded p-2">
                    <span className="text-xs text-gray-500 block">{k}</span>
                    <span className="font-medium text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={() => setPreviewDoc(null)} className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Close
                </button>
                <button
                  onClick={() => { downloadDocumentPDF(previewDoc); setPreviewDoc(null); }}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
