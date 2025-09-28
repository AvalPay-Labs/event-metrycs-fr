import { NextRequest, NextResponse } from 'next/server';

export interface WalletConnectRequest {
  walletType: 'core' | 'metamask' | 'avalanche';
  mockAddress: string;
}

export interface WalletConnectResponse {
  success: boolean;
  address?: string;
  type?: string;
  message?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<WalletConnectResponse>> {
  try {
    const body: WalletConnectRequest = await request.json();

    // Validate request
    if (!body.walletType || !body.mockAddress) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: walletType and mockAddress'
        },
        { status: 400 }
      );
    }

    // Validate wallet type
    const validWalletTypes = ['core', 'metamask', 'avalanche'];
    if (!validWalletTypes.includes(body.walletType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid wallet type'
        },
        { status: 400 }
      );
    }

    // Validate address format (basic Ethereum address format)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(body.mockAddress)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid address format'
        },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, this would:
    // 1. Verify the wallet connection
    // 2. Store the wallet info in the database
    // 3. Update user profile with wallet address
    // 4. Log the connection event

    // For now, we just return success
    const response: WalletConnectResponse = {
      success: true,
      address: body.mockAddress,
      type: body.walletType,
      message: 'Wallet connected successfully (mock)'
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Wallet connect API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      message: 'Wallet connection API endpoint',
      supportedWallets: ['core', 'metamask', 'avalanche'],
      demo: true
    },
    { status: 200 }
  );
}