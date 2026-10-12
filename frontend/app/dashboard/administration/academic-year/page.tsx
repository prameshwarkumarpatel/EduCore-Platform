import AcademicYearDashboard from '@/components/administration/academicYear/AcademicYearDashboard';

export default function AcademicYearPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Academic Year Setup</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-lg">
          Define academic years, configure terms, and control which year is currently active for all academic workflows.
        </p>
      </div>
      <AcademicYearDashboard />
    </main>
  );
}

