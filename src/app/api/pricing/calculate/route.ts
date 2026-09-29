import { NextRequest, NextResponse } from 'next/server';
import { PricingService } from '@/server/services/pricingService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, packageDetails, deliveryTier } = body;

    if (!origin || !destination || !packageDetails || !deliveryTier) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'origin, destination, packageDetails, and deliveryTier are required.',
          },
        },
        { status: 400 }
      );
    }

    const quote = PricingService.calculateQuote({
      origin,
      destination,
      packageDetails,
      deliveryTier,
    });

    return NextResponse.json({ success: true, data: quote });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'CALCULATION_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
