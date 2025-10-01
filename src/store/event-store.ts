import { create } from 'zustand';

export type EventType = 'workshop' | 'meetup' | 'hackathon' | 'conference' | 'webinar' | 'networking';
export type LocationType = 'in-person' | 'virtual' | 'hybrid';
export type PriceType = 'free' | 'paid';
export type EventStatus = 'draft' | 'published' | 'active' | 'finished';

export interface EventFormData {
  // Step 1 - Basic Information
  name: string;
  description: string;
  eventType: EventType | '';
  organizationId: string;

  // Step 2 - Details
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  locationType: LocationType | '';
  address: string;
  virtualLink: string;

  // Step 3 - Configuration
  maxCapacity: number;
  priceType: PriceType;
  priceAmount: number;
  specialRequirements: string;
  tags: string[];
}

export interface Event {
  id: string;
  eventCode: string;
  organizationId: string;
  creatorId: string;
  name: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  locationType: LocationType;
  address?: string;
  virtualLink?: string;
  maxCapacity: number;
  priceType: PriceType;
  priceAmount: number;
  status: EventStatus;
  tags: string[];
  specialRequirements?: string;

  // Mock metrics
  registeredCount: number;
  interestedCount: number;
  viewCount: number;
  shareCount: number;

  createdAt: string;
  updatedAt: string;
}

interface EventStoreState {
  // Form state
  currentStep: number;
  formData: EventFormData;
  validationErrors: Partial<Record<keyof EventFormData, string>>;

  // Events list
  events: Event[];
  currentEvent: Event | null;

  // UI state
  isCreating: boolean;
  showPreview: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  updateFormData: (data: Partial<EventFormData>) => void;
  setValidationErrors: (errors: Partial<Record<keyof EventFormData, string>>) => void;
  clearValidationErrors: () => void;

  resetForm: () => void;

  setShowPreview: (show: boolean) => void;
  setIsCreating: (creating: boolean) => void;

  addEvent: (event: Event) => void;
  setCurrentEvent: (event: Event | null) => void;
  setEvents: (events: Event[]) => void;

  // Auto-save draft to localStorage
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
}

const initialFormData: EventFormData = {
  name: '',
  description: '',
  eventType: '',
  organizationId: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  locationType: '',
  address: '',
  virtualLink: '',
  maxCapacity: 50,
  priceType: 'free',
  priceAmount: 0,
  specialRequirements: '',
  tags: []
};

const DRAFT_KEY = 'eventmetrics_event_draft';

export const useEventStore = create<EventStoreState>((set, get) => ({
  // Initial state
  currentStep: 1,
  formData: initialFormData,
  validationErrors: {},
  events: [],
  currentEvent: null,
  isCreating: false,
  showPreview: false,

  // Step navigation
  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 3) {
      set({ currentStep: currentStep + 1 });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // Form data management
  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
    get().saveDraft();
  },

  setValidationErrors: (errors) => set({ validationErrors: errors }),
  clearValidationErrors: () => set({ validationErrors: {} }),

  resetForm: () => {
    set({
      currentStep: 1,
      formData: initialFormData,
      validationErrors: {},
      showPreview: false
    });
    get().clearDraft();
  },

  // UI state
  setShowPreview: (show) => set({ showPreview: show }),
  setIsCreating: (creating) => set({ isCreating: creating }),

  // Events management
  addEvent: (event) => set((state) => ({
    events: [event, ...state.events]
  })),

  setCurrentEvent: (event) => set({ currentEvent: event }),

  setEvents: (events) => set({ events }),

  // Draft management
  saveDraft: () => {
    const { formData } = get();
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  },

  loadDraft: () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const formData = JSON.parse(draft);
        set({ formData });
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  },

  clearDraft: () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }
}));
