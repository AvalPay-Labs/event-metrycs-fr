'use client';

import { useState } from 'react';
import { EventFormData } from '@/store/event-store';

interface ConfigurationStepProps {
  formData: EventFormData;
  validationErrors: Partial<Record<keyof EventFormData, string>>;
  onUpdate: (data: Partial<EventFormData>) => void;
}

export default function ConfigurationStep({
  formData,
  validationErrors,
  onUpdate
}: ConfigurationStepProps) {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      onUpdate({ tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
        Event Configuration
      </h2>

      {/* Maximum Capacity */}
      <div>
        <label htmlFor="maxCapacity" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Maximum Attendee Capacity *
        </label>
        <input
          type="number"
          id="maxCapacity"
          value={formData.maxCapacity}
          onChange={(e) => onUpdate({ maxCapacity: parseInt(e.target.value) || 0 })}
          min="1"
          className="w-full px-4 py-3 rounded-lg transition-colors"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: `1px solid ${validationErrors.maxCapacity ? 'var(--error)' : 'var(--accent-border)'}`,
            outline: 'none'
          }}
        />
        {validationErrors.maxCapacity && (
          <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
            {validationErrors.maxCapacity}
          </p>
        )}
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-light)' }}>
          Set to 0 for unlimited capacity
        </p>
      </div>

      {/* Price Type */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
          Event Price
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onUpdate({ priceType: 'free', priceAmount: 0 })}
            className="p-4 rounded-lg text-left transition-all"
            style={{
              background: formData.priceType === 'free' ? 'var(--accent-primary)' : 'var(--background-secondary)',
              color: formData.priceType === 'free' ? 'white' : 'var(--foreground)',
              border: `2px solid ${formData.priceType === 'free' ? 'var(--accent-primary)' : 'var(--accent-border)'}`
            }}
          >
            <div className="text-2xl mb-2">🆓</div>
            <div className="font-medium">Free</div>
            <div className="text-xs opacity-80">No charge to attend</div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ priceType: 'paid' })}
            className="p-4 rounded-lg text-left transition-all"
            style={{
              background: formData.priceType === 'paid' ? 'var(--accent-primary)' : 'var(--background-secondary)',
              color: formData.priceType === 'paid' ? 'white' : 'var(--foreground)',
              border: `2px solid ${formData.priceType === 'paid' ? 'var(--accent-primary)' : 'var(--accent-border)'}`
            }}
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-medium">Paid</div>
            <div className="text-xs opacity-80">Requires payment</div>
          </button>
        </div>
      </div>

      {/* Price Amount (conditional) */}
      {formData.priceType === 'paid' && (
        <div>
          <label htmlFor="priceAmount" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Price Amount (USD)
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              $
            </span>
            <input
              type="number"
              id="priceAmount"
              value={formData.priceAmount}
              onChange={(e) => onUpdate({ priceAmount: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="w-full pl-8 pr-4 py-3 rounded-lg transition-colors"
              style={{
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--accent-border)',
                outline: 'none'
              }}
            />
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-light)' }}>
            🎭 Mock pricing - no actual payment processing in demo
          </p>
        </div>
      )}

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Tags / Categories
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., blockchain, crypto, web3"
            className="flex-1 px-4 py-3 rounded-lg transition-colors"
            style={{
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--accent-border)',
              outline: 'none'
            }}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              background: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            Add
          </button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                style={{
                  background: 'var(--accent-primary)',
                  color: 'white'
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:opacity-80 transition-opacity"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-sm mt-2" style={{ color: 'var(--foreground-light)' }}>
          Add tags to help attendees discover your event
        </p>
      </div>

      {/* Special Requirements */}
      <div>
        <label htmlFor="specialRequirements" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Special Requirements (Optional)
        </label>
        <textarea
          id="specialRequirements"
          value={formData.specialRequirements}
          onChange={(e) => onUpdate({ specialRequirements: e.target.value })}
          placeholder="Any special requirements, equipment needed, prerequisites, etc."
          rows={4}
          className="w-full px-4 py-3 rounded-lg transition-colors resize-none"
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--accent-border)',
            outline: 'none'
          }}
        />
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-light)' }}>
          e.g., &quot;Bring your laptop&quot;, &quot;Basic JavaScript knowledge required&quot;
        </p>
      </div>
    </div>
  );
}
