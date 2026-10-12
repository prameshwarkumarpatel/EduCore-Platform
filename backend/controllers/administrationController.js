const adminService = require('../services/administrationService');

exports.getAdminDashboardData = async (req, res) => {
  try {
    const [overview, users, roles, branches, academicYear, activities, notifications] = await Promise.all([
      adminService.fetchAdminOverview(),
      adminService.fetchUserCount(),
      adminService.fetchRolesSummary(),
      adminService.fetchBranches(),
      adminService.fetchAcademicYear(),
      adminService.fetchActivities(),
      adminService.fetchNotifications()
    ]);

    res.status(200).json({
      overview,
      users,
      roles,
      branches,
      academicYear,
      activities,
      notifications
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
