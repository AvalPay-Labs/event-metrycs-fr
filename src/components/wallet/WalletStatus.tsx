'use client';

import { useWalletStore } from '@/store/wallet-store';

interface WalletStatusProps {
  showFullAddress?: boolean;
  showConnectionTime?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function WalletStatus({
  showFullAddress = false,
  showConnectionTime = false,
  className = '',
  style
}: WalletStatusProps) {
  const { isConnected, connection } = useWalletStore();

  if (!isConnected || !connection) {
    return (
      <div className={`wallet-status disconnected ${className}`} style={style}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'var(--accent-light-gray)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--foreground-light)'
        }}>
          <span style={{ color: 'var(--accent-red)' }}>●</span>
          Wallet not connected
        </div>
      </div>
    );
  }

  const getWalletDisplayName = () => {
    const names = {
      'core': 'Core Wallet',
      'metamask': 'MetaMask',
      'avalanche': 'Avalanche Card'
    };
    return names[connection.type] || 'Unknown Wallet';
  };

  const getWalletIcon = () => {
    const icons = {
      'core': '🔷',
      'metamask': '🦊',
      'avalanche': '🏔️'
    };
    return icons[connection.type] || '🔷';
  };

  const formatAddress = (address: string, full: boolean = false) => {
    if (!address) return '';
    if (full) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatConnectionTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleCopyAddress = async () => {
    if (connection?.address) {
      try {
        await navigator.clipboard.writeText(connection.address);
        // Could add a toast notification here
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: 'var(--background)',
    border: '1px solid var(--accent-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    ...style
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const statusIndicatorStyles: React.CSSProperties = {
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--accent-green)',
    borderRadius: '50%'
  };

  const walletTypeStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '500',
    color: 'var(--foreground)'
  };

  const addressStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    color: 'var(--foreground-light)',
    backgroundColor: 'var(--accent-light-gray)',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)'
  };

  const copyButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--accent-blue)',
    fontSize: '0.75rem',
    padding: '0.125rem',
    borderRadius: 'var(--radius-sm)'
  };

  const demoTagStyles: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: 'var(--accent-orange)',
    color: 'white',
    fontSize: '0.625rem',
    fontWeight: '600',
    padding: '0.125rem 0.25rem',
    borderRadius: 'var(--radius-sm)',
    marginLeft: 'auto'
  };

  const timeStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: 'var(--foreground-light)'
  };

  return (
    <div className={`wallet-status connected ${className}`} style={containerStyles}>
      <div style={headerStyles}>
        <div style={statusIndicatorStyles} />
        <div style={walletTypeStyles}>
          <span>{getWalletIcon()}</span>
          {getWalletDisplayName()}
        </div>
        <div style={demoTagStyles}>DEMO</div>
      </div>

      <div style={addressStyles}>
        <span>{formatAddress(connection.address, showFullAddress)}</span>
        <button
          onClick={handleCopyAddress}
          style={copyButtonStyles}
          title="Copy full address"
        >
          📋
        </button>
      </div>

      {showConnectionTime && (
        <div style={timeStyles}>
          Connected: {formatConnectionTime(connection.connectedAt)}
        </div>
      )}
    </div>
  );
}