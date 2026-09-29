import { NextRequest, NextResponse } from 'next/server';
import { DispatchService } from '@/server/services/dispatchService';

export async function POST(req: NextRequest) {
  try {
    const { shipmentId, driverId, dispatcher = { id: 'usr_disp_1', name: 'Marcus Vance' } } = await req.json();

    if (!shipmentId || !driverId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'shipmentId and driverId are required.' } },
        { status: 400 }
      );
    }

    const result = DispatchService.assignDriver(shipmentId, driverId, dispatcher);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'ASSIGNMENT_FAILED', message: result.message } },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.shipment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
