import { Shipment, ShipmentStatus, ShipmentEvent, UserRole } from '@/types';
import { db } from '@/server/db';

const VALID_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  PENDING: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export class ShipmentStateMachine {
  public static canTransition(current: ShipmentStatus, next: ShipmentStatus): boolean {
    const allowed = VALID_TRANSITIONS[current] || [];
    return allowed.includes(next);
  }

  public static transition(
    shipment: Shipment,
    newStatus: ShipmentStatus,
    actor: { id: string; name: string; role: UserRole },
    options?: {
      location?: string;
      coordinates?: { lat: number; lng: number };
      notes?: string;
    }
  ): Shipment {
    if (!this.canTransition(shipment.status, newStatus)) {
      throw new Error(
        `Invalid shipment status transition: cannot move from '${shipment.status}' to '${newStatus}'.`
      );
    }

    const event: ShipmentEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: newStatus,
      location: options?.location || (newStatus === 'DELIVERED' ? shipment.destination.city : shipment.origin.city),
      coordinates: options?.coordinates,
      actorName: actor.name,
      actorRole: actor.role,
      notes: options?.notes || `Status advanced to ${newStatus} by ${actor.name} (${actor.role}).`,
    };

    const updates: Partial<Shipment> = {
      status: newStatus,
      events: [...shipment.events, event],
      updatedAt: new Date().toISOString(),
    };

    if (newStatus === 'DELIVERED') {
      updates.actualDeliveryTime = new Date().toISOString();
    }

    const updated = db.updateShipment(shipment.id, updates);
    if (!updated) {
      throw new Error(`Failed to persist shipment state transition for shipment ${shipment.id}`);
    }

    // Log to audit trail
    db.createAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: `SHIPMENT_STATUS_${newStatus}`,
      targetType: 'SHIPMENT',
      targetId: shipment.id,
      details: `Advanced status from ${shipment.status} to ${newStatus}. ${options?.notes || ''}`,
    });

    // Notify customer
    db.createNotification({
      id: `notif_${Date.now()}`,
      userId: shipment.customerId,
      title: `Shipment Update: ${newStatus.replace(/_/g, ' ')}`,
      message: `Your package ${shipment.trackingNumber} status is now: ${newStatus.replace(/_/g, ' ')}.`,
      type: 'SHIPMENT',
      read: false,
      linkUrl: `/dashboard/shipments/${shipment.id}`,
      createdAt: new Date().toISOString(),
    });

    return updated;
  }
}
