const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes (we will create these shortly)
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
// Increased body limit to support base64 uploads (photos, documents)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/administration', require('./routes/administrationRoutes'));
app.use('/api/organization', require('./routes/organizationRoutes'));
app.use('/api/school-profile', require('./routes/schoolProfileRoutes'));
app.use('/api/branches', require('./routes/branchesRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/rolesRoutes'));
app.use('/api/academic-years', require('./routes/academicYearRoutes'));
app.use('/api/admissions', require('./routes/admissionsRoutes'));
app.use('/api/application-tracking', require('./routes/applicationTrackingRoutes'));
app.use('/api/document-verification', require('./routes/documentVerificationRoutes'));
app.use('/api/approval', require('./routes/approvalRoutes'));
app.use('/api/enrollment', require('./routes/enrollmentRoutes'));
app.use('/api/student-dashboard', require('./routes/studentDashboardRoutes'));
app.use('/api/directory', require('./routes/directoryRoutes'));
app.use('/api/student-form', require('./routes/studentFormRoutes'));
app.use('/api/student-profile', require('./routes/studentProfileRoutes'));
app.use('/api/academic-history', require('./routes/academicHistoryRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/behavior', require('./routes/behaviorRoutes'));
app.use('/api/medical', require('./routes/medicalRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/parents', require('./routes/parentRoutes'));
app.use('/api/parents/:parentId/linked-students', require('./routes/linkedStudentsRoutes'));
app.use('/api/parents', require('./routes/communicationRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/staff-directory', require('./routes/staffDirectoryRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/subject-allocation', require('./routes/subjectAllocationRoutes'));
app.use('/api/workload', require('./routes/workloadRoutes'));
app.use('/api/staff-attendance', require('./routes/staffAttendanceRoutes'));
app.use('/api/academic-dashboard', require('./routes/academicRoutes'));
app.use('/api/classes-sections', require('./routes/classesSectionsRoutes'));
app.use('/api/classes-sections', require('./routes/classesSectionsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SMS Backend is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
