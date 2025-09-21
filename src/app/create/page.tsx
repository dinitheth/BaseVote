import AppShell from '@/components/app-shell';
import { CreateProposalForm } from '@/components/create-proposal-form';

export default function CreateProposalPage() {
  return (
    <AppShell>
      <div className="space-y-8 max-w-2xl mx-auto">
        <header>
          <h1 className="text-3xl font-bold tracking-tighter font-headline">Create a New Proposal</h1>
          <p className="text-muted-foreground">Fill out the details below to submit your proposal to the DAO.</p>
        </header>
        <CreateProposalForm />
      </div>
    </AppShell>
  );
}
