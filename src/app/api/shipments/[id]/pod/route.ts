import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { ShipmentStateMachine } from '@/server/services/stateMachine';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { receiverName, signatureDataUrl, photoUrl, notes, driverId = 'drv_01' } = await req.json();

    if (!receiverName) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Receiver name is required for proof of delivery.' } },
        { status: 400 }
      );
    }

    const shipment = db.getShipmentById(params.id);
    if (!shipment) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Shipment not found' } },
        { status: 404 }
      );
    }

    const driver = db.getDriverById(driverId);
    const actorName = driver ? driver.name : 'Authorized Driver';

    const pod = {
      receiverName,
      signatureDataUrl,
      photoUrl,
      signedAt: new Date().toISOString(),
      coordinates: shipment.destination.coordinates || { lat: 40.7589, lng: -73.9851 },
      notes: notes || 'Delivered directly to designated recipient.',
    };

    // Update shipment POD
    db.updateShipment(shipment.id, { proofOfDelivery: pod });

    // Transition state machine to DELIVERED
    const updated = ShipmentStateMachine.transition(
      db.getShipmentById(shipment.id)!,
      'DELIVERED',
      { id: driver ? driver.userId : 'usr_drv_1', name: actorName, role: 'DRIVER' },
      {
        location: `${shipment.destination.city} (${shipment.destination.street})`,
        coordinates: pod.coordinates,
        notes: `Handed over to ${receiverName}. Digital signature recorded.`,
      }
    );

    // Free up driver
    if (driver) {
      const activeIds = driver.activeShipmentIds.filter((sid) => sid !== shipment.id);
      db.updateDriver(driver.id, {
        status: activeIds.length === 0 ? 'AVAILABLE' : 'BUSY',
        activeShipmentIds: activeIds,
        totalDeliveries: driver.totalDeliveries + 1,
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
