import { Invoice, Shipment } from '@/types';
import { db } from '@/server/db';

export class InvoiceService {
  public static generateForShipment(shipment: Shipment): Invoice {
    // Check if an invoice already exists
    const existing = db.getInvoices().find((inv) => inv.shipmentId === shipment.id);
    if (existing) {
      return existing;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-2026-${randomSuffix}`;

    const lineItems = [
      {
        description: `${shipment.deliveryTier.replace(/_/g, ' ')} Logistics Delivery Service`,
        quantity: 1,
        unitPrice: shipment.pricing.basePrice,
        amount: shipment.pricing.basePrice,
      },
      {
        description: `Transit Distance Charge (${shipment.pricing.distanceKm} km)`,
        quantity: 1,
        unitPrice: shipment.pricing.distanceFee,
        amount: shipment.pricing.distanceFee,
      },
      {
        description: `Cargo Weight Handling Fee (${shipment.package.weightKg} kg)`,
        quantity: 1,
        unitPrice: shipment.pricing.weightFee,
        amount: shipment.pricing.weightFee,
      },
      {
        description: 'Zone Routing & Energy Surcharges',
        quantity: 1,
        unitPrice: shipment.pricing.zoneSurcharge + shipment.pricing.fuelSurcharge,
        amount: shipment.pricing.zoneSurcharge + shipment.pricing.fuelSurcharge,
      },
    ];

    const subtotal = Math.round(
      (shipment.pricing.basePrice +
        shipment.pricing.distanceFee +
        shipment.pricing.weightFee +
        shipment.pricing.zoneSurcharge +
        shipment.pricing.fuelSurcharge) *
        100
    ) / 100;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      shipmentId: shipment.id,
      trackingNumber: shipment.trackingNumber,
      customerId: shipment.customerId,
      customerName: shipment.customerName,
      customerEmail: shipment.customerEmail,
      billingAddress: shipment.origin,
      lineItems,
      subtotal,
      taxRate: 0.0825,
      taxAmount: shipment.pricing.tax,
      total: shipment.pricing.total,
      currency: shipment.pricing.currency,
      paymentStatus: shipment.payment.status,
      issuedDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
    };

    db.createInvoice(invoice);

    db.createAuditLog({
      actorId: 'system',
      actorName: 'Invoice Automation Engine',
      actorRole: 'ADMIN',
      action: 'GENERATE_INVOICE',
      targetType: 'INVOICE',
      targetId: invoice.id,
      details: `Generated invoice ${invoiceNumber} for shipment ${shipment.trackingNumber} total $${invoice.total}.`,
    });

    return invoice;
  }
}
