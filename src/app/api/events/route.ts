import { NextRequest, NextResponse } from 'next/server';
import { createMockEvent, loadEventsFromStorage, saveEventsToStorage, isEventNameUnique } from '@/lib/mock-events';
import { EventType, LocationType } from '@/store/event-store';

// Simulate network latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1500));

export async function GET(request: NextRequest) {
  try {
    await simulateDelay();

    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');

    const events = loadEventsFromStorage();

    // Filter by organization if specified
    const filteredEvents = organizationId
      ? events.filter(event => event.organizationId === organizationId)
      : events;

    return NextResponse.json({
      success: true,
      events: filteredEvents,
      count: filteredEvents.length
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await simulateDelay();

    const body = await request.json();

    // Validation
    const errors: Record<string, string> = {};

    if (!body.name?.trim()) {
      errors.name = 'Event name is required';
    }

    if (!body.description?.trim()) {
      errors.description = 'Event description is required';
    }

    if (!body.eventType) {
      errors.eventType = 'Event type is required';
    }

    if (!body.organizationId) {
      errors.organizationId = 'Organization is required';
    }

    if (!body.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!body.startTime) {
      errors.startTime = 'Start time is required';
    }

    if (!body.endDate) {
      errors.endDate = 'End date is required';
    }

    if (!body.endTime) {
      errors.endTime = 'End time is required';
    }

    if (!body.locationType) {
      errors.locationType = 'Location type is required';
    }

    // Date validation
    if (body.startDate && body.startTime && body.endDate && body.endTime) {
      const startDateTime = new Date(`${body.startDate}T${body.startTime}`);
      const endDateTime = new Date(`${body.endDate}T${body.endTime}`);

      if (endDateTime <= startDateTime) {
        errors.endDate = 'End date must be after start date';
      }
    }

    // Capacity validation
    if (body.maxCapacity && body.maxCapacity <= 0) {
      errors.maxCapacity = 'Maximum capacity must be greater than 0';
    }

    // Conditional validation
    if (body.locationType === 'in-person' && !body.address?.trim()) {
      errors.address = 'Address is required for in-person events';
    }

    if ((body.locationType === 'virtual' || body.locationType === 'hybrid') && !body.virtualLink?.trim()) {
      errors.virtualLink = 'Virtual link is required for virtual/hybrid events';
    }

    // Check unique name
    if (body.name && body.organizationId) {
      if (!isEventNameUnique(body.name, body.organizationId)) {
        errors.name = 'An event with this name already exists in your organization';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Get creator ID from session (mock)
    // In a real app, this would come from authenticated session
    const creatorId = body.creatorId || 'user_mock_001';

    // Create event
    const newEvent = createMockEvent(
      {
        name: body.name,
        description: body.description,
        eventType: body.eventType as EventType,
        organizationId: body.organizationId,
        startDate: body.startDate,
        startTime: body.startTime,
        endDate: body.endDate,
        endTime: body.endTime,
        locationType: body.locationType as LocationType,
        address: body.address,
        virtualLink: body.virtualLink,
        maxCapacity: body.maxCapacity || 50,
        priceType: body.priceType || 'free',
        priceAmount: body.priceAmount || 0,
        specialRequirements: body.specialRequirements,
        tags: body.tags || []
      },
      creatorId
    );

    // Save to storage
    const allEvents = loadEventsFromStorage();
    allEvents.unshift(newEvent);
    saveEventsToStorage(allEvents);

    console.log('✅ MOCK EVENT CREATED:', {
      id: newEvent.id,
      code: newEvent.eventCode,
      name: newEvent.name,
      organization: newEvent.organizationId
    });

    return NextResponse.json({
      success: true,
      event: newEvent,
      message: 'Event created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
