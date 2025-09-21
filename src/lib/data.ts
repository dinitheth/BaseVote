// This file is no longer used for displaying proposals but is kept 
// in case you want to reference the original mock data structure.
// The app now fetches live data from the smart contract.
import type { Proposal } from './types';

export const mockProposals: Proposal[] = [
  {
    id: 1,
    formattedId: 'PIP-001',
    title: 'Treasury Grant for Ecosystem Development',
    description: 'Allocate 500,000 XPL from the treasury to fund grants for developers building new dApps and tools on the Plasma network. This will foster innovation and expand the ecosystem.',
    upvotes: 12503,
    downvotes: 189,
    proposer: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  },
  {
    id: 2,
    formattedId: 'PIP-002',
    title: 'Reduce Network Transaction Fees by 10%',
    description: 'A proposal to decrease the base transaction fee across the Plasma Testnet by 10% to encourage more activity and make the network more accessible for micro-transactions.',
    upvotes: 8745,
    downvotes: 1243,
    proposer: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
  },
  {
    id: 3,
    formattedId: 'PIP-003',
    title: 'Implement Advanced Staking Rewards Program',
    description: 'Introduce a new multi-tiered staking rewards program that. This provides higher APY for long-term stakers, securing the network and rewarding loyal token holders.',
    upvotes: 21887,
    downvotes: 450,
    proposer: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
  },
];
