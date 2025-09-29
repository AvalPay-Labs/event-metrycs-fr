import { NextRequest, NextResponse } from 'next/server';
import { MockOrganizationService } from '@/lib/mock-organizations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId || typeof organizationId !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Organization ID is required'
        },
        { status: 400 }
      );
    }

    // In a real implementation, get userId from authenticated session
    // const userId = 1;

    const result = await MockOrganizationService.requestToJoinOrganization(
      organizationId
    );

    const statusCode = result.success ? 200 : 400;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('Error joining organization:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process join request'
      },
      { status: 500 }
    );
  }
}