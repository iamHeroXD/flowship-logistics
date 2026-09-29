import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { ShipmentStateMachine } from '@/server/services/stateMachine';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, actor = { id: 'usr_disp_1', name: 'Marcus Vance', role: 'DISPATCHER' }, notes, location } = await req.json();

    const shipment = db.getShipmentById(params.id);
    if (!shipment) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Shipment not found' } },
        { status: 404 }
      );
    }

    try {
      const updated = ShipmentStateMachine.transition(shipment, status, actor, {
        notes,
        location,
      });

      return NextResponse.json({ success: true, data: updated });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TRANSITION', message: err.message } },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
