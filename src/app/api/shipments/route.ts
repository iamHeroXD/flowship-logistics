import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { PricingService } from '@/server/services/pricingService';
import { PaymentService } from '@/server/services/paymentService';
import { DeliveryTier, PackageDetails, PaymentMethod, Shipment } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const customerId = url.searchParams.get('customerId');
    const status = url.searchParams.get('status');

    let shipments = db.getShipments();

    if (customerId) {
      shipments = shipments.filter((s) => s.customerId === customerId);
    }
    if (status) {
      shipments = shipments.filter((s) => s.status === status);
    }

    return NextResponse.json({ success: true, data: shipments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId = 'usr_cust_1',
      customerName = 'Elena Rostova',
      customerEmail = 'customer@flowship.com',
      customerPhone = '+1 (555) 234-8901',
      origin,
      destination,
      packageDetails,
      deliveryTier = 'STANDARD',
      paymentMethod = 'CARD',
      specialInstructions,
    } = body;

    if (!origin || !destination || !packageDetails) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Origin, destination, and package details are required.' },
        },
        { status: 400 }
      );
    }

    const quote = PricingService.calculateQuote({
      origin,
      destination,
      packageDetails,
      deliveryTier: deliveryTier as DeliveryTier,
    });

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `FLW-2026-${randomSuffix}`;

    const estDelivery = new Date();
    estDelivery.setHours(
      estDelivery.getHours() + (deliveryTier === 'SAME_DAY' ? 6 : deliveryTier === 'EXPRESS' ? 24 : 72)
    );

    const newShipment: Shipment = {
      id: `shp_${Date.now()}`,
      trackingNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      origin,
      destination,
      package: packageDetails,
      deliveryTier: deliveryTier as DeliveryTier,
      specialInstructions,
      status: 'PENDING',
      estimatedDeliveryTime: estDelivery.toISOString(),
      pricing: quote,
      payment: {
        id: `pay_${Date.now()}`,
        invoiceId: `inv_${Date.now()}`,
        amount: quote.total,
        currency: quote.currency,
        method: paymentMethod as PaymentMethod,
        status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'SUCCEEDED',
        provider: paymentMethod === 'WALLET' ? 'INTERNAL_WALLET' : paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'STRIPE',
        transactionReference: `flw_tx_${randomSuffix}`,
        createdAt: new Date().toISOString(),
      },
      events: [
        {
          id: `evt_init_${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'PENDING',
          location: origin.city || 'Origin Dispatch Terminal',
          actorName: customerName,
          actorRole: 'CUSTOMER',
          notes: 'Shipment created, rate locked, electronic manifest registered.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createShipment(newShipment);

    // If paid online, trigger invoice creation
    if (newShipment.payment.status === 'SUCCEEDED') {
      PaymentService.processPaymentConfirmation(
        newShipment.id,
        newShipment.payment.transactionReference,
        newShipment.payment.method,
        newShipment.payment.provider
      );
    }

    db.createAuditLog({
      actorId: customerId,
      actorName: customerName,
      actorRole: 'CUSTOMER',
      action: 'CREATE_SHIPMENT',
      targetType: 'SHIPMENT',
      targetId: newShipment.id,
      details: `Created new shipment ${trackingNumber} to ${destination.city}. Method: ${paymentMethod}`,
    });

    return NextResponse.json({ success: true, data: newShipment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
