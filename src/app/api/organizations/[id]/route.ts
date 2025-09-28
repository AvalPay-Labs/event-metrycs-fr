import { NextRequest, NextResponse } from 'next/server';
import { MockOrganizationService } from '@/lib/mock-organizations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const orgId = parseInt(resolvedParams.id);

    if (isNaN(orgId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid organization ID'
        },
        { status: 400 }
      );
    }

    const organizationDetail = await MockOrganizationService.getOrganizationDetail(orgId);

    if (!organizationDetail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Organization not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: organizationDetail
    });
  } catch (error) {
    console.error('Error fetching organization detail:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch organization details'
      },
      { status: 500 }
    );
  }
}