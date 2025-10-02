import { NextRequest, NextResponse } from 'next/server';
import { loadEventsFromStorage } from '@/lib/mock-events';
import { generateCompleteMetrics } from '@/lib/mock-metrics';
import { generateEventReport } from '@/lib/report-generator';

// Simulate network latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

/**
 * GET /api/events/[id]/report
 * Generate post-event report
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await simulateDelay();

    const { id: eventId } = await params;

    // Load event from storage
    const events = loadEventsFromStorage();
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Generate complete metrics
    const metrics = generateCompleteMetrics(event);

    // Generate report
    const report = generateEventReport(event, metrics);

    console.log('📋 MOCK REPORT GENERATED:', {
      eventId: event.id,
      eventName: event.name,
      highlights: report.highlights.length,
      recommendations: report.recommendations.length,
      percentile: report.comparison.percentile
    });

    return NextResponse.json({
      success: true,
      report,
      event: {
        id: event.id,
        name: event.name,
        eventCode: event.eventCode,
        status: event.status
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
