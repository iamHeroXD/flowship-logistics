import { NextRequest, NextResponse } from 'next/server';
import { DispatchService } from '@/server/services/dispatchService';

export async function POST(req: NextRequest) {
  try {
    const { shipmentId, dispatcher = { id: 'usr_disp_1', name: 'Marcus Vance' } } = await req.json();

    if (!shipmentId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'shipmentId is required.' } },
        { status: 400 }
      );
    }

    const result = DispatchService.autoDispatch(shipmentId, dispatcher);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTO_DISPATCH_FAILED', message: result.message } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        driver: result.driver,
        shipment: result.shipment,
        message: result.message,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
