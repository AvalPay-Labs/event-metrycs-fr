'use client';

// User dashboard component showing mock data
// Displays user info, organization membership, and next steps

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useWalletStore } from '@/store/wallet-store';
import { MockAuthService } from '@/lib/mock-auth';
import { UserOrganization } from '@/lib/mock-data';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Timeline from '@/components/ui/Timeline';
import Button from '@/components/ui/Button';
import { WalletButton, WalletStatus } from '@/components/wallet';
import { OrganizationList } from '@/components/organizations';

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const { initializeWallet, isConnected } = useWalletStore();
  const [userOrganizations] = useState<UserOrganization[]>([]);

  useEffect(() => {
    if (user) {
      MockAuthService.getUserOrgMemberships(user.id);
    }
  }, [user]);

  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  if (!user) return null;

  // const handleLogout = () => {
  //   logout();
  // };

  const handleShare = () => {
    // Mock share functionality
    console.log('Compartir dashboard');
  };

  const timelineItems = [
    {
      id: '1',
      content: 'Cuenta creada exitosamente',
      timestamp: 'Hace 2 horas',
      icon: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'var(--success)',
          fontSize: '0.75rem'
        }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span style={{ marginLeft: '0.5rem' }}>Verificado</span>
        </div>
      )
    },
    {
      id: '2',
      content: 'Email de bienvenida enviado (simulado)',
      timestamp: 'Hace 2 horas',
      icon: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'var(--success)',
          fontSize: '0.75rem'
        }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span style={{ marginLeft: '0.5rem' }}>Enviado</span>
        </div>
      )
    },
    {
      id: '3',
      content: 'Asignado a organización "Team 1"',
      timestamp: 'Hace 2 horas',
      icon: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'var(--success)',
          fontSize: '0.75rem'
        }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span style={{ marginLeft: '0.5rem' }}>Asignado</span>
        </div>
      )
    }
  ];

  return (
    <MainLayout
      title="Week Kickoff"
      subtitle="Dashboard de EventMetrics"
      updatedAt="hace 49 minutos"
      userAvatars={['EM', 'JS', 'AB']}
      onShare={handleShare}
    >
      <div>
        {/* Welcome Section */}
        <Card style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--foreground)',
            marginBottom: '1rem'
          }}>
            ¡Bienvenido a EventMetrics! 🎉
          </h2>
          <p style={{ 
            color: 'var(--foreground-light)', 
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Tu registro ha sido exitoso. Has sido asignado automáticamente a la organización <strong>Team 1</strong> con rol de <strong>Usuario</strong>.
          </p>
          
          <Timeline items={timelineItems} />
        </Card>

        {/* Actions Section */}
        <Card title="Acciones">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'var(--accent-blue)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}>1</span>
                </div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--foreground)' }}>
                  Conectar Wallet
                </h4>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--foreground-light)', 
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>
                Conecta tu wallet (Core, MetaMask, o Avalanche Card) para participar en eventos blockchain.
              </p>
              <WalletButton size="sm" />
            </div>

            <div style={{
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'var(--success)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}>2</span>
                </div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--foreground)' }}>
                  Explorar Eventos
                </h4>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--foreground-light)', 
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>
                Descubre eventos blockchain disponibles en tu organización.
              </p>
              <Button variant="ghost" size="sm">
                Ver Eventos →
              </Button>
            </div>

            <div style={{
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: '#8b5cf6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}>3</span>
                </div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--foreground)' }}>
                  Ver Métricas
                </h4>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--foreground-light)', 
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>
                Accede a dashboards de métricas on-chain y off-chain.
              </p>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/profile'}>
                Ver Perfil →
              </Button>
            </div>
          </div>
        </Card>

        {/* Wallet Status Section */}
        {isConnected && (
          <Card title="Estado de Wallet" style={{ marginTop: '1.5rem' }}>
            <WalletStatus showFullAddress={true} showConnectionTime={true} />
          </Card>
        )}

        {/* Organizations Section */}
        <div style={{ marginTop: '2rem' }}>
          <OrganizationList />
        </div>

        {/* User Profile Card */}
        <Card title="Perfil de Usuario" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                Nombre Completo
              </dt>
              <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div>
              <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                Email
              </dt>
              <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                {user.email}
              </dd>
            </div>
            <div>
              <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                Proveedor de Autenticación
              </dt>
              <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)', textTransform: 'capitalize' }}>
                {user.provider}
              </dd>
            </div>
            <div>
              <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                Email Verificado
              </dt>
              <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  background: user.emailVerified ? '#dcfce7' : '#fef2f2',
                  color: user.emailVerified ? '#166534' : '#dc2626'
                }}>
                  {user.emailVerified ? 'Verificado' : 'Pendiente'}
                </span>
              </dd>
            </div>
            <div>
              <dt style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                Fecha de Registro
              </dt>
              <dd style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>
          </div>
        </Card>

      </div>
    </MainLayout>
  );
}