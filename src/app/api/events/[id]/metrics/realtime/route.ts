import { NextRequest, NextResponse } from 'next/server';
import { loadEventsFromStorage } from '@/lib/mock-events';
import { generateCompleteMetrics, generateMetricsUpdate } from '@/lib/mock-metrics';

// Simulate network latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

/**
 * GET /api/events/[id]/metrics/realtime
 * Retrieve real-time metrics updates for an active event
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

    // Check if event is active
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const isActive = now >= eventStart && now <= eventEnd;

    // Generate current metrics
    const currentMetrics = generateCompleteMetrics(event, now);

    // Generate simulated updates if event is active
    const updates = [];
    if (isActive) {
      // Simulate random category updates
      const categories: Array<'registration' | 'attendance' | 'onchain' | 'social'> =
        ['registration', 'attendance', 'onchain', 'social'];

      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const update = generateMetricsUpdate(currentMetrics, randomCategory);
      updates.push(update);
    }

    return NextResponse.json({
      success: true,
      isActive,
      currentMetrics,
      updates,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Error fetching realtime metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch realtime metrics' },
      { status: 500 }
    );
  }
}
