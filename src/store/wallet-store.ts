// Zustand store for wallet connection state management
// Handles mock wallet connection state for Core, MetaMask, and Avalanche Card

import { create } from 'zustand';

export type WalletType = 'core' | 'metamask' | 'avalanche';

export interface WalletConnection {
  address: string;
  type: WalletType;
  connectedAt: Date;
}

interface WalletState {
  connection: WalletConnection | null;
  isConnecting: boolean;
  error: string | null;
  isConnected: boolean;

  // Actions
  connectWallet: (type: WalletType) => Promise<boolean>;
  disconnectWallet: () => void;
  clearError: () => void;
  initializeWallet: () => void;
}

// Mock wallet address generation
function generateMockWalletAddress(type: WalletType): string {
  const prefixes = {
    'core': '0x',
    'metamask': '0x',
    'avalanche': '0x'
  };

  // Generate random hex string (40 characters for Ethereum-style addresses)
  const randomHex = Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');

  // Add 'demo' suffix to make it clear it's mock
  return prefixes[type] + randomHex.slice(0, 36) + 'demo';
}

// Storage keys for persistence
const WALLET_STORAGE_KEY = 'eventmetrics_wallet_connection';

export const useWalletStore = create<WalletState>((set, get) => ({
  connection: null,
  isConnecting: false,
  error: null,
  isConnected: false,

  connectWallet: async (type: WalletType) => {
    set({ isConnecting: true, error: null });

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate mock address
      const address = generateMockWalletAddress(type);

      const connection: WalletConnection = {
        address,
        type,
        connectedAt: new Date()
      };

      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(connection));
      }

      set({
        connection,
        isConnected: true,
        isConnecting: false,
        error: null
      });

      return true;
    } catch (error) {
      set({
        error: 'Failed to connect wallet. Please try again.',
        isConnecting: false
      });
      return false;
    }
  },

  disconnectWallet: () => {
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WALLET_STORAGE_KEY);
    }

    set({
      connection: null,
      isConnected: false,
      error: null
    });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeWallet: () => {
    // Check if wallet is already connected on app start
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY);
      if (stored) {
        try {
          const connection = JSON.parse(stored);
          // Convert date string back to Date object
          connection.connectedAt = new Date(connection.connectedAt);

          set({
            connection,
            isConnected: true
          });
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem(WALLET_STORAGE_KEY);
        }
      }
    }
  }
}));

// Export types for use in components
export type { WalletState };