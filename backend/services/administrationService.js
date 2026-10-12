exports.fetchAdminOverview = async () => {
  return { systemState: 'Healthy', lastBackup: '2 hours ago', uptime: '99.98%' };
};

exports.fetchUserCount = async () => {
  return { total: 4215, students: 3800, teachers: 245, parents: 120, staff: 50, growth: "+150 this month" };
};

exports.fetchRolesSummary = async () => {
  return [
    { name: 'Administrator', count: 5 },
    { name: 'Teacher', count: 245 },
    { name: 'Student', count: 3800 },
    { name: 'Parent', count: 120 },
    { name: 'Support Staff', count: 50 }
  ];
};

exports.fetchBranches = async () => {
  return { total: 4, active: 4, cities: ['North Campus', 'South Campus', 'East Wing', 'West Branch'] };
};

exports.fetchAcademicYear = async () => {
  return { currentYear: '2026-2027', term: 'Fall Semester', daysRemaining: 85, status: 'Ongoing' };
};

exports.fetchActivities = async () => {
  return [
    { id: 101, action: "New Role Created", subject: "Librarian privileges updated", time: "15 mins ago", type: "security" },
    { id: 102, action: "User Created", subject: "Mark Johnson (Teacher)", time: "1 hour ago", type: "user" },
    { id: 103, action: "Branch Added", subject: "East Wing Campus activated", time: "3 hours ago", type: "system" },
    { id: 104, action: "Settings Changed", subject: "Global Attendance Policy threshold updated", time: "5 hours ago", type: "security" },
  ];
};

exports.fetchNotifications = async () => {
  return [
    { id: 1, title: "License Expiry Alert", message: "Educational software license expires in 5 days.", type: "alert", isRead: false },
    { id: 2, title: "System Maintenance", message: "Scheduled downtime on Saturday 2 AM.", type: "system", isRead: true },
    { id: 3, title: "Unassigned Roles", message: "5 new staff members are pending role assignment.", type: "action", isRead: false },
  ];
};
