const Notification = require('../models/Notification');

exports.getNotificationsByProject = async (req, res) => {
  try {
    const notifications = await Notification.find({ projectId: req.params.projectId }).populate('villagesCovered');
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notificationId = `NOT-${Date.now().toString().slice(-6)}`;
    const notification = await Notification.create({ ...req.body, notificationId });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
