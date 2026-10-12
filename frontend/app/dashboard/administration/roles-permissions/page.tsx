import RolesPermissionsDashboard from '@/components/administration/rolesPermissions/RolesPermissionsDashboard';

export default function RolesPermissionsPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Roles &amp; Permissions</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-lg">
          Design secure access blueprints for your institution. Create roles, tune module access, and manage fine‑grained
          permissions in a single control plane.
        </p>
      </div>
      <RolesPermissionsDashboard />
    </main>
  );
}

