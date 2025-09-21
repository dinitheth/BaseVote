'use client';

import { Header } from '@/components/header';
import { WalletProvider } from '@/context/wallet-context';

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background font-body text-foreground">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
        {children}
        </main>
        <footer className="py-6 text-center text-muted-foreground text-sm">
          <p>BaseVote &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </WalletProvider>
  );
}
