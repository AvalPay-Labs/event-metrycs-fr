import { NextRequest, NextResponse } from 'next/server';
import { loadEventsFromStorage, calculateDashboardMetrics, generateChartData } from '@/lib/mock-events';

// Simulate network latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export async function GET(request: NextRequest) {
  try {
    await simulateDelay();

    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');

    // Load all events
    let events = loadEventsFromStorage();

    // Filter by organization if specified
    if (organizationId) {
      events = events.filter(event => event.organizationId === organizationId);
    }

    // Calculate metrics
    const dashboardMetrics = calculateDashboardMetrics(events);

    // Generate chart data
    const chartData = generateChartData(events);

    console.log('📊 MOCK DASHBOARD DATA:', {
      totalEvents: events.length,
      organizationId,
      metrics: dashboardMetrics
    });

    return NextResponse.json({
      success: true,
      events,
      metrics: dashboardMetrics,
      chartData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
