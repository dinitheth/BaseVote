'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ProposalCard } from './proposal-card';
import { contractAddress, contractABI } from '@/lib/contract';
import type { Proposal } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { useWallet } from '@/context/wallet-context';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

const BASE_MAINNET_CHAIN_ID = '0x2105'; // 8453 in hex

export function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { chainId, switchNetwork } = useWallet();

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      setError(null);
      
      if (!chainId) {
        setLoading(false);
        return;
      }
      
      if (chainId !== BASE_MAINNET_CHAIN_ID) {
        setLoading(false);
        return;
      }

      try {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('Please install a web3 wallet like MetaMask.');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const proposalCount = await contract.getProposalCount();
        const proposalsData: Proposal[] = [];

        for (let i = 0; i < proposalCount; i++) {
          const p = await contract.getProposal(i);
          proposalsData.push({
            id: Number(p.id),
            title: p.title,
            description: p.description,
            proposer: p.proposer,
            upvotes: Number(p.upvotes),
            downvotes: Number(p.downvotes),
          });
        }
        
        // Display newest proposals first
        setProposals(proposalsData.reverse());
      } catch (err: any) {
        console.error('Failed to fetch proposals:', err);
        if (err.code === 'BAD_DATA') {
            setError('Failed to load proposals. Please make sure your wallet is connected to the Base Mainnet and refresh the page.');
        } else {
            setError('Failed to load proposals. Please make sure you are connected to the correct network and refresh the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [chainId]);
  
  const WrongNetworkComponent = () => (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-500/50 bg-amber-500/10 p-12 text-center text-amber-500">
      <AlertTriangle className="h-8 w-8 mb-4" />
      <p className="font-bold">Wrong Network</p>
      <p className="text-sm mb-4">Your wallet is not connected to the Base Mainnet.</p>
      <Button onClick={() => switchNetwork(BASE_MAINNET_CHAIN_ID)} variant="secondary">Switch to Base Mainnet</Button>
    </div>
  );

  if (loading) {
    return (
      <>
        <header>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tighter font-headline">Active Proposals</h1>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <p className="text-muted-foreground">Browse and vote on the latest proposals on the Base Mainnet.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border bg-card p-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </>
    );
  }
  
  if (chainId && chainId !== BASE_MAINNET_CHAIN_ID) {
     return (
        <>
            <header>
                <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tighter font-headline">Active Proposals</h1>
                </div>
                <p className="text-muted-foreground">Browse and vote on the latest proposals on the Base Mainnet.</p>
            </header>
            <WrongNetworkComponent />
       </>
     );
  }

  return (
     <>
      <header>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tighter font-headline">Active Proposals</h1>
          {!error && <Badge variant="default" className="text-base px-3 py-1">{proposals.length}</Badge>}
        </div>
        <p className="text-muted-foreground">Browse and vote on the latest proposals on the Base Mainnet.</p>
      </header>
      
      {error && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-12 text-center text-destructive">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!error && proposals.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground">
          <p className="font-bold">No Proposals Found</p>
          <p className="text-sm">Be the first to create a proposal by navigating to the "Create" page.</p>
        </div>
      )}

      {!error && proposals.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </>
  );
}
