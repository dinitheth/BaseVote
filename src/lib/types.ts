export type Proposal = {
  id: number;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
  proposer: string;
};

export type Stats = {
    totalTxs: number;
    totalBlocks: number;
    avgGasPrice: string;
    totalGasUsed: number;
};
