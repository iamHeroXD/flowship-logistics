import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shipment = db.getShipmentById(params.id);
    if (!shipment) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Shipment not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: shipment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = db.updateShipment(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Shipment not found' } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
