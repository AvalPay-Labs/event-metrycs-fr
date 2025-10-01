'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useOrganizationDetail } from '@/store/organization-store';

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
      return 'badge badge-warning';
    case 'ongoing':
      return 'badge badge-success';
    case 'completed':
      return 'badge';
    case 'cancelled':
      return 'badge badge-error';
    default:
      return 'badge';
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
        <div className="card-header h-32 rounded-lg animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-header h-64 rounded-lg animate-pulse" />
          <div className="card-header h-64 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--error-light)] border border-[var(--error)] rounded-[var(--radius-lg)] p-[var(--spacing-xl)]">
        <div className="flex items-center space-x-2">
          <span className="text-[var(--error)] text-xl">⚠️</span>
          <div>
            <h3 className="font-medium text-[var(--error)]">Error loading organization</h3>
            <p className="text-[var(--error)] mt-[var(--spacing-xs)]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!detail.organization) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-lg font-medium mb-2 text-[var(--foreground)]">
          Organization not found
        </h3>
        <p className="text-[var(--foreground-secondary)]">
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
      <div className="card">
        <div className="card-header">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">
              {organization.type === 'community' ? '👥' :
               organization.type === 'university' ? '🎓' :
               organization.type === 'startup' ? '🚀' :
               organization.type === 'default' ? '🏠' : '🏢'}
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3 text-[var(--foreground)]">
                {organization.name}
                {organization.isDefault && (
                  <span className="badge badge-primary">
                    Default Organization
                  </span>
                )}
              </h1>
              <p className="capitalize mt-1 text-[var(--foreground-secondary)]">
                {organization.type} Organization
              </p>
            </div>
          </div>

          {userRole && (
            <div className="text-right">
              <span className="text-sm text-[var(--foreground-secondary)]">Your role</span>
              <div className="text-lg font-medium capitalize text-[var(--accent-primary)]">
                {userRole}
              </div>
            </div>
          )}
        </div>

        <p className="mb-6 text-[var(--foreground-light)]">
          {organization.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 card-header rounded-lg border border-[var(--accent-border)]">
            <div className="text-2xl font-bold text-[var(--foreground)]">{organization.memberCount}</div>
            <div className="text-sm text-[var(--foreground-secondary)]">Members</div>
          </div>
          <div className="text-center p-4 card-header rounded-lg border border-[var(--accent-border)]">
            <div className="text-2xl font-bold text-[var(--foreground)]">{organization.eventsCount}</div>
            <div className="text-sm text-[var(--foreground-secondary)]">Events</div>
          </div>
          <div className="text-center p-4 card-header rounded-lg border border-[var(--accent-border)]">
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {organization.isPublic ? 'Public' : 'Private'}
            </div>
            <div className="text-sm text-[var(--foreground-secondary)]">Visibility</div>
          </div>
          <div className="text-center p-4 card-header rounded-lg border border-[var(--accent-border)]">
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {organization.status === 'active' ? '🟢' : '🔴'}
            </div>
            <div className="text-sm text-[var(--foreground-secondary)]">Status</div>
          </div>
        </div>

        {permissions && (
          <div className="border-t border-[var(--accent-border)] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[var(--foreground)]">Your Permissions</h4>
              {permissions.canCreateEvents && (
                <a
                  href="/events/create"
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  style={{
                    background: 'var(--accent-primary)',
                    color: 'white'
                  }}
                >
                  ➕ Create Event
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {permissions.canViewMetrics && (
                <span className="badge badge-success">
                  📊 View Metrics
                </span>
              )}
              {permissions.canCreateEvents && (
                <span className="badge badge-primary">
                  ➕ Create Events
                </span>
              )}
              {permissions.canManageMembers && (
                <span className="badge badge-purple">
                  👤 Manage Members
                </span>
              )}
              {permissions.canViewReports && (
                <span className="badge badge-primary">
                  📈 View Reports
                </span>
              )}
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Members Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
              Team Members ({members.length})
            </h2>
          </div>
          <div className="card-body">

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-[var(--accent-gray-light)]">
                <div className="flex items-center space-x-3">
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-medium text-[var(--foreground)]">{member.name}</div>
                    <div className="text-sm text-[var(--foreground-secondary)]">{member.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    member.role === 'admin' ? 'badge-error' :
                    member.role === 'ambassador' ? 'badge-primary' :
                    member.role === 'staff' ? 'badge-success' :
                    ''
                  }`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                  <div className="text-xs mt-1 text-[var(--foreground-secondary)]">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
              Recent Events ({events.length})
            </h2>
          </div>
          <div className="card-body">

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg p-4 transition-colors border border-[var(--accent-border)] hover:border-[var(--accent-gray)]">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                    <div>
                      <h4 className="font-medium text-[var(--foreground)]">{event.title}</h4>
                      <p className="text-sm capitalize text-[var(--foreground-secondary)]">{event.type}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getEventStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>

                <p className="text-sm mb-3 line-clamp-2 text-[var(--foreground-light)]">
                  {event.description}
                </p>

                <div className="flex items-center justify-between text-sm text-[var(--foreground-secondary)]">
                  <span>👥 {event.attendees} attendees</span>
                  <span>{formatEventDate(event.date)}</span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}