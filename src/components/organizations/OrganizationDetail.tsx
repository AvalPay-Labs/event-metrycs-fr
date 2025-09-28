'use client';

import { useEffect } from 'react';
import { useOrganizationDetail } from '@/store/organization-store';
import { useAuthStore } from '@/store/auth-store';
import type { OrganizationEvent, OrganizationMember } from '@/lib/mock-organizations';

interface OrganizationDetailProps {
  organizationId: number;
}

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days ago`;
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return `In ${diffDays} days`;
  }
};

const getEventStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ongoing':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'workshop':
      return '🛠️';
    case 'hackathon':
      return '💻';
    case 'meetup':
      return '🤝';
    case 'conference':
      return '🎤';
    default:
      return '📅';
  }
};

export default function OrganizationDetail({ organizationId }: OrganizationDetailProps) {
  const { detail, isLoading, loadDetail, getRolePermissions, error } = useOrganizationDetail();

  useEffect(() => {
    loadDetail(organizationId);
  }, [organizationId, loadDetail]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-100 h-32 rounded-lg animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 h-64 rounded-lg animate-pulse" />
          <div className="bg-gray-100 h-64 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <h3 className="font-medium text-red-900">Error loading organization</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!detail.organization) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Organization not found
        </h3>
        <p className="text-gray-500">
          The organization you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
    );
  }

  const { organization, members, events, userRole } = detail;
  const permissions = userRole ? getRolePermissions(userRole) : null;

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">
              {organization.type === 'community' ? '👥' :
               organization.type === 'university' ? '🎓' :
               organization.type === 'startup' ? '🚀' :
               organization.type === 'default' ? '🏠' : '🏢'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                {organization.name}
                {organization.isDefault && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Default Organization
                  </span>
                )}
              </h1>
              <p className="text-gray-500 capitalize mt-1">
                {organization.type} Organization
              </p>
            </div>
          </div>

          {userRole && (
            <div className="text-right">
              <span className="text-sm text-gray-500">Your role</span>
              <div className="text-lg font-medium text-blue-600 capitalize">
                {userRole}
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6">
          {organization.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{organization.memberCount}</div>
            <div className="text-sm text-gray-500">Members</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{organization.eventsCount}</div>
            <div className="text-sm text-gray-500">Events</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {organization.isPublic ? 'Public' : 'Private'}
            </div>
            <div className="text-sm text-gray-500">Visibility</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {organization.status === 'active' ? '🟢' : '🔴'}
            </div>
            <div className="text-sm text-gray-500">Status</div>
          </div>
        </div>

        {permissions && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Your Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {permissions.canViewMetrics && (
                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  📊 View Metrics
                </span>
              )}
              {permissions.canCreateEvents && (
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                  ➕ Create Events
                </span>
              )}
              {permissions.canManageMembers && (
                <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                  👤 Manage Members
                </span>
              )}
              {permissions.canViewReports && (
                <span className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-200">
                  📈 View Reports
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Members Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Team Members ({members.length})
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    member.role === 'admin' ? 'bg-red-100 text-red-800' :
                    member.role === 'ambassador' ? 'bg-blue-100 text-blue-800' :
                    member.role === 'staff' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Events ({events.length})
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500 capitalize">{event.type}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getEventStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>👥 {event.attendees} attendees</span>
                  <span>{formatEventDate(event.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 text-lg">💡</span>
          <div>
            <h4 className="font-medium text-blue-900">Demo Organization Data</h4>
            <p className="text-sm text-blue-700 mt-1">
              This organization and its data are simulated for demonstration purposes.
              In the full platform, you&apos;ll see real team members, actual events, and live metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}