import { Event } from '@/store/event-store';
import { EventMetrics } from './mock-metrics';

export interface EventReport {
  event: {
    id: string;
    name: string;
    eventCode: string;
    eventType: string;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalRegistrations: number;
    totalAttendance: number;
    conversionRate: number;
    noShowRate: number;
    averageDuration: number;
  };
  highlights: string[];
  lowlights: string[];
  recommendations: string[];
  metrics: {
    registration: {
      total: number;
      sources: Record<string, number>;
      geographic: Array<{ country: string; count: number }>;
    };
    attendance: {
      checkedIn: number;
      peakAttendance: number;
      averageDuration: number;
    };
    onchain: {
      newWallets: number;
      totalTransactions: number;
      totalVolume: number;
      nftsMinted: number;
    };
    social: {
      mentions: number;
      shares: number;
      reach: number;
      sentimentScore: number;
    };
  };
  comparison: {
    percentile: number;
    vsAverage: {
      registrations: string;
      attendance: string;
      engagement: string;
    };
  };
  generatedAt: string;
}

/**
 * Generate highlights based on metrics performance
 */
function generateHighlights(metrics: EventMetrics): string[] {
  const highlights: string[] = [];

  // Registration highlights
  if (metrics.registration.conversionRate > 0.8) {
    highlights.push(
      `Excellent conversion rate of ${(metrics.registration.conversionRate * 100).toFixed(0)}% from registration to attendance`
    );
  }

  if (metrics.registration.total > 100) {
    highlights.push(`Strong turnout with ${metrics.registration.total} total registrations`);
  }

  // Attendance highlights
  if (metrics.attendance.noShowRate < 0.15) {
    highlights.push(
      `Low no-show rate of ${(metrics.attendance.noShowRate * 100).toFixed(0)}%, indicating high attendee commitment`
    );
  }

  if (metrics.attendance.averageDuration > 120) {
    highlights.push(
      `High engagement with average attendance duration of ${Math.floor(metrics.attendance.averageDuration)} minutes`
    );
  }

  // On-chain highlights
  if (metrics.onchain.wallets.newCreated > 10) {
    highlights.push(
      `Successfully onboarded ${metrics.onchain.wallets.newCreated} new users to Web3`
    );
  }

  if (metrics.onchain.transactions.total > 200) {
    highlights.push(
      `High blockchain activity with ${metrics.onchain.transactions.total} total transactions`
    );
  }

  if (metrics.onchain.nfts.totalMinted > 50) {
    highlights.push(`Distributed ${metrics.onchain.nfts.totalMinted} NFTs/POAPs to attendees`);
  }

  // Social highlights
  if (metrics.social.estimatedReach > 5000) {
    highlights.push(
      `Excellent social media reach of ${metrics.social.estimatedReach.toLocaleString()} people`
    );
  }

  const positiveSentiment =
    metrics.social.sentiment.positive /
    (metrics.social.sentiment.positive +
      metrics.social.sentiment.neutral +
      metrics.social.sentiment.negative);

  if (positiveSentiment > 0.7) {
    highlights.push(
      `Overwhelmingly positive social sentiment at ${(positiveSentiment * 100).toFixed(0)}%`
    );
  }

  return highlights.slice(0, 5); // Return top 5 highlights
}

/**
 * Generate lowlights/areas for improvement
 */
function generateLowlights(metrics: EventMetrics): string[] {
  const lowlights: string[] = [];

  // Registration lowlights
  if (metrics.registration.conversionRate < 0.6) {
    lowlights.push(
      `Conversion rate of ${(metrics.registration.conversionRate * 100).toFixed(0)}% could be improved with better follow-up`
    );
  }

  // Attendance lowlights
  if (metrics.attendance.noShowRate > 0.25) {
    lowlights.push(
      `High no-show rate of ${(metrics.attendance.noShowRate * 100).toFixed(0)}% - consider reminder strategies`
    );
  }

  if (metrics.attendance.averageDuration < 60) {
    lowlights.push(
      `Short average duration of ${Math.floor(metrics.attendance.averageDuration)} minutes - review content engagement`
    );
  }

  // On-chain lowlights
  if (metrics.onchain.airdrops.claimRate < 0.5) {
    lowlights.push(
      `Only ${(metrics.onchain.airdrops.claimRate * 100).toFixed(0)}% airdrop claim rate - simplify the claiming process`
    );
  }

  // Social lowlights
  const negativeSentiment =
    metrics.social.sentiment.negative /
    (metrics.social.sentiment.positive +
      metrics.social.sentiment.neutral +
      metrics.social.sentiment.negative);

  if (negativeSentiment > 0.15) {
    lowlights.push(
      `${(negativeSentiment * 100).toFixed(0)}% negative social sentiment - review attendee feedback`
    );
  }

  if (metrics.social.shares < 20) {
    lowlights.push(
      `Low social sharing (${metrics.social.shares} shares) - create more shareable moments`
    );
  }

  return lowlights.slice(0, 5); // Return top 5 areas for improvement
}

/**
 * Generate AI-powered recommendations
 */
function generateRecommendations(event: Event, metrics: EventMetrics): string[] {
  const recommendations: string[] = [];

  // Event type specific recommendations
  if (event.eventType === 'workshop' && metrics.attendance.averageDuration < 90) {
    recommendations.push(
      'Consider adding more hands-on activities to increase workshop engagement time'
    );
  }

  if (event.eventType === 'hackathon' && metrics.onchain.wallets.newCreated < 20) {
    recommendations.push(
      'Promote wallet creation at registration to increase blockchain participation'
    );
  }

  if (event.eventType === 'conference' && metrics.social.mentions < 100) {
    recommendations.push(
      'Create a unique event hashtag and incentivize social sharing during sessions'
    );
  }

  // General recommendations based on metrics
  if (metrics.registration.sources.referral < 10) {
    recommendations.push(
      'Implement a referral program to leverage word-of-mouth marketing'
    );
  }

  if (metrics.onchain.nfts.claimRate < 0.7) {
    recommendations.push(
      'Set up QR codes or NFC tags for easier POAP/NFT claiming at the venue'
    );
  }

  if (metrics.attendance.peakAttendance < metrics.attendance.checkedIn * 0.8) {
    recommendations.push(
      'Schedule key sessions during peak attendance times for maximum impact'
    );
  }

  // Location-based recommendations
  const topCountry = metrics.registration.geographicDistribution[0];
  if (topCountry && topCountry.count > metrics.registration.total * 0.5) {
    recommendations.push(
      `Consider hosting follow-up events in ${topCountry.country} given the strong regional interest`
    );
  }

  // Social recommendations
  if (metrics.social.estimatedReach < 3000) {
    recommendations.push(
      'Partner with influencers or community leaders to expand event visibility'
    );
  }

  return recommendations.slice(0, 6); // Return top 6 recommendations
}

/**
 * Calculate sentiment score (0-100)
 */
function calculateSentimentScore(metrics: EventMetrics): number {
  const { positive, neutral, negative } = metrics.social.sentiment;
  const total = positive + neutral + negative;

  if (total === 0) return 50; // neutral if no data

  const score = ((positive - negative) / total) * 50 + 50;
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Generate complete post-event report
 */
export function generateEventReport(event: Event, metrics: EventMetrics): EventReport {
  const highlights = generateHighlights(metrics);
  const lowlights = generateLowlights(metrics);
  const recommendations = generateRecommendations(event, metrics);
  const sentimentScore = calculateSentimentScore(metrics);

  // Calculate comparison vs average
  const avgRegistrations = metrics.comparisonData?.averages.registrations || 0;
  const avgAttendance = metrics.comparisonData?.averages.attendance || 0;
  const avgSocialEngagement = metrics.comparisonData?.averages.socialEngagement || 0;

  const registrationsDiff =
    avgRegistrations > 0
      ? ((metrics.registration.total - avgRegistrations) / avgRegistrations) * 100
      : 0;
  const attendanceDiff =
    avgAttendance > 0
      ? ((metrics.attendance.checkedIn - avgAttendance) / avgAttendance) * 100
      : 0;
  const engagementDiff =
    avgSocialEngagement > 0
      ? ((metrics.social.mentions + metrics.social.shares - avgSocialEngagement) /
          avgSocialEngagement) *
        100
      : 0;

  return {
    event: {
      id: event.id,
      name: event.name,
      eventCode: event.eventCode,
      eventType: event.eventType,
      startDate: event.startDate,
      endDate: event.endDate
    },
    summary: {
      totalRegistrations: metrics.registration.total,
      totalAttendance: metrics.attendance.checkedIn,
      conversionRate: metrics.registration.conversionRate,
      noShowRate: metrics.attendance.noShowRate,
      averageDuration: metrics.attendance.averageDuration
    },
    highlights,
    lowlights,
    recommendations,
    metrics: {
      registration: {
        total: metrics.registration.total,
        sources: metrics.registration.sources,
        geographic: metrics.registration.geographicDistribution
      },
      attendance: {
        checkedIn: metrics.attendance.checkedIn,
        peakAttendance: metrics.attendance.peakAttendance,
        averageDuration: metrics.attendance.averageDuration
      },
      onchain: {
        newWallets: metrics.onchain.wallets.newCreated,
        totalTransactions: metrics.onchain.transactions.total,
        totalVolume: metrics.onchain.transactions.totalVolume,
        nftsMinted: metrics.onchain.nfts.totalMinted
      },
      social: {
        mentions: metrics.social.mentions,
        shares: metrics.social.shares,
        reach: metrics.social.estimatedReach,
        sentimentScore
      }
    },
    comparison: {
      percentile: metrics.comparisonData?.percentile || 50,
      vsAverage: {
        registrations: `${registrationsDiff > 0 ? '+' : ''}${registrationsDiff.toFixed(0)}%`,
        attendance: `${attendanceDiff > 0 ? '+' : ''}${attendanceDiff.toFixed(0)}%`,
        engagement: `${engagementDiff > 0 ? '+' : ''}${engagementDiff.toFixed(0)}%`
      }
    },
    generatedAt: new Date().toISOString()
  };
}
