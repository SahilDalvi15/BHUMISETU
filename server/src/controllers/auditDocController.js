const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');

// @desc    Get Documents by Entity
// @route   GET /api/documents/:entityModel/:entityId
// @access  Protected
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      entityModel: req.params.entityModel,
      entityId: req.params.entityId
    }).populate('uploadedBy', 'name role');
    res.json({ success: true, count: docs.length, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload new Document (Version Control)
// @route   POST /api/documents
// @access  Protected
exports.uploadDocument = async (req, res) => {
  try {
    const { entityModel, entityId, title, category, fileUrl } = req.body;
    
    // Check if document with same title exists for this entity to handle versioning
    let doc = await Document.findOne({ entityModel, entityId, title });

    if (doc) {
      // Create new version
      doc.history.push({
        version: doc.version,
        fileUrl: doc.fileUrl,
        uploadedBy: doc.uploadedBy,
        timestamp: doc.updatedAt
      });
      doc.version += 1;
      doc.fileUrl = fileUrl;
      doc.uploadedBy = req.user.id;
      await doc.save();
    } else {
      // Create fresh document
      doc = await Document.create({
        documentId: `DOC-${Date.now().toString().slice(-6)}`,
        entityModel,
        entityId,
        title,
        category,
        fileUrl,
        uploadedBy: req.user.id
      });
    }

    // Auto-create audit log
    await AuditLog.create({
      actionType: 'DOCUMENT_UPLOAD',
      entityModel: 'Document',
      entityId: doc._id,
      performedBy: req.user.id,
      roleSnapshot: req.user.role,
      details: `Version ${doc.version} of ${title} uploaded.`
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get Audit Trail for an Entity
// @route   GET /api/audit/:entityModel/:entityId
// @access  Protected
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      entityModel: req.params.entityModel,
      entityId: req.params.entityId
    }).populate('performedBy', 'name role').sort({ createdAt: -1 });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
