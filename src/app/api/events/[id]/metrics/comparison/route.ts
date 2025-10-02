import { NextRequest, NextResponse } from 'next/server';
import { loadEventsFromStorage } from '@/lib/mock-events';
import { generateComparisonMetrics } from '@/lib/mock-metrics';

// Simulate network latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 700));

/**
 * GET /api/events/[id]/metrics/comparison
 * Get comparison data with similar events
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

    // Generate comparison metrics
    const comparisonData = generateComparisonMetrics(event);

    console.log('📈 MOCK COMPARISON GENERATED:', {
      eventId: event.id,
      eventName: event.name,
      similarEventsCount: comparisonData.similarEvents.length,
      percentile: comparisonData.percentile
    });

    return NextResponse.json({
      success: true,
      comparison: comparisonData,
      event: {
        id: event.id,
        name: event.name,
        eventCode: event.eventCode,
        eventType: event.eventType
      }
    });

  } catch (error) {
    console.error('Error fetching comparison metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comparison data' },
      { status: 500 }
    );
  }
}
