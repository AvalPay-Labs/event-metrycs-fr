'use client';

import { EventFormData } from '@/store/event-store';
import { EVENT_TYPES } from '@/lib/mock-events';

interface EventPreviewProps {
  formData: EventFormData;
  onBack: () => void;
  onSubmit: () => void;
  isCreating: boolean;
}

export default function EventPreview({
  formData,
  onBack,
  onSubmit,
  isCreating
}: EventPreviewProps) {
  const eventType = EVENT_TYPES.find(type => type.value === formData.eventType);

  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return 'Not set';
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationDisplay = () => {
    switch (formData.locationType) {
      case 'in-person':
        return `📍 ${formData.address || 'Address not provided'}`;
      case 'virtual':
        return `💻 ${formData.virtualLink || 'Link not provided'}`;
      case 'hybrid':
        return `🌐 In-person: ${formData.address || 'TBD'} | Virtual: ${formData.virtualLink || 'TBD'}`;
      default:
        return 'Location not set';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Preview Your Event
        </h2>
        <p style={{ color: 'var(--foreground-secondary)' }}>
          Review the details before creating your event
        </p>
      </div>

      {/* Event Card Preview */}
      <div
        className="rounded-lg p-6"
        style={{
          background: 'var(--background-secondary)',
          border: '1px solid var(--accent-border)'
        }}
      >
        {/* Event Type Badge */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            {eventType?.icon} {eventType?.label}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
          {formData.name}
        </h3>

        {/* Description */}
        <p className="mb-6" style={{ color: 'var(--foreground-secondary)' }}>
          {formData.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Start Date/Time */}
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--foreground-light)' }}>
              Starts
            </div>
            <div style={{ color: 'var(--foreground)' }}>
              {formatDateTime(formData.startDate, formData.startTime)}
            </div>
          </div>

          {/* End Date/Time */}
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--foreground-light)' }}>
              Ends
            </div>
            <div style={{ color: 'var(--foreground)' }}>
              {formatDateTime(formData.endDate, formData.endTime)}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--foreground-light)' }}>
              Maximum Capacity
            </div>
            <div style={{ color: 'var(--foreground)' }}>
              {formData.maxCapacity === 0 ? 'Unlimited' : `${formData.maxCapacity} attendees`}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--foreground-light)' }}>
              Price
            </div>
            <div style={{ color: 'var(--foreground)' }}>
              {formData.priceType === 'free' ? 'Free' : `$${formData.priceAmount.toFixed(2)} USD`}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground-light)' }}>
            Location
          </div>
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)'
            }}
          >
            {getLocationDisplay()}
          </div>
        </div>

        {/* Tags */}
        {formData.tags.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground-light)' }}>
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: 'var(--accent-blue)',
                    color: 'white'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special Requirements */}
        {formData.specialRequirements && (
          <div>
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground-light)' }}>
              Special Requirements
            </div>
            <div
              className="p-3 rounded-lg"
              style={{
                background: 'var(--background)',
                color: 'var(--foreground-secondary)'
              }}
            >
              {formData.specialRequirements}
            </div>
          </div>
        )}
      </div>

      {/* Demo Notice */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--warning-light)',
          border: '1px solid var(--warning)'
        }}
      >
        <p className="text-sm" style={{ color: 'var(--foreground)' }}>
          🎭 <strong>Demo Mode:</strong> This event will be created with mock data. Initial metrics (interested, views) will be randomly generated.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6" style={{ borderTop: '1px solid var(--accent-border)' }}>
        <button
          onClick={onBack}
          disabled={isCreating}
          className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          style={{
            background: 'var(--background-secondary)',
            color: 'var(--foreground)',
            border: '1px solid var(--accent-border)'
          }}
        >
          ← Back to Edit
        </button>

        <button
          onClick={onSubmit}
          disabled={isCreating}
          className="px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          style={{
            background: 'var(--accent-primary)',
            color: 'white'
          }}
        >
          {isCreating ? (
            <>
              <span className="animate-spin">⏳</span>
              Creating Event...
            </>
          ) : (
            <>
              ✓ Create Event
            </>
          )}
        </button>
      </div>
    </div>
  );
}
