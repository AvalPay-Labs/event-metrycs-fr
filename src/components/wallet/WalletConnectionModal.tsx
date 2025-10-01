'use client';

import { useState } from 'react';
import { useWalletStore, WalletType } from '@/store/wallet-store';
import Button from '@/components/ui/Button';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const walletOptions = [
  {
    type: 'core' as WalletType,
    name: 'Core Wallet',
    description: 'Connect with Core Wallet for Avalanche',
    icon: '🔷'
  },
  {
    type: 'metamask' as WalletType,
    name: 'MetaMask',
    description: 'Popular web3 wallet extension',
    icon: '🦊'
  },
  {
    type: 'avalanche' as WalletType,
    name: 'Avalanche Card',
    description: 'Official Avalanche wallet',
    icon: '🏔️'
  }
];

export default function WalletConnectionModal({ isOpen, onClose }: WalletConnectionModalProps) {
  const { connectWallet, isConnecting, error, clearError } = useWalletStore();
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  if (!isOpen) return null;

  const handleWalletSelect = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    clearError();

    const success = await connectWallet(walletType);
    if (success) {
      onClose();
    }
    setSelectedWallet(null);
  };

  const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem'
  };

  const modalContentStyles: React.CSSProperties = {
    backgroundColor: 'var(--background)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-xl)',
    width: '100%',
    maxWidth: '28rem',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  const headerStyles: React.CSSProperties = {
    padding: '1.5rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const bodyStyles: React.CSSProperties = {
    padding: '1.5rem'
  };

  const walletOptionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'var(--background)'
  };

  const walletOptionHoverStyles: React.CSSProperties = {
    borderColor: 'var(--accent-blue)',
    backgroundColor: 'var(--accent-light-gray)',
    transform: 'translateY(-1px)'
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '2rem',
    marginRight: '1rem'
  };

  const walletInfoStyles: React.CSSProperties = {
    flex: 1
  };

  const walletNameStyles: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--foreground)',
    marginBottom: '0.25rem'
  };

  const walletDescStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--foreground-light)'
  };

  const loadingStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--accent-blue)'
  };

  const demoTagStyles: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: 'var(--accent-orange)',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '1rem'
  };

  const errorStyles: React.CSSProperties = {
    backgroundColor: 'var(--accent-red-light)',
    color: 'var(--accent-red)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  };

  return (
    <div style={modalStyles} onClick={onClose}>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyles}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--foreground)',
            margin: 0
          }}>
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--foreground-light)',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        <div style={bodyStyles}>
          <div style={demoTagStyles}>
            DEMO MODE
          </div>

          <p style={{
            fontSize: '0.875rem',
            color: 'var(--foreground-light)',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            This is a simulation of wallet connection. No real wallet extensions are required.
          </p>

          {error && (
            <div style={errorStyles}>
              {error}
            </div>
          )}

          <div>
            {walletOptions.map((wallet) => (
              <div
                key={wallet.type}
                style={walletOptionStyles}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, walletOptionHoverStyles);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, walletOptionStyles);
                }}
                onClick={() => handleWalletSelect(wallet.type)}
              >
                <div style={iconStyles}>
                  {wallet.icon}
                </div>
                <div style={walletInfoStyles}>
                  <div style={walletNameStyles}>
                    {wallet.name}
                  </div>
                  <div style={walletDescStyles}>
                    {wallet.description}
                  </div>
                </div>
                {isConnecting && selectedWallet === wallet.type && (
                  <div style={loadingStyles}>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid var(--accent-light-gray)',
                      borderTop: '2px solid var(--accent-blue)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Connecting...
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Button
              variant="secondary"
              onClick={onClose}
              style={{ width: '100%' }}
              disabled={isConnecting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}