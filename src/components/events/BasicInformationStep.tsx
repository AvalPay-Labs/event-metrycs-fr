'use client';

import { EventFormData } from '@/store/event-store';
import { EVENT_TYPES } from '@/lib/mock-events';

interface BasicInformationStepProps {
  formData: EventFormData;
  validationErrors: Partial<Record<keyof EventFormData, string>>;
  onUpdate: (data: Partial<EventFormData>) => void;
}

export default function BasicInformationStep({
  formData,
  validationErrors,
  onUpdate
}: BasicInformationStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
        Basic Information
      </h2>

      {/* Event Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Event Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g., Avalanche Developer Workshop"
          className="w-full px-4 py-3 rounded-lg transition-colors"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: `1px solid ${validationErrors.name ? 'var(--error)' : 'var(--accent-border)'}`,
            outline: 'none'
          }}
        />
        {validationErrors.name && (
          <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
            {validationErrors.name}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe your event, what attendees will learn, and any important details..."
          rows={5}
          className="w-full px-4 py-3 rounded-lg transition-colors resize-none"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: `1px solid ${validationErrors.description ? 'var(--error)' : 'var(--accent-border)'}`,
            outline: 'none'
          }}
        />
        {validationErrors.description && (
          <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
            {validationErrors.description}
          </p>
        )}
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-light)' }}>
          {formData.description.length} characters
        </p>
      </div>

      {/* Event Type */}
      <div>
        <label htmlFor="eventType" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Event Type *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EVENT_TYPES.map((type) => {
            const isSelected = formData.eventType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onUpdate({ eventType: type.value })}
                className="p-4 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? 'var(--accent-primary)' : 'var(--background-secondary)',
                  color: isSelected ? 'white' : 'var(--foreground)',
                  border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--accent-border)'}`
                }}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium">{type.label}</div>
              </button>
            );
          })}
        </div>
        {validationErrors.eventType && (
          <p className="text-sm mt-2" style={{ color: 'var(--error)' }}>
            {validationErrors.eventType}
          </p>
        )}
      </div>

      <div
        className="p-4 rounded-lg"
        style={{
          background: 'var(--accent-blue)',
          opacity: 0.1,
          border: '1px solid var(--accent-blue)'
        }}
      >
        <p className="text-sm" style={{ color: 'var(--foreground-secondary)', opacity: 1 }}>
          💡 <strong>Tip:</strong> Choose the event type that best matches your activity. This helps attendees find your event.
        </p>
      </div>
    </div>
  );
}
