import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const { trackingNumber } = params;
    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Tracking number is required.' } },
        { status: 400 }
      );
    }

    const shipment = db.getShipmentByTrackingNumber(trackingNumber);
    if (!shipment) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No shipment record found for tracking ID '${trackingNumber}'.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: shipment });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message || 'Error retrieving tracking details.' },
      },
      { status: 500 }
    );
  }
}
