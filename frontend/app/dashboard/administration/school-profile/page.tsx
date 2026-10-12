import SchoolProfileDashboard from '@/components/administration/schoolProfile/SchoolProfileDashboard';

export default function SchoolProfilePage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Global School Profile</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
          Maintain your institution&apos;s global identity, branding assets, and contact information across the entire ERP ecosystem.
        </p>
      </div>
      <SchoolProfileDashboard />
    </main>
  );
}
