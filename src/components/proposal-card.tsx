'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Bot, User } from 'lucide-react';
import type { Proposal } from '@/lib/types';
import { AIAnalysisDialog } from './ai-analysis-dialog';
import { useToast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { contractAddress, contractABI } from '@/lib/contract';

type ProposalCardProps = {
  proposal: Proposal;
};

export function ProposalCard({ proposal }: ProposalCardProps) {
  const [votes, setVotes] = useState({ upvotes: proposal.upvotes, downvotes: proposal.downvotes });
  const [isVoting, setIsVoting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast()

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatProposalId = (id: number) => {
    return `PIP-${id.toString().padStart(3, '0')}`;
  };

  const handleVote = async (type: 'up' | 'down') => {
    new Audio('/sound.mp3').play();
    setIsVoting(true);
    
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install a web3 wallet like MetaMask.');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const userAddress = await signer.getAddress();
      const hasVoted = await contract.votes(proposal.id, userAddress);

      if (hasVoted) {
        toast({
          title: "Vote Failed",
          description: "You have already voted on this proposal.",
          variant: "destructive",
        });
        setIsVoting(false);
        return;
      }

      toast({
        title: "Submitting Vote...",
        description: "Please confirm the transaction in your wallet.",
      });

      const tx = await contract.vote(proposal.id, type === 'up');
      await tx.wait();

      if (type === 'up') {
        setVotes(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
      } else {
        setVotes(prev => ({ ...prev, downvotes: prev.downvotes + 1 }));
      }

      toast({
        title: "Vote Cast Successfully!",
        description: `Your ${type === 'up' ? 'Yes' : 'No'} vote has been recorded on the blockchain.`,
      });

    } catch (error: any) {
      console.error('Voting failed:', error);
      let errorMessage = "An unknown error occurred.";

      if (error?.reason?.includes("already voted")) {
          errorMessage = "You have already voted on this proposal.";
      } else if (error.code === 'ACTION_REJECTED') {
        errorMessage = "Transaction rejected in wallet.";
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = "Insufficient funds for gas. Please add funds to your wallet.";
      } else {
        errorMessage = "An error occurred. See console for details.";
      }
      
      toast({
        title: "Vote Failed",
        description: `Could not cast vote: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const formattedId = formatProposalId(proposal.id);

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`item-${proposal.id}`} className="border-b-0">
          <Card className="flex h-full flex-col justify-between transition-all hover:shadow-lg hover:shadow-primary/20">
            <AccordionTrigger className="hover:no-underline p-6 text-left group">
              <div className="w-full">
                <CardTitle className="font-headline text-lg h-14 line-clamp-2">{formattedId}: {proposal.title}</CardTitle>
                 <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Proposed by: {truncateAddress(proposal.proposer)}</span>
                </div>
                <CardDescription className="line-clamp-2 mt-2 h-10 group-data-[state=open]:hidden">{proposal.description}</CardDescription>
              </div>
            </AccordionTrigger>
            <AccordionContent>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proposal.description}</p>
                </CardContent>
            </AccordionContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="flex w-full justify-between items-center">
                <Button variant="upvote" size="sm" onClick={() => handleVote('up')} disabled={isVoting}>
                  <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                  Yes <span className="font-bold">{votes.upvotes.toLocaleString()}</span>
                </Button>
                <Button variant="downvote" size="sm" onClick={() => handleVote('down')} disabled={isVoting}>
                  <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                  No <span className="font-bold">{votes.downvotes.toLocaleString()}</span>
                </Button>
              </div>
              <Button variant="secondary" className="w-full" onClick={() => setIsDialogOpen(true)} disabled={isVoting}>
                <Bot className="mr-2 h-4 w-4" /> AI Sentiment Analysis
              </Button>
            </CardFooter>
          </Card>
        </AccordionItem>
      </Accordion>
      <AIAnalysisDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        proposalTitle={`${formattedId}: ${proposal.title}`}
        proposalDescription={proposal.description}
      />
    </>
  );
}
