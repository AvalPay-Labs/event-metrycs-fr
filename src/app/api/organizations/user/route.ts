import { NextRequest, NextResponse } from 'next/server';
import { MockOrganizationService } from '@/lib/mock-organizations';

export async function GET() {
  try {
    // In a real implementation, get userId from authenticated session
    // For now, using mock user ID
    const userId = 1;

    const userOrganizations = await MockOrganizationService.getUserOrganizations(userId);

    return NextResponse.json({
      success: true,
      data: userOrganizations
    });
  } catch (error) {
    console.error('Error fetching user organizations:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user organizations'
      },
      { status: 500 }
    );
  }
}