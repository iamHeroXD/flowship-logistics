import Papa from 'papaparse';
import { DeliveryTier, Shipment, User } from '@/types';
import { db } from '@/server/db';
import { PricingService } from './pricingService';

export interface BulkUploadRow {
  recipient_name: string;
  recipient_phone: string;
  pickup_address: string;
  pickup_city: string;
  delivery_address: string;
  delivery_city: string;
  weight_kg: string;
  category: string;
  delivery_tier: string;
  declared_value: string;
  description?: string;
}

export interface BulkValidationResult {
  totalRows: number;
  validRows: BulkUploadRow[];
  invalidRows: { rowNumber: number; data: any; errors: string[] }[];
}

export class BulkShipmentService {
  public static validateCsv(csvContent: string): BulkValidationResult {
    const parseResult = Papa.parse<BulkUploadRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
    });

    const validRows: BulkUploadRow[] = [];
    const invalidRows: { rowNumber: number; data: any; errors: string[] }[] = [];

    parseResult.data.forEach((row, index) => {
      const rowErrors: string[] = [];
      const rowNumber = index + 2; // account for 1-based index and header row

      if (!row.recipient_name?.trim()) rowErrors.push('Missing recipient name');
      if (!row.recipient_phone?.trim()) rowErrors.push('Missing recipient phone');
      if (!row.pickup_address?.trim()) rowErrors.push('Missing pickup address');
      if (!row.pickup_city?.trim()) rowErrors.push('Missing pickup city');
      if (!row.delivery_address?.trim()) rowErrors.push('Missing delivery address');
      if (!row.delivery_city?.trim()) rowErrors.push('Missing delivery city');

      const weight = parseFloat(row.weight_kg);
      if (isNaN(weight) || weight <= 0) {
        rowErrors.push('Invalid weight: must be a positive number');
      }

      const validTiers = ['SAME_DAY', 'EXPRESS', 'STANDARD', 'SCHEDULED'];
      const tier = (row.delivery_tier || 'STANDARD').toUpperCase().replace(/\s+/g, '_');
      if (!validTiers.includes(tier)) {
        rowErrors.push(`Invalid delivery tier '${row.delivery_tier}'. Must be one of: SAME_DAY, EXPRESS, STANDARD, SCHEDULED`);
      }

      if (rowErrors.length > 0) {
        invalidRows.push({ rowNumber, data: row, errors: rowErrors });
      } else {
        validRows.push({ ...row, delivery_tier: tier });
      }
    });

    return {
      totalRows: parseResult.data.length,
      validRows,
      invalidRows,
    };
  }

  public static importValidRows(validRows: BulkUploadRow[], customer: User): Shipment[] {
    const createdShipments: Shipment[] = [];

    for (const row of validRows) {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const trackingNumber = `FLW-2026-${randomSuffix}`;
      const weightKg = parseFloat(row.weight_kg) || 2.5;
      const declaredVal = parseFloat(row.declared_value) || 100;
      const tier = (row.delivery_tier as DeliveryTier) || 'STANDARD';

      const origin = {
        id: `addr_pick_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        street: row.pickup_address,
        city: row.pickup_city,
        country: 'United States',
        coordinates: { lat: 40.7128, lng: -74.006 },
      };

      const destination = {
        id: `addr_dest_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        street: row.delivery_address,
        city: row.delivery_city,
        country: 'United States',
        coordinates: { lat: 40.7589, lng: -73.9851 },
      };

      const pkgDetails = {
        weightKg,
        dimensions: { lengthCm: 30, widthCm: 25, heightCm: 20 },
        category: (row.category?.toUpperCase() || 'GENERAL') as any,
        description: row.description || `Batch parcel for ${row.recipient_name}`,
        declaredValue: declaredVal,
        currency: 'USD',
      };

      const quote = PricingService.calculateQuote({
        origin,
        destination,
        packageDetails: pkgDetails,
        deliveryTier: tier,
      });

      const estDelivery = new Date();
      estDelivery.setHours(estDelivery.getHours() + (tier === 'SAME_DAY' ? 6 : tier === 'EXPRESS' ? 24 : 72));

      const newShipment: Shipment = {
        id: `shp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        trackingNumber,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        organizationId: customer.organizationId,
        origin,
        destination,
        package: pkgDetails,
        deliveryTier: tier,
        status: 'PENDING',
        estimatedDeliveryTime: estDelivery.toISOString(),
        pricing: quote,
        payment: {
          id: `pay_${Date.now()}`,
          invoiceId: `inv_pending_${Date.now()}`,
          amount: quote.total,
          currency: 'USD',
          method: 'WALLET',
          status: 'PENDING',
          provider: 'INTERNAL_WALLET',
          transactionReference: `bulk_tx_${randomSuffix}`,
          createdAt: new Date().toISOString(),
        },
        events: [
          {
            id: `evt_init_${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'PENDING',
            location: origin.city,
            actorName: customer.name,
            actorRole: customer.role,
            notes: 'Batch created via CSV Bulk Shipment Engine.',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.createShipment(newShipment);
      createdShipments.push(newShipment);
    }

    db.createAuditLog({
      actorId: customer.id,
      actorName: customer.name,
      actorRole: customer.role,
      action: 'BULK_SHIPMENT_IMPORT',
      targetType: 'SHIPMENT_BATCH',
      targetId: `batch_${Date.now()}`,
      details: `Imported ${createdShipments.length} shipments from bulk CSV file.`,
    });

    return createdShipments;
  }
}
