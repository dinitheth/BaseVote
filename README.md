# BaseVote

BaseVote is a decentralized voting application (dApp) built on the Base Mainnet. It empowers communities to participate in governance by creating, viewing, and voting on proposals in a transparent and on-chain manner.

## Features

- **Wallet Integration:** Seamlessly connect with Ethereum-compatible wallets (like MetaMask) to interact with the application.
- **View Proposals:** Browse a real-time list of all active proposals submitted to the governance contract.
- **Create Proposals:** Users can submit their own proposals for community consideration directly to the blockchain.
- **On-Chain Voting:** Cast secure "Yes" or "No" votes on proposals, with every vote recorded transparently on the Base Mainnet.
- **AI Sentiment Analysis:** Get an AI-powered analysis of social media sentiment for each proposal to help inform your vote.
- **Responsive UI:** A modern, clean, and responsive user interface built for a great experience on any device.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **Blockchain Interaction:** Ethers.js
- **Smart Contract:** Solidity

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- An Ethereum-compatible wallet browser extension (e.g., MetaMask) configured for the Base Mainnet.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd <repo-folder>
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

4.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How to Use

1.  **Connect Your Wallet:** Click the "Connect Wallet" button to link your wallet to the application. The app will prompt you to switch to the Base Mainnet if you're on a different network.
2.  **Browse Proposals:** Navigate to the "Main" page to see all current proposals. You can expand each proposal to view its full description.
3.  **Vote:** Cast your vote by clicking the "Yes" or "No" buttons on any proposal. You will be prompted to confirm the transaction in your wallet.
4.  **Create a Proposal:** Go to the "Create" page, fill out the title and description, and submit it to the blockchain. You will need to confirm this transaction in your wallet as well.
