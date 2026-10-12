const dashboardService = require('../services/dashboardService');

exports.getOverview = async (req, res) => {
  try {
    const studentData = await dashboardService.calculateStudentCount();
    const teacherData = await dashboardService.calculateTeacherCount();
    res.status(200).json({
      systemStatus: "Operational",
      activeTerm: "Fall 2026",
      studentCount: studentData.total,
      teacherCount: teacherData.total,
      message: "Welcome back to EduPro Dashboard"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKPIMetrics = async (req, res) => {
  try {
    const students = await dashboardService.calculateStudentCount();
    const teachers = await dashboardService.calculateTeacherCount();
    const revenue = await dashboardService.calculateRevenueMTD();
    const attendance = await dashboardService.calculateAttendance();

    res.status(200).json({
      students,
      teachers,
      revenue,
      attendance
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await dashboardService.getRecentActivities();
    res.status(200).json({ activities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await dashboardService.getNotifications();
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.handleQuickAction = async (req, res) => {
  try {
    const { actionType, payload } = req.body;
    const out = await dashboardService.logQuickAction({ actionType, payload });
    res.status(200).json({ message: `Action ${actionType} processed successfully.`, data: out });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body || {};
    const out = await dashboardService.markNotificationRead(id, isRead);
    res.status(200).json({ message: 'Notification updated', data: out });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
