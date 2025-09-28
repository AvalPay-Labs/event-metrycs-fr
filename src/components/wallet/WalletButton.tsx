'use client';

import { useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import Button from '@/components/ui/Button';
import WalletConnectionModal from './WalletConnectionModal';

interface WalletButtonProps {
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
}

export default function WalletButton({ className, style, size = 'md' }: WalletButtonProps) {
  const { isConnected, connection, disconnectWallet } = useWalletStore();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      setShowModal(true);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletIcon = () => {
    if (!connection) return '🔷';

    const icons = {
      'core': '🔷',
      'metamask': '🦊',
      'avalanche': '🏔️'
    };

    return icons[connection.type] || '🔷';
  };

  const buttonStyles: React.CSSProperties = {
    ...style
  };

  return (
    <>
      <Button
        variant={isConnected ? 'secondary' : 'primary'}
        size={size}
        className={className}
        style={buttonStyles}
        onClick={handleClick}
        icon={getWalletIcon()}
      >
        {isConnected && connection
          ? `Connected: ${formatAddress(connection.address)}`
          : 'Connect Wallet'
        }
      </Button>

      <WalletConnectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}