import OrganizationSetupDashboard from '@/components/administration/organizationSetup/OrganizationSetupDashboard';

export default function OrganizationSetupPage() {
  return (
    <main className="min-h-screen bg-background p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Organization Setup</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Configure root system parameters, design organizational hierarchy, and construct standard policies across your educational entity.
        </p>
      </div>
      <OrganizationSetupDashboard />
    </main>
  );
}
