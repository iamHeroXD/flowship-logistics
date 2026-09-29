import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { otp, email } = await req.json();

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_OTP', message: 'A 6-digit OTP verification code is required.' } },
        { status: 400 }
      );
    }

    // In demo environment, accept '123456' or any 6-digit code for testing
    return NextResponse.json({
      success: true,
      message: 'Account phone and email verified successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
