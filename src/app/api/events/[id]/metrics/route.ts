import { NextRequest, NextResponse } from 'next/server';
import { loadEventsFromStorage } from '@/lib/mock-events';
import { generateCompleteMetrics } from '@/lib/mock-metrics';

// Simulate network latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 800));

/**
 * GET /api/events/[id]/metrics
 * Retrieve complete metrics for a specific event
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

    // Generate complete metrics for this event
    const metrics = generateCompleteMetrics(event);

    console.log('📊 MOCK METRICS GENERATED:', {
      eventId: event.id,
      eventName: event.name,
      registrations: metrics.registration.total,
      attendance: metrics.attendance.checkedIn,
      onchainTx: metrics.onchain.transactions.total,
      socialMentions: metrics.social.mentions
    });

    return NextResponse.json({
      success: true,
      metrics,
      event: {
        id: event.id,
        name: event.name,
        eventCode: event.eventCode,
        status: event.status
      }
    });

  } catch (error) {
    console.error('Error fetching event metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
