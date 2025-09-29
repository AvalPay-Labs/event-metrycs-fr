import { NextResponse } from 'next/server';
import { MockOrganizationService } from '@/lib/mock-organizations';

export async function GET() {
  try {
    const publicOrganizations = await MockOrganizationService.getPublicOrganizations();

    return NextResponse.json({
      success: true,
      data: publicOrganizations
    });
  } catch (error) {
    console.error('Error fetching public organizations:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch public organizations'
      },
      { status: 500 }
    );
  }
}