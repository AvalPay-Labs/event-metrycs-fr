// Mock event generation and management utilities
import { Event, EventType, LocationType } from '@/store/event-store';

const STORAGE_KEYS = {
  EVENTS: 'eventmetrics_events'
} as const;

// Event type metadata
export const EVENT_TYPES = [
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'meetup', label: 'Meetup', icon: '🤝' },
  { value: 'hackathon', label: 'Hackathon', icon: '💻' },
  { value: 'conference', label: 'Conference', icon: '🎤' },
  { value: 'webinar', label: 'Webinar', icon: '📹' },
  { value: 'networking', label: 'Networking', icon: '🌐' }
] as const;

// Organization prefix mapping for event codes
const ORG_PREFIXES: Record<string, string> = {
  'org_team1': 'TM1',
  'org_avax_col': 'AVC',
  'org_cryptostartup': 'CSI',
  'org_blockchain_uni': 'BUN',
  'org_defi_corp': 'DFC',
  'org_web3_innovators': 'W3H'
};

/**
 * Generate a unique event code
 * Format: {ORG_PREFIX}{YEAR}-{NUMBER}
 * Example: AVC2025-001
 */
export function generateEventCode(organizationId: string): string {
  const year = new Date().getFullYear();
  const prefix = ORG_PREFIXES[organizationId] || 'EVT';
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  return `${prefix}${year}-${randomNumber.toString().padStart(3, '0')}`;
}

/**
 * Generate initial mock metrics for a new event
 */
export function generateMockMetrics() {
  return {
    registeredCount: 0,
    interestedCount: Math.floor(Math.random() * 16) + 5, // 5-20
    viewCount: Math.floor(Math.random() * 41) + 10, // 10-50
    shareCount: 0
  };
}

/**
 * Create a new event with mock data
 */
export function createMockEvent(
  formData: {
    name: string;
    description: string;
    eventType: EventType;
    organizationId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    locationType: LocationType;
    address?: string;
    virtualLink?: string;
    maxCapacity: number;
    priceType: 'free' | 'paid';
    priceAmount: number;
    specialRequirements?: string;
    tags: string[];
  },
  creatorId: string
): Event {
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const eventCode = generateEventCode(formData.organizationId);
  const mockMetrics = generateMockMetrics();

  // Combine date and time
  const startDateTime = `${formData.startDate}T${formData.startTime}`;
  const endDateTime = `${formData.endDate}T${formData.endTime}`;

  return {
    id: eventId,
    eventCode,
    organizationId: formData.organizationId,
    creatorId,
    name: formData.name,
    description: formData.description,
    eventType: formData.eventType,
    startDate: startDateTime,
    endDate: endDateTime,
    locationType: formData.locationType,
    address: formData.address,
    virtualLink: formData.virtualLink,
    maxCapacity: formData.maxCapacity,
    priceType: formData.priceType,
    priceAmount: formData.priceAmount,
    status: 'draft',
    tags: formData.tags,
    specialRequirements: formData.specialRequirements,
    ...mockMetrics,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Save events to localStorage
 */
export function saveEventsToStorage(events: Event[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events to storage:', error);
  }
}

/**
 * Load events from localStorage
 */
export function loadEventsFromStorage(): Event[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load events from storage:', error);
  }
  return [];
}

/**
 * Get events for a specific organization
 */
export function getEventsByOrganization(organizationId: string): Event[] {
  const allEvents = loadEventsFromStorage();
  return allEvents.filter(event => event.organizationId === organizationId);
}

/**
 * Check if event name is unique within organization
 */
export function isEventNameUnique(name: string, organizationId: string): boolean {
  const orgEvents = getEventsByOrganization(organizationId);
  return !orgEvents.some(event =>
    event.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Predefined sample events for demonstration
 */
export const SAMPLE_EVENTS = [
  {
    name: "Avalanche Developer Workshop",
    eventType: "workshop" as EventType,
    description: "Hands-on workshop for developers building on Avalanche. Learn about subnets, smart contracts, and dApp development.",
    locationType: "in-person" as LocationType,
    address: "Parque Lleras, Medellín, Colombia",
    maxCapacity: 50,
    registeredCount: 45,
    interestedCount: 78,
    viewCount: 234,
    shareCount: 12
  },
  {
    name: "Blockchain Meetup Medellín",
    eventType: "meetup" as EventType,
    description: "Monthly blockchain meetup for enthusiasts and professionals. Network, learn, and share experiences.",
    locationType: "hybrid" as LocationType,
    address: "Ruta N, Medellín, Colombia",
    virtualLink: "https://meet.google.com/abc-defg-hij",
    maxCapacity: 150,
    registeredCount: 120,
    interestedCount: 203,
    viewCount: 567,
    shareCount: 34
  },
  {
    name: "Web3 Hackathon 2025",
    eventType: "hackathon" as EventType,
    description: "48-hour hackathon focused on building innovative Web3 solutions. Prizes and mentorship included.",
    locationType: "in-person" as LocationType,
    address: "Universidad EAFIT, Medellín, Colombia",
    maxCapacity: 100,
    registeredCount: 87,
    interestedCount: 156,
    viewCount: 892,
    shareCount: 67
  },
  {
    name: "DeFi Conference Colombia",
    eventType: "conference" as EventType,
    description: "Two-day conference exploring the future of decentralized finance in Latin America.",
    locationType: "in-person" as LocationType,
    address: "Plaza Mayor, Medellín, Colombia",
    maxCapacity: 500,
    registeredCount: 423,
    interestedCount: 678,
    viewCount: 1456,
    shareCount: 123
  },
  {
    name: "Smart Contracts 101 Webinar",
    eventType: "webinar" as EventType,
    description: "Introduction to smart contract development. Perfect for beginners.",
    locationType: "virtual" as LocationType,
    virtualLink: "https://zoom.us/j/123456789",
    maxCapacity: 200,
    registeredCount: 178,
    interestedCount: 245,
    viewCount: 456,
    shareCount: 23
  }
];

/**
 * Initialize sample events for an organization (one-time setup)
 */
export function initializeSampleEvents(organizationId: string, creatorId: string): Event[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const sampleEvents: Event[] = SAMPLE_EVENTS.slice(0, 3).map((sample, index) => {
    const startDate = index === 0 ? tomorrow : (index === 1 ? nextWeek : nextMonth);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 3);

    return {
      id: `evt_sample_${index}_${Date.now()}`,
      eventCode: generateEventCode(organizationId),
      organizationId,
      creatorId,
      name: sample.name,
      description: sample.description,
      eventType: sample.eventType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      locationType: sample.locationType,
      address: sample.address,
      virtualLink: sample.virtualLink,
      maxCapacity: sample.maxCapacity,
      priceType: 'free' as const,
      priceAmount: 0,
      status: 'published' as const,
      tags: ['blockchain', 'crypto', 'web3'],
      registeredCount: sample.registeredCount,
      interestedCount: sample.interestedCount,
      viewCount: sample.viewCount,
      shareCount: sample.shareCount,
      createdAt: new Date(now.getTime() - (30 - index * 10) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  return sampleEvents;
}

/**
 * Generate realistic event metrics based on event type and time from now
 */
export function generateEventMetrics(
  eventType: EventType,
  daysFromNow: number,
  capacity: number
): { interested: number; registered: number; views: number; shares: number } {
  const baseMetrics = {
    workshop: { interestRate: 0.4, conversionRate: 0.7 },
    meetup: { interestRate: 0.6, conversionRate: 0.8 },
    hackathon: { interestRate: 0.8, conversionRate: 0.6 },
    conference: { interestRate: 0.9, conversionRate: 0.5 },
    webinar: { interestRate: 0.5, conversionRate: 0.9 },
    networking: { interestRate: 0.7, conversionRate: 0.75 }
  };

  const metrics = baseMetrics[eventType] || baseMetrics.workshop;

  // Adjust based on days from now (upcoming events have more interest)
  const timeMultiplier = daysFromNow > 0 && daysFromNow < 30 ? 1.2 : 1.0;

  const interested = Math.floor(capacity * metrics.interestRate * timeMultiplier * (1 + Math.random() * 0.5));
  const registered = Math.floor(interested * metrics.conversionRate);

  return {
    interested,
    registered: Math.min(registered, capacity),
    views: interested * 2 + Math.floor(Math.random() * 100),
    shares: Math.floor(registered * 0.1)
  };
}

/**
 * Calculate dashboard metrics from events list
 */
export function calculateDashboardMetrics(events: Event[]) {
  const now = new Date();

  const activeEvents = events.filter(e => {
    const startDate = new Date(e.startDate);
    const endDate = new Date(e.endDate);
    return startDate <= now && endDate >= now;
  });

  const upcomingEvents = events
    .filter(e => new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const totalAttendees = events.reduce((sum, e) => sum + e.registeredCount, 0);

  return {
    totalEvents: events.length,
    activeEvents: activeEvents.length,
    totalAttendees,
    nextEvent: upcomingEvents[0] || null
  };
}

/**
 * Generate chart data for events by month (last 6 months)
 */
export function generateChartData(events: Event[]) {
  const now = new Date();
  const months: { month: string; monthDate: Date; events: number }[] = [];

  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      monthDate: date,
      events: 0
    });
  }

  // Count events per month
  events.forEach(event => {
    const eventDate = new Date(event.createdAt);
    const monthIndex = months.findIndex(m => {
      const nextMonth = new Date(m.monthDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return eventDate >= m.monthDate && eventDate < nextMonth;
    });

    if (monthIndex >= 0) {
      months[monthIndex].events++;
    }
  });

  return months.map(({ month, events }) => ({ month, events }));
}
