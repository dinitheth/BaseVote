'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ethers } from 'ethers';

type WalletContextType = {
  account: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  switchNetwork: (chainId: string) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const getChainId = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        return `0x${network.chainId.toString(16)}`;
      }
      return null;
  };

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const currentChainId = await getChainId();
        setChainId(currentChainId);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum-compatible wallet.');
    }
  }, []);

  const switchNetwork = async (newChainId: string) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: newChainId }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x2105',
                  chainName: 'Base Mainnet',
                  rpcUrls: ['https://mainnet.base.org'],
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://basescan.org'],
                },
              ],
            });
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        }
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAccount(address);
            const currentChainId = await getChainId();
            setChainId(currentChainId);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };
    
    checkWalletConnection();

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            setAccount(null);
        } else {
            setAccount(accounts[0]);
        }
    };
    
    const handleChainChanged = () => {
        // Reload the page to ensure all components re-fetch data with the new chain
        window.location.reload();
    };

    if (typeof window.ethereum?.on === 'function') {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
        if (typeof window.ethereum?.removeListener === 'function') {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ account, chainId, connectWallet, switchNetwork }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
