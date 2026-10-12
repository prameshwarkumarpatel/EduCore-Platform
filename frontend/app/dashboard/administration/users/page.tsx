import UserManagementDashboard from '@/components/administration/userManagement/UserManagementDashboard';

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-lg">
          Manage system users, roles, and access status with a secure, centralized control panel. Search, filter, activate/deactivate,
          and assign roles — all with real-time updates.
        </p>
      </div>
      <UserManagementDashboard />
    </main>
  );
}

