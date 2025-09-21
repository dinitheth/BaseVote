import AppShell from '@/components/app-shell';
import { ProposalList } from '@/components/proposal-list';

export default function MainPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <ProposalList />
      </div>
    </AppShell>
  );
}
