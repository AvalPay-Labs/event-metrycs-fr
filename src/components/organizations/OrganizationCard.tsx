'use client';

import { Organization, UserOrganization } from '@/lib/mock-organizations';
import { useOrganizationStore } from '@/store/organization-store';

interface OrganizationCardProps {
  organization: Organization & Partial<UserOrganization>;
  onClick?: () => void;
  showRole?: boolean;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'text-[var(--error)] bg-[var(--error-light)] border-[var(--error)]';
    case 'ambassador':
      return 'text-[var(--accent-primary)] bg-[var(--accent-primary-light)] border-[var(--accent-primary)]';
    case 'staff':
      return 'text-[var(--success)] bg-[var(--success-light)] border-[var(--success)]';
    case 'user':
    default:
      return 'text-[var(--foreground-secondary)] bg-[var(--background-secondary)] border-[var(--accent-border)]';
  }
};

const getOrgTypeIcon = (type: string) => {
  switch (type) {
    case 'default':
      return '🏠';
    case 'community':
      return '👥';
    case 'company':
      return '🏢';
    case 'university':
      return '🎓';
    case 'startup':
      return '🚀';
    default:
      return '🏛️';
  }
};

export default function OrganizationCard({
  organization,
  onClick,
  showRole = true
}: OrganizationCardProps) {
  const getRolePermissions = useOrganizationStore(state => state.getRolePermissions);

  const permissions = organization.role ? getRolePermissions(organization.role) : null;

  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--accent-border)] p-[var(--spacing-xl)] hover:shadow-[var(--shadow-md)] transition-shadow ${
        onClick ? 'cursor-pointer hover:border-[var(--foreground-light)]' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getOrgTypeIcon(organization.type)}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
              {organization.name}
              {organization.isDefault && (
                <span className="text-xs bg-[var(--accent-primary-light)] text-[var(--accent-primary)] px-2 py-1 rounded-full border border-[var(--accent-primary)]">
                  Default
                </span>
              )}
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] capitalize">
              {organization.type} Organization
            </p>
          </div>
        </div>

        {showRole && organization.role && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getRoleBadgeColor(organization.role)}`}>
            {organization.role.charAt(0).toUpperCase() + organization.role.slice(1)}
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--foreground-light)] mb-4 line-clamp-2">
        {organization.description}
      </p>

      <div className="flex items-center justify-between text-sm text-[var(--foreground-secondary)]">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            👥 {organization.memberCount} members
          </span>
          <span className="flex items-center gap-1">
            📅 {organization.eventsCount} events
          </span>
        </div>

        {organization.role && 'status' in organization && (organization as { status?: string }).status === 'pending' && (
          <span className="text-xs bg-[var(--warning-light)] text-[var(--warning)] px-2 py-1 rounded-full border border-[var(--warning)]">
            Pending
          </span>
        )}
      </div>

      {permissions && (
        <div className="mt-4 pt-4 border-t border-[var(--accent-border)]">
          <div className="text-xs text-[var(--foreground-secondary)] mb-2">Your permissions:</div>
          <div className="flex flex-wrap gap-1">
            {permissions.canViewMetrics && (
              <span className="text-xs bg-[var(--success-light)] text-[var(--success)] px-2 py-1 rounded border border-[var(--success)]">
                📊 View Metrics
              </span>
            )}
            {permissions.canCreateEvents && (
              <span className="text-xs bg-[var(--accent-primary-light)] text-[var(--accent-primary)] px-2 py-1 rounded border border-[var(--accent-primary)]">
                ➕ Create Events
              </span>
            )}
            {permissions.canManageMembers && (
              <span className="text-xs bg-[var(--accent-blue-light)] text-[var(--accent-blue)] px-2 py-1 rounded border border-[var(--accent-blue)]">
                👤 Manage Members
              </span>
            )}
            {permissions.canViewReports && (
              <span className="text-xs bg-[var(--accent-primary-light)] text-[var(--accent-primary)] px-2 py-1 rounded border border-[var(--accent-primary)]">
                📈 View Reports
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-[var(--accent-border)]">
        <div className="text-xs text-[var(--foreground-light)] flex items-center justify-between">
          <span>🟢 DEMO DATA - EventMetrics Platform</span>
          <span>
            {organization.isPublic ? '🌐 Public' : '🔒 Private'}
          </span>
        </div>
      </div>
    </div>
  );
}