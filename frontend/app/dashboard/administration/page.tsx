import AdministrationDashboard from '@/components/administration/AdministrationDashboard';

export default function AdministrationPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Administration Control Center</h1>
        <p className="text-muted-foreground w-full max-w-2xl">
          Centralized management for roles, branches, campuses, and major administrative workflows.
        </p>
      </div>
      <AdministrationDashboard />
    </main>
  );
}
