// Mock metrics generation and management utilities
import { Event } from '@/store/event-store';

// Metric category types
export type MetricCategory = 'registration' | 'attendance' | 'onchain' | 'social';

// Off-chain metrics interfaces
export interface RegistrationMetrics {
  total: number;
  daily: number[];
  sources: {
    web: number;
    social: number;
    email: number;
    referral: number;
  };
  conversionRate: number;
  geographicDistribution: {
    country: string;
    count: number;
  }[];
}

export interface AttendanceMetrics {
  checkedIn: number;
  averageDuration: number; // minutes
  peakAttendance: number;
  noShowRate: number;
  checkInTimestamps: string[];
  attendancePeaks: {
    timeSlot: string;
    count: number;
  }[];
}

// On-chain metrics interfaces
export interface WalletMetrics {
  newCreated: number;
  reactivated: number;
  totalActive: number;
  addresses: string[];
}

export interface TransactionMetrics {
  total: number;
  averagePerWallet: number;
  totalVolume: number; // AVAX
  gasSpent: number;
  types: {
    transfers: number;
    swaps: number;
    contracts: number;
  };
}

export interface NFTMetrics {
  poaps: number;
  certificates: number;
  collectibles: number;
  totalMinted: number;
  claimRate: number;
}

export interface OnChainMetrics {
  wallets: WalletMetrics;
  transactions: TransactionMetrics;
  nfts: NFTMetrics;
  airdrops: {
    distributed: number;
    claimed: number;
    claimRate: number;
  };
}

// Social metrics interfaces
export interface SocialMetrics {
  mentions: number;
  shares: number;
  hashtagUsage: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  estimatedReach: number;
  topPosts: {
    platform: string;
    engagement: number;
    text: string;
  }[];
}

// Combined metrics interface
export interface EventMetrics {
  eventId: string;
  eventName: string;
  registration: RegistrationMetrics;
  attendance: AttendanceMetrics;
  onchain: OnChainMetrics;
  social: SocialMetrics;
  lastUpdated: string;
  comparisonData?: ComparisonMetrics;
}

// Comparison metrics
export interface ComparisonMetrics {
  similarEvents: {
    eventName: string;
    registrations: number;
    attendance: number;
    onchainActivity: number;
  }[];
  averages: {
    registrations: number;
    attendance: number;
    conversionRate: number;
    socialEngagement: number;
  };
  percentile: number; // Where this event ranks (0-100)
}

// Real-time metrics update
export interface MetricsUpdate {
  category: MetricCategory;
  changes: Record<string, number | string>;
  timestamp: string;
}

/**
 * Generate mock wallet addresses
 */
export function generateMockWalletAddress(): string {
  const prefix = '0x';
  const chars = '0123456789abcdef';
  let address = prefix;
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

/**
 * Calculate days between two dates
 */
function getDaysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate hours until event
 */
function getHoursUntil(eventDate: string | Date, currentTime: string | Date): number {
  const event = new Date(eventDate);
  const now = new Date(currentTime);
  const diffTime = event.getTime() - now.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60));
}

/**
 * Calculate registration curve based on event lifecycle
 */
function calculateRegistrationCurve(
  capacity: number,
  daysSinceCreated: number,
  hoursUntilEvent: number
): { total: number; daily: number[] } {
  const daysUntilEvent = Math.floor(hoursUntilEvent / 24);

  // Registration phases
  const phases = {
    early: 0.1,    // 10% in first phase
    middle: 0.6,   // 60% in middle phase
    late: 0.3      // 30% in final phase
  };

  // Calculate target based on capacity (usually 70-95% of capacity)
  const targetRegistrations = Math.floor(capacity * (0.7 + Math.random() * 0.25));

  let total = 0;
  const daily: number[] = [];

  // If event is in the past, use final numbers
  if (hoursUntilEvent < 0) {
    total = targetRegistrations;
    // Generate historical daily numbers
    for (let i = 0; i < Math.min(daysSinceCreated, 90); i++) {
      const phase = i < 14 ? 'early' : (i < 60 ? 'middle' : 'late');
      const dailyAvg = (targetRegistrations * phases[phase]) / (phase === 'early' ? 14 : (phase === 'middle' ? 46 : 30));
      daily.push(Math.floor(dailyAvg * (0.5 + Math.random())));
    }
  } else {
    // Event is upcoming - calculate current registrations
    const progressRatio = daysSinceCreated / (daysSinceCreated + daysUntilEvent);
    total = Math.floor(targetRegistrations * Math.min(progressRatio * 1.2, 0.95));

    // Generate daily history
    for (let i = 0; i < daysSinceCreated; i++) {
      const dailyAvg = total / daysSinceCreated;
      daily.push(Math.floor(dailyAvg * (0.3 + Math.random() * 1.4)));
    }
  }

  return { total, daily };
}

/**
 * Generate mock geographic distribution
 */
function generateMockGeoData(): { country: string; count: number }[] {
  const countries = [
    { country: 'Colombia', weight: 0.4 },
    { country: 'United States', weight: 0.2 },
    { country: 'Mexico', weight: 0.15 },
    { country: 'Argentina', weight: 0.1 },
    { country: 'Spain', weight: 0.08 },
    { country: 'Other', weight: 0.07 }
  ];

  return countries.map(({ country, weight }) => ({
    country,
    count: Math.floor(weight * 100 * (0.8 + Math.random() * 0.4))
  }));
}

/**
 * Generate mock referral sources
 */
function generateMockReferrals(): { web: number; social: number; email: number; referral: number } {
  const total = 100;
  const web = 0.5 + Math.random() * 0.2; // 50-70%
  const social = 0.15 + Math.random() * 0.15; // 15-30%
  const email = 0.05 + Math.random() * 0.1; // 5-15%
  const referral = 1 - web - social - email; // remainder

  return {
    web: Math.floor(total * web),
    social: Math.floor(total * social),
    email: Math.floor(total * email),
    referral: Math.floor(total * referral)
  };
}

/**
 * Generate off-chain registration metrics
 */
export function generateRegistrationMetrics(
  event: Event,
  currentTime: Date = new Date()
): RegistrationMetrics {
  const daysSinceCreated = getDaysBetween(event.createdAt, currentTime);
  const hoursUntilEvent = getHoursUntil(event.startDate, currentTime);

  const registrationCurve = calculateRegistrationCurve(
    event.maxCapacity,
    daysSinceCreated,
    hoursUntilEvent
  );

  return {
    total: registrationCurve.total,
    daily: registrationCurve.daily,
    sources: generateMockReferrals(),
    conversionRate: 0.75 + Math.random() * 0.2, // 75-95%
    geographicDistribution: generateMockGeoData()
  };
}

/**
 * Generate attendance metrics (only for active/past events)
 */
export function generateAttendanceMetrics(
  event: Event,
  registrationMetrics: RegistrationMetrics,
  currentTime: Date = new Date()
): AttendanceMetrics {
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);
  const now = currentTime;

  // Only generate if event is active or past
  if (now < eventStart) {
    return {
      checkedIn: 0,
      averageDuration: 0,
      peakAttendance: 0,
      noShowRate: 0,
      checkInTimestamps: [],
      attendancePeaks: []
    };
  }

  const checkedIn = Math.floor(registrationMetrics.total * registrationMetrics.conversionRate);
  const noShowRate = 1 - registrationMetrics.conversionRate;

  // Generate check-in timestamps
  const checkInTimestamps: string[] = [];
  const eventDuration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60); // minutes

  for (let i = 0; i < checkedIn; i++) {
    // Most check-ins happen at the start
    const checkInOffset = Math.abs(Math.random() * Math.random() * eventDuration * 0.3);
    const checkInTime = new Date(eventStart.getTime() + checkInOffset * 60 * 1000);
    checkInTimestamps.push(checkInTime.toISOString());
  }

  // Calculate attendance peaks
  const hourlySlots = Math.ceil(eventDuration / 60);
  const attendancePeaks = [];
  for (let i = 0; i < hourlySlots; i++) {
    const hour = new Date(eventStart.getTime() + i * 60 * 60 * 1000);
    const timeSlot = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Peak attendance in middle hours
    const peakFactor = i < hourlySlots / 2 ? 1 : 0.7;
    const count = Math.floor(checkedIn * peakFactor * (0.6 + Math.random() * 0.4));

    attendancePeaks.push({ timeSlot, count });
  }

  const peakAttendance = Math.max(...attendancePeaks.map(p => p.count));

  return {
    checkedIn,
    averageDuration: Math.floor(eventDuration * (0.7 + Math.random() * 0.3)),
    peakAttendance,
    noShowRate,
    checkInTimestamps: checkInTimestamps.sort(),
    attendancePeaks
  };
}

/**
 * Generate on-chain metrics
 */
export function generateOnChainMetrics(
  event: Event,
  attendanceMetrics: AttendanceMetrics
): OnChainMetrics {
  const attendeeCount = attendanceMetrics.checkedIn || event.registeredCount;

  // Wallet metrics
  const newWallets = Math.floor(attendeeCount * (0.15 + Math.random() * 0.1)); // 15-25% new wallets
  const reactivatedWallets = Math.floor(attendeeCount * (0.05 + Math.random() * 0.1)); // 5-15% reactivated
  const totalActive = Math.floor(attendeeCount * (0.7 + Math.random() * 0.2)); // 70-90% active

  // Generate mock wallet addresses
  const addresses: string[] = [];
  for (let i = 0; i < Math.min(totalActive, 50); i++) {
    addresses.push(generateMockWalletAddress());
  }

  // Transaction metrics
  const totalTransactions = Math.floor(attendeeCount * (2 + Math.random() * 3)); // 2-5 tx per person
  const totalVolume = totalTransactions * (0.5 + Math.random() * 2); // 0.5-2.5 AVAX per tx
  const gasSpent = totalTransactions * (0.001 + Math.random() * 0.002); // 0.001-0.003 AVAX gas per tx

  const transactionTypes = {
    transfers: Math.floor(totalTransactions * (0.4 + Math.random() * 0.2)),
    swaps: Math.floor(totalTransactions * (0.3 + Math.random() * 0.2)),
    contracts: Math.floor(totalTransactions * (0.2 + Math.random() * 0.2))
  };

  // NFT metrics
  const poaps = Math.floor(attendeeCount * (0.6 + Math.random() * 0.2)); // 60-80% mint POAPs
  const certificates = Math.floor(attendeeCount * (0.2 + Math.random() * 0.1)); // 20-30% certificates
  const collectibles = Math.floor(attendeeCount * (0.1 + Math.random() * 0.1)); // 10-20% collectibles
  const totalMinted = poaps + certificates + collectibles;

  // Airdrop metrics
  const airdropsClaimed = Math.floor(attendeeCount * (0.7 + Math.random() * 0.2)); // 70-90% claim rate

  return {
    wallets: {
      newCreated: newWallets,
      reactivated: reactivatedWallets,
      totalActive,
      addresses
    },
    transactions: {
      total: totalTransactions,
      averagePerWallet: totalActive > 0 ? totalTransactions / totalActive : 0,
      totalVolume: parseFloat(totalVolume.toFixed(2)),
      gasSpent: parseFloat(gasSpent.toFixed(4)),
      types: transactionTypes
    },
    nfts: {
      poaps,
      certificates,
      collectibles,
      totalMinted,
      claimRate: attendeeCount > 0 ? totalMinted / attendeeCount : 0
    },
    airdrops: {
      distributed: attendeeCount,
      claimed: airdropsClaimed,
      claimRate: attendeeCount > 0 ? airdropsClaimed / attendeeCount : 0
    }
  };
}

/**
 * Generate social media metrics
 */
export function generateSocialMetrics(
  event: Event,
  registrationMetrics: RegistrationMetrics
): SocialMetrics {
  const baseEngagement = registrationMetrics.total * (1.5 + Math.random());

  const mentions = Math.floor(baseEngagement * (0.3 + Math.random() * 0.2));
  const shares = event.shareCount || Math.floor(registrationMetrics.total * 0.15);
  const hashtagUsage = Math.floor(mentions * (0.6 + Math.random() * 0.3));

  // Sentiment distribution
  const positive = 0.6 + Math.random() * 0.2; // 60-80% positive
  const negative = 0.05 + Math.random() * 0.1; // 5-15% negative
  const neutral = 1 - positive - negative;

  const sentiment = {
    positive: Math.floor(mentions * positive),
    neutral: Math.floor(mentions * neutral),
    negative: Math.floor(mentions * negative)
  };

  const estimatedReach = Math.floor(baseEngagement * (10 + Math.random() * 20));

  const platforms = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'];
  const topPosts = platforms.slice(0, 3).map(platform => ({
    platform,
    engagement: Math.floor(100 + Math.random() * 500),
    text: `Great experience at ${event.name}! #blockchain #web3`
  }));

  return {
    mentions,
    shares,
    hashtagUsage,
    sentiment,
    estimatedReach,
    topPosts
  };
}

/**
 * Generate comparison metrics with similar events
 */
export function generateComparisonMetrics(event: Event): ComparisonMetrics {
  const eventTypeMultipliers = {
    workshop: 0.8,
    meetup: 1.0,
    hackathon: 1.5,
    conference: 2.0,
    webinar: 0.9,
    networking: 1.1
  };

  const multiplier = eventTypeMultipliers[event.eventType] || 1.0;

  // Generate 3 similar mock events
  const similarEvents = [
    {
      eventName: `${event.eventType} Alpha`,
      registrations: Math.floor(event.maxCapacity * 0.6 * multiplier),
      attendance: Math.floor(event.maxCapacity * 0.5 * multiplier),
      onchainActivity: Math.floor(150 * multiplier)
    },
    {
      eventName: `${event.eventType} Beta`,
      registrations: Math.floor(event.maxCapacity * 0.8 * multiplier),
      attendance: Math.floor(event.maxCapacity * 0.65 * multiplier),
      onchainActivity: Math.floor(200 * multiplier)
    },
    {
      eventName: `${event.eventType} Gamma`,
      registrations: Math.floor(event.maxCapacity * 0.7 * multiplier),
      attendance: Math.floor(event.maxCapacity * 0.55 * multiplier),
      onchainActivity: Math.floor(175 * multiplier)
    }
  ];

  const averages = {
    registrations: Math.floor(similarEvents.reduce((sum, e) => sum + e.registrations, 0) / similarEvents.length),
    attendance: Math.floor(similarEvents.reduce((sum, e) => sum + e.attendance, 0) / similarEvents.length),
    conversionRate: 0.75,
    socialEngagement: Math.floor(250 * multiplier)
  };

  // Calculate percentile (50-95 range for demo)
  const percentile = Math.floor(50 + Math.random() * 45);

  return {
    similarEvents,
    averages,
    percentile
  };
}

/**
 * Generate complete event metrics
 */
export function generateCompleteMetrics(event: Event, currentTime: Date = new Date()): EventMetrics {
  const registration = generateRegistrationMetrics(event, currentTime);
  const attendance = generateAttendanceMetrics(event, registration, currentTime);
  const onchain = generateOnChainMetrics(event, attendance);
  const social = generateSocialMetrics(event, registration);
  const comparisonData = generateComparisonMetrics(event);

  return {
    eventId: event.id,
    eventName: event.name,
    registration,
    attendance,
    onchain,
    social,
    lastUpdated: currentTime.toISOString(),
    comparisonData
  };
}

/**
 * Simulate real-time metrics update
 */
export function generateMetricsUpdate(
  currentMetrics: EventMetrics,
  category: MetricCategory
): MetricsUpdate {
  const changes: Record<string, number | string> = {};

  switch (category) {
    case 'registration':
      changes.newRegistrations = Math.floor(Math.random() * 5);
      changes.total = currentMetrics.registration.total + (changes.newRegistrations as number);
      break;
    case 'attendance':
      changes.newCheckIns = Math.floor(Math.random() * 3);
      changes.checkedIn = currentMetrics.attendance.checkedIn + (changes.newCheckIns as number);
      break;
    case 'onchain':
      changes.newTransactions = Math.floor(Math.random() * 10);
      changes.total = currentMetrics.onchain.transactions.total + (changes.newTransactions as number);
      break;
    case 'social':
      changes.newMentions = Math.floor(Math.random() * 15);
      changes.mentions = currentMetrics.social.mentions + (changes.newMentions as number);
      break;
  }

  return {
    category,
    changes,
    timestamp: new Date().toISOString()
  };
}

/**
 * Event type patterns for realistic metrics
 */
export const EVENT_TYPE_PATTERNS = {
  workshop: { engagement: 'high', conversion: 0.8, social: 'medium', onchain: 'high' },
  meetup: { engagement: 'medium', conversion: 0.75, social: 'high', onchain: 'medium' },
  hackathon: { engagement: 'very-high', conversion: 0.6, social: 'very-high', onchain: 'very-high' },
  conference: { engagement: 'medium', conversion: 0.5, social: 'high', onchain: 'medium' },
  webinar: { engagement: 'low', conversion: 0.9, social: 'low', onchain: 'low' },
  networking: { engagement: 'medium', conversion: 0.75, social: 'high', onchain: 'medium' }
} as const;
