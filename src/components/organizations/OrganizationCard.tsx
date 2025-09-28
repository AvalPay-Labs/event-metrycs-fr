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
      return 'text-red-400 bg-red-900/20 border border-red-800';
    case 'ambassador':
      return 'text-orange-400 bg-orange-900/20 border border-orange-800';
    case 'staff':
      return 'text-green-400 bg-green-900/20 border border-green-800';
    case 'user':
    default:
      return 'text-gray-400 bg-gray-900/20 border border-gray-700';
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
      className={`rounded-lg border border-gray-800 p-6 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer hover:border-gray-700' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getOrgTypeIcon(organization.type)}
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              {organization.name}
              {organization.isDefault && (
                <span className="text-xs bg-orange-900/20 text-orange-400 px-2 py-1 rounded-full border border-orange-800">
                  Default
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-400 capitalize">
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

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
        {organization.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            👥 {organization.memberCount} members
          </span>
          <span className="flex items-center gap-1">
            📅 {organization.eventsCount} events
          </span>
        </div>

        {organization.role && 'status' in organization && (organization as { status?: string }).status === 'pending' && (
          <span className="text-xs bg-yellow-900/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-800">
            Pending
          </span>
        )}
      </div>

      {permissions && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-400 mb-2">Your permissions:</div>
          <div className="flex flex-wrap gap-1">
            {permissions.canViewMetrics && (
              <span className="text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-800">
                📊 View Metrics
              </span>
            )}
            {permissions.canCreateEvents && (
              <span className="text-xs bg-orange-900/20 text-orange-400 px-2 py-1 rounded border border-orange-800">
                ➕ Create Events
              </span>
            )}
            {permissions.canManageMembers && (
              <span className="text-xs bg-purple-900/20 text-purple-400 px-2 py-1 rounded border border-purple-800">
                👤 Manage Members
              </span>
            )}
            {permissions.canViewReports && (
              <span className="text-xs bg-orange-900/20 text-orange-400 px-2 py-1 rounded border border-orange-800">
                📈 View Reports
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>🟢 DEMO DATA - EventMetrics Platform</span>
          <span>
            {organization.isPublic ? '🌐 Public' : '🔒 Private'}
          </span>
        </div>
      </div>
    </div>
  );
}