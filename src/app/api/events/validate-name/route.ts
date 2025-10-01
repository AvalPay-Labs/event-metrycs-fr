import { NextRequest, NextResponse } from 'next/server';
import { isEventNameUnique } from '@/lib/mock-events';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const organizationId = searchParams.get('organizationId');

    if (!name || !organizationId) {
      return NextResponse.json(
        { success: false, error: 'Name and organizationId are required' },
        { status: 400 }
      );
    }

    const isUnique = isEventNameUnique(name, organizationId);

    return NextResponse.json({
      success: true,
      isUnique,
      message: isUnique ? 'Name is available' : 'Name is already taken'
    });
  } catch (error) {
    console.error('Error validating event name:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate name' },
      { status: 500 }
    );
  }
}
