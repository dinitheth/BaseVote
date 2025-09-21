'use client';

import { Header } from '@/components/header';
import { WalletProvider, useWallet } from '@/context/wallet-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

function HomeComponent() {
  const { account, connectWallet } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="relative isolate min-h-[calc(100vh-10rem)] flex items-center justify-center">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Badge variant="secondary">Mainnet</Badge>
                <p className="text-sm text-muted-foreground">Base • Chain ID 8453 • ETH</p>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                Welcome to Base<span className="text-primary">Vote</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {account
                  ? "You're connected. Feel free to browse active proposals or create your own."
                  : 'Engage with decentralized governance. Connect your wallet to browse active proposals or submit your own for community consideration.'}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button onClick={connectWallet} disabled={!!account}>
                  {account ? `Connected: ${truncateAddress(account)}` : 'Connect Wallet'}
                </Button>
                <Link href="/main" className="text-sm font-semibold leading-6 text-foreground">
                  Go to Main <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
          <p>BaseVote &copy; {new Date().getFullYear()}</p>
        </footer>
    </div>
  );
}


export default function Home() {
  return (
    <WalletProvider>
      <HomeComponent />
    </WalletProvider>
  );
}
