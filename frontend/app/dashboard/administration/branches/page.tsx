import BranchesDashboard from '@/components/administration/branches/BranchesDashboard';

export default function BranchesPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Multi-Campus Registry</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
          Orchestrate and monitor all institutional branches from a central command center. Configure locations, status, and personnel distribution.
        </p>
      </div>
      <BranchesDashboard />
    </main>
  );
}
