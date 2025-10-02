import { NextRequest, NextResponse } from 'next/server';
import { loadEventsFromStorage } from '@/lib/mock-events';
import { generateCompleteMetrics } from '@/lib/mock-metrics';

// Simulate network latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

/**
 * POST /api/events/[id]/metrics/export
 * Export event metrics in CSV or PDF format
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await simulateDelay();

    const { id: eventId } = await params;
    const body = await request.json();
    const format = body.format || 'csv';

    if (!['csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Invalid export format. Use "csv" or "pdf".' },
        { status: 400 }
      );
    }

    // Load event from storage
    const events = loadEventsFromStorage();
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Generate metrics
    const metrics = generateCompleteMetrics(event);

    if (format === 'csv') {
      // Generate CSV content
      const csvData = generateCSV(metrics, event);

      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="metrics-${event.eventCode}-${Date.now()}.csv"`
        }
      });
    }

    if (format === 'pdf') {
      // For PDF, we'll return a mock response with the data
      // In a real implementation, you'd use a library like jsPDF or Puppeteer
      return NextResponse.json({
        success: true,
        message: 'PDF export generated successfully',
        format: 'pdf',
        filename: `metrics-${event.eventCode}-${Date.now()}.pdf`,
        downloadUrl: '#', // Mock URL
        // Include the data that would be in the PDF
        data: {
          eventName: event.name,
          eventCode: event.eventCode,
          generatedAt: new Date().toISOString(),
          summary: {
            registrations: metrics.registration.total,
            attendance: metrics.attendance.checkedIn,
            conversionRate: `${(metrics.registration.conversionRate * 100).toFixed(1)}%`,
            onchainTransactions: metrics.onchain.transactions.total,
            wallets: metrics.onchain.wallets.totalActive,
            socialMentions: metrics.social.mentions
          }
        }
      });
    }

  } catch (error) {
    console.error('Error exporting metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export metrics' },
      { status: 500 }
    );
  }
}

/**
 * Generate CSV content from metrics
 */
function generateCSV(metrics: { registration: { total: number; conversionRate: number; sources: Record<string, number>; geographicDistribution: Array<{ country: string; count: number }> }; attendance: { checkedIn: number; averageDuration: number; peakAttendance: number; noShowRate: number }; onchain: { wallets: { newCreated: number; reactivated: number; totalActive: number }; transactions: { total: number; totalVolume: number; gasSpent: number }; nfts: { poaps: number; certificates: number }; airdrops: { claimed: number; claimRate: number } }; social: { mentions: number; shares: number; hashtagUsage: number; estimatedReach: number; sentiment: { positive: number; neutral: number; negative: number } } }, event: { name: string; eventCode: string }): string {
  const lines: string[] = [];

  // Header
  lines.push('EventMetrics Data Export');
  lines.push(`Event: ${event.name}`);
  lines.push(`Event Code: ${event.eventCode}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  // Registration Metrics
  lines.push('REGISTRATION METRICS');
  lines.push('Metric,Value');
  lines.push(`Total Registrations,${metrics.registration.total}`);
  lines.push(`Conversion Rate,${(metrics.registration.conversionRate * 100).toFixed(1)}%`);
  lines.push(`Web Source,${metrics.registration.sources.web}%`);
  lines.push(`Social Source,${metrics.registration.sources.social}%`);
  lines.push(`Email Source,${metrics.registration.sources.email}%`);
  lines.push(`Referral Source,${metrics.registration.sources.referral}%`);
  lines.push('');

  // Attendance Metrics
  lines.push('ATTENDANCE METRICS');
  lines.push('Metric,Value');
  lines.push(`Checked In,${metrics.attendance.checkedIn}`);
  lines.push(`Average Duration,${metrics.attendance.averageDuration} minutes`);
  lines.push(`Peak Attendance,${metrics.attendance.peakAttendance}`);
  lines.push(`No-Show Rate,${(metrics.attendance.noShowRate * 100).toFixed(1)}%`);
  lines.push('');

  // On-Chain Metrics
  lines.push('ON-CHAIN METRICS');
  lines.push('Metric,Value');
  lines.push(`New Wallets,${metrics.onchain.wallets.newCreated}`);
  lines.push(`Reactivated Wallets,${metrics.onchain.wallets.reactivated}`);
  lines.push(`Total Active Wallets,${metrics.onchain.wallets.totalActive}`);
  lines.push(`Total Transactions,${metrics.onchain.transactions.total}`);
  lines.push(`Total Volume,${metrics.onchain.transactions.totalVolume} AVAX`);
  lines.push(`Gas Spent,${metrics.onchain.transactions.gasSpent} AVAX`);
  lines.push(`POAPs Minted,${metrics.onchain.nfts.poaps}`);
  lines.push(`Certificates,${metrics.onchain.nfts.certificates}`);
  lines.push(`Airdrops Claimed,${metrics.onchain.airdrops.claimed}`);
  lines.push(`Claim Rate,${(metrics.onchain.airdrops.claimRate * 100).toFixed(1)}%`);
  lines.push('');

  // Social Metrics
  lines.push('SOCIAL MEDIA METRICS');
  lines.push('Metric,Value');
  lines.push(`Mentions,${metrics.social.mentions}`);
  lines.push(`Shares,${metrics.social.shares}`);
  lines.push(`Hashtag Usage,${metrics.social.hashtagUsage}`);
  lines.push(`Estimated Reach,${metrics.social.estimatedReach}`);
  lines.push(`Positive Sentiment,${metrics.social.sentiment.positive}`);
  lines.push(`Neutral Sentiment,${metrics.social.sentiment.neutral}`);
  lines.push(`Negative Sentiment,${metrics.social.sentiment.negative}`);
  lines.push('');

  // Geographic Distribution
  lines.push('GEOGRAPHIC DISTRIBUTION');
  lines.push('Country,Registrations');
  metrics.registration.geographicDistribution.forEach((geo: { country: string; count: number }) => {
    lines.push(`${geo.country},${geo.count}`);
  });

  return lines.join('\n');
}
