'use client';

import { useState, useEffect } from 'react';
import { useEventStore } from '@/store/event-store';
import { useOrganizationStore } from '@/store/organization-store';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import BasicInformationStep from './BasicInformationStep';
import DetailsStep from './DetailsStep';
import ConfigurationStep from './ConfigurationStep';
import EventPreview from './EventPreview';

export default function EventCreationWizard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { selectedOrganization } = useOrganizationStore();
  const {
    currentStep,
    formData,
    validationErrors,
    isCreating,
    showPreview,
    nextStep,
    previousStep,
    updateFormData,
    setValidationErrors,
    clearValidationErrors,
    resetForm,
    setShowPreview,
    setIsCreating,
    addEvent,
    loadDraft
  } = useEventStore();

  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  // Load draft on mount
  useEffect(() => {
    if (!hasLoadedDraft) {
      loadDraft();
      setHasLoadedDraft(true);
    }
  }, [hasLoadedDraft, loadDraft]);

  // Set organization ID
  useEffect(() => {
    if (selectedOrganization.organization && !formData.organizationId) {
      updateFormData({ organizationId: selectedOrganization.organization.id.toString() });
    }
  }, [selectedOrganization, formData.organizationId, updateFormData]);

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        errors.name = 'Event name is required';
      }
      if (!formData.description.trim()) {
        errors.description = 'Description is required';
      }
      if (!formData.eventType) {
        errors.eventType = 'Event type is required';
      }
    }

    if (step === 2) {
      if (!formData.startDate) {
        errors.startDate = 'Start date is required';
      }
      if (!formData.startTime) {
        errors.startTime = 'Start time is required';
      }
      if (!formData.endDate) {
        errors.endDate = 'End date is required';
      }
      if (!formData.endTime) {
        errors.endTime = 'End time is required';
      }
      if (!formData.locationType) {
        errors.locationType = 'Location type is required';
      }

      // Date validation
      if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

        if (endDateTime <= startDateTime) {
          errors.endDate = 'End date must be after start date';
        }
      }

      // Conditional validation
      if (formData.locationType === 'in-person' && !formData.address.trim()) {
        errors.address = 'Address is required for in-person events';
      }
      if ((formData.locationType === 'virtual' || formData.locationType === 'hybrid') && !formData.virtualLink.trim()) {
        errors.virtualLink = 'Virtual link is required for virtual/hybrid events';
      }
    }

    if (step === 3) {
      if (formData.maxCapacity <= 0) {
        errors.maxCapacity = 'Maximum capacity must be greater than 0';
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    clearValidationErrors();
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handlePreview = () => {
    if (validateStep(currentStep)) {
      setShowPreview(true);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to create an event');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          creatorId: user.id
        })
      });

      const data = await response.json();

      if (data.success && data.event) {
        addEvent(data.event);
        resetForm();

        // Redirect to event view or organization dashboard
        alert(`Event created successfully! Event Code: ${data.event.eventCode}`);
        router.push(`/organizations/${selectedOrganization.organization?.id}`);
      } else {
        if (data.errors) {
          setValidationErrors(data.errors);
        }
        alert('Failed to create event. Please check the form for errors.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred while creating the event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Your progress will be saved as a draft.')) {
      router.push(`/organizations/${selectedOrganization.organization?.id}`);
    }
  };

  if (showPreview) {
    return (
      <EventPreview
        formData={formData}
        onBack={() => setShowPreview(false)}
        onSubmit={handleSubmit}
        isCreating={isCreating}
      />
    );
  }

  const progress = (currentStep / 3) * 100;

  return (
    <div className="card-body">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
            Step {currentStep} of 3
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
            {progress.toFixed(0)}% Complete
          </span>
        </div>
        <div
          className="h-2 rounded-full"
          style={{ background: 'var(--accent-gray)' }}
        >
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'var(--accent-primary)'
            }}
          />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep >= step
                    ? 'text-white'
                    : ''
                }`}
                style={{
                  background: currentStep >= step ? 'var(--accent-primary)' : 'var(--accent-gray)',
                  color: currentStep >= step ? 'white' : 'var(--foreground-light)'
                }}
              >
                {step}
              </div>
              <span
                className="text-xs mt-2 font-medium"
                style={{
                  color: currentStep >= step ? 'var(--accent-primary)' : 'var(--foreground-light)'
                }}
              >
                {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Configuration'}
              </span>
            </div>
            {step < 3 && (
              <div
                className="h-0.5 flex-1 mx-2"
                style={{
                  background: currentStep > step ? 'var(--accent-primary)' : 'var(--accent-gray)'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form steps */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <BasicInformationStep
            formData={formData}
            validationErrors={validationErrors}
            onUpdate={updateFormData}
          />
        )}
        {currentStep === 2 && (
          <DetailsStep
            formData={formData}
            validationErrors={validationErrors}
            onUpdate={updateFormData}
          />
        )}
        {currentStep === 3 && (
          <ConfigurationStep
            formData={formData}
            validationErrors={validationErrors}
            onUpdate={updateFormData}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--accent-border)' }}>
        <button
          onClick={handleCancel}
          className="px-6 py-2 rounded-lg font-medium transition-colors"
          style={{
            background: 'var(--background-secondary)',
            color: 'var(--foreground)',
            border: '1px solid var(--accent-border)'
          }}
        >
          Cancel
        </button>

        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={previousStep}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: 'var(--background-secondary)',
                color: 'var(--foreground)',
                border: '1px solid var(--accent-border)'
              }}
            >
              Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handlePreview}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              Preview & Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
