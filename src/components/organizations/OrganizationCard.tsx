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
      return 'bg-red-100 text-red-800 border-red-200';
    case 'ambassador':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'staff':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'user':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
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
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer hover:border-gray-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getOrgTypeIcon(organization.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {organization.name}
              {organization.isDefault && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
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

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {organization.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            👥 {organization.memberCount} members
          </span>
          <span className="flex items-center gap-1">
            📅 {organization.eventsCount} events
          </span>
        </div>

        {organization.role && 'status' in organization && (organization as { status?: string }).status === 'pending' && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Pending
          </span>
        )}
      </div>

      {permissions && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Your permissions:</div>
          <div className="flex flex-wrap gap-1">
            {permissions.canViewMetrics && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                📊 View Metrics
              </span>
            )}
            {permissions.canCreateEvents && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                ➕ Create Events
              </span>
            )}
            {permissions.canManageMembers && (
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                👤 Manage Members
              </span>
            )}
            {permissions.canViewReports && (
              <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                📈 View Reports
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span>🟢 DEMO DATA - EventMetrics Platform</span>
          <span>
            {organization.isPublic ? '🌐 Public' : '🔒 Private'}
          </span>
        </div>
      </div>
    </div>
  );
}