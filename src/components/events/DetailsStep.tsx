'use client';

import { EventFormData, LocationType } from '@/store/event-store';

interface DetailsStepProps {
  formData: EventFormData;
  validationErrors: Partial<Record<keyof EventFormData, string>>;
  onUpdate: (data: Partial<EventFormData>) => void;
}

export default function DetailsStep({
  formData,
  validationErrors,
  onUpdate
}: DetailsStepProps) {
  const locationTypes: { value: LocationType; label: string; icon: string; description: string }[] = [
    {
      value: 'in-person',
      label: 'In-Person',
      icon: '📍',
      description: 'Physical location'
    },
    {
      value: 'virtual',
      label: 'Virtual',
      icon: '💻',
      description: 'Online only'
    },
    {
      value: 'hybrid',
      label: 'Hybrid',
      icon: '🌐',
      description: 'Both physical and online'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
        Event Details
      </h2>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
            className="w-full px-4 py-3 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: `1px solid ${validationErrors.startDate ? 'var(--error)' : 'var(--accent-border)'}`,
              outline: 'none'
            }}
          />
          {validationErrors.startDate && (
            <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
              {validationErrors.startDate}
            </p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Start Time *
          </label>
          <input
            type="time"
            id="startTime"
            value={formData.startTime}
            onChange={(e) => onUpdate({ startTime: e.target.value })}
            className="w-full px-4 py-3 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: `1px solid ${validationErrors.startTime ? 'var(--error)' : 'var(--accent-border)'}`,
              outline: 'none'
            }}
          />
          {validationErrors.startTime && (
            <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
              {validationErrors.startTime}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
            className="w-full px-4 py-3 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: `1px solid ${validationErrors.endDate ? 'var(--error)' : 'var(--accent-border)'}`,
              outline: 'none'
            }}
          />
          {validationErrors.endDate && (
            <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
              {validationErrors.endDate}
            </p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            End Time *
          </label>
          <input
            type="time"
            id="endTime"
            value={formData.endTime}
            onChange={(e) => onUpdate({ endTime: e.target.value })}
            className="w-full px-4 py-3 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: `1px solid ${validationErrors.endTime ? 'var(--error)' : 'var(--accent-border)'}`,
              outline: 'none'
            }}
          />
          {validationErrors.endTime && (
            <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
              {validationErrors.endTime}
            </p>
          )}
        </div>
      </div>

      {/* Location Type */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
          Location Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {locationTypes.map((type) => {
            const isSelected = formData.locationType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onUpdate({ locationType: type.value })}
                className="p-4 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? 'var(--accent-primary)' : 'var(--background-secondary)',
                  color: isSelected ? 'white' : 'var(--foreground)',
                  border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--accent-border)'}`
                }}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium mb-1">{type.label}</div>
                <div className="text-xs opacity-80">{type.description}</div>
              </button>
            );
          })}
        </div>
        {validationErrors.locationType && (
          <p className="text-sm mt-2" style={{ color: 'var(--error)' }}>
            {validationErrors.locationType}
          </p>
        )}
      </div>

      {/* Address (conditional) */}
      {(formData.locationType === 'in-person' || formData.locationType === 'hybrid') && (
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Physical Address *
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            placeholder="e.g., Parque Lleras, Medellín, Colombia"
            className="w-full px-4 py-3 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: `1px solid ${validationErrors.address ? 'var(--error)' : 'var(--accent-border)'}`,
              outline: 'none'
            }}
          />
          {validationErrors.address && (
            <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
              {validationErrors.address}
            </p>
          )}
        </div>
      )}

      {/* Virtual Link (conditional) */}
      {(formData.locationType === 'virtual' || formData.locationType === 'hybrid') && (
        <div>
          <label htmlFor="virtualLink" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Virtual Meeting Link *
          </label>
          <input
            type="url"
            id="virtualLink"
            value={formData.virtualLink}
            onChange={(e) => onUpdate({ virtualLink: e.target.value })}
            placeholder="e.g., https://zoom.us/j/123456789"
            className="w-full px-4 py-3 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: `1px solid ${validationErrors.virtualLink ? 'var(--error)' : 'var(--accent-border)'}`,
              outline: 'none'
            }}
          />
          {validationErrors.virtualLink && (
            <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
              {validationErrors.virtualLink}
            </p>
          )}
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-light)' }}>
            Zoom, Google Meet, or any other video conferencing link
          </p>
        </div>
      )}
    </div>
  );
}
