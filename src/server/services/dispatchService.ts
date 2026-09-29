import { db } from '@/server/db';
import { ShipmentStateMachine } from './stateMachine';
import { PricingService } from './pricingService';
import { Driver, Shipment } from '@/types';

export class DispatchService {
  public static assignDriver(
    shipmentId: string,
    driverId: string,
    dispatcher: { id: string; name: string }
  ): { success: boolean; shipment?: Shipment; message?: string } {
    const shipment = db.getShipmentById(shipmentId);
    if (!shipment) {
      return { success: false, message: 'Shipment not found' };
    }

    const driver = db.getDriverById(driverId);
    if (!driver) {
      return { success: false, message: 'Driver not found' };
    }

    // Verify vehicle capacity
    if (driver.assignedVehicleId) {
      const vehicle = db.getVehicleById(driver.assignedVehicleId);
      if (vehicle && vehicle.maxWeightCapacityKg < shipment.package.weightKg) {
        return {
          success: false,
          message: `Vehicle capacity (${vehicle.maxWeightCapacityKg}kg) cannot accommodate package weight (${shipment.package.weightKg}kg)`,
        };
      }
    }

    // Update shipment with driver assignment
    db.updateShipment(shipment.id, {
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
      vehicleId: driver.assignedVehicleId,
    });

    // Update driver status and active shipments
    db.updateDriver(driver.id, {
      status: 'BUSY',
      activeShipmentIds: Array.from(new Set([...driver.activeShipmentIds, shipment.id])),
    });

    // Transition shipment state to ASSIGNED
    const updatedShipment = ShipmentStateMachine.transition(
      db.getShipmentById(shipment.id)!,
      'ASSIGNED',
      { id: dispatcher.id, name: dispatcher.name, role: 'DISPATCHER' },
      { notes: `Dispatched to driver ${driver.name} (License: ${driver.licenseNumber})` }
    );

    // Notify driver
    db.createNotification({
      id: `notif_${Date.now()}`,
      userId: driver.userId,
      title: 'New Dispatch Assigned',
      message: `You have been assigned shipment ${shipment.trackingNumber}. Pickup at ${shipment.origin.street}.`,
      type: 'SHIPMENT',
      read: false,
      linkUrl: `/driver/deliveries/${shipment.id}`,
      createdAt: new Date().toISOString(),
    });

    return { success: true, shipment: updatedShipment };
  }

  public static autoDispatch(
    shipmentId: string,
    dispatcher: { id: string; name: string }
  ): { success: boolean; driver?: Driver; shipment?: Shipment; message?: string } {
    const shipment = db.getShipmentById(shipmentId);
    if (!shipment) {
      return { success: false, message: 'Shipment not found' };
    }

    if (shipment.status !== 'PENDING') {
      return { success: false, message: `Shipment is already in '${shipment.status}' status.` };
    }

    const availableDrivers = db.getDrivers().filter((d) => d.status === 'AVAILABLE');
    if (availableDrivers.length === 0) {
      return { success: false, message: 'No available drivers found in the active fleet.' };
    }

    // Rank drivers based on proximity to pickup location and vehicle capacity
    const pickupCoords = shipment.origin.coordinates || { lat: 40.7128, lng: -74.006 };
    let bestDriver: Driver | null = null;
    let shortestDistance = Infinity;

    for (const driver of availableDrivers) {
      // Check vehicle capacity
      if (driver.assignedVehicleId) {
        const vehicle = db.getVehicleById(driver.assignedVehicleId);
        if (vehicle && vehicle.maxWeightCapacityKg < shipment.package.weightKg) {
          continue;
        }
      }

      const dist = PricingService.calculateDistanceKm(driver.currentLocation, pickupCoords);
      if (dist < shortestDistance) {
        shortestDistance = dist;
        bestDriver = driver;
      }
    }

    if (!bestDriver) {
      return {
        success: false,
        message: 'No available drivers with adequate vehicle capacity found.',
      };
    }

    const assignResult = this.assignDriver(shipment.id, bestDriver.id, dispatcher);
    if (!assignResult.success) {
      return { success: false, message: assignResult.message };
    }

    return {
      success: true,
      driver: bestDriver,
      shipment: assignResult.shipment,
      message: `Automatically matched with driver ${bestDriver.name} (${shortestDistance.toFixed(1)} km away).`,
    };
  }
}
