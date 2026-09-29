import { PaymentMethod, PaymentRecord, PaymentStatus, Shipment } from '@/types';
import { db } from '@/server/db';
import { InvoiceService } from './invoiceService';

export interface PaymentIntentResult {
  clientSecret?: string;
  transactionReference: string;
  provider: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE' | 'INTERNAL_WALLET' | 'COD';
  status: PaymentStatus;
  amount: number;
  currency: string;
}

export class PaymentService {
  public static createPaymentIntent(
    shipment: Shipment,
    method: PaymentMethod,
    provider: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE' | 'INTERNAL_WALLET' | 'COD' = 'STRIPE'
  ): PaymentIntentResult {
    const reference = `flw_tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (method === 'CASH_ON_DELIVERY') {
      return {
        transactionReference: reference,
        provider: 'COD',
        status: 'PENDING',
        amount: shipment.pricing.total,
        currency: shipment.pricing.currency,
      };
    }

    if (method === 'WALLET') {
      // In production, check customer's organization/user balance
      return {
        transactionReference: reference,
        provider: 'INTERNAL_WALLET',
        status: 'SUCCEEDED',
        amount: shipment.pricing.total,
        currency: shipment.pricing.currency,
      };
    }

    // Default card or bank gateway adapter simulation
    return {
      clientSecret: `pi_mock_${reference}_secret_${Math.random().toString(36).substring(2, 10)}`,
      transactionReference: reference,
      provider,
      status: 'SUCCEEDED', // Development mode instant capture
      amount: shipment.pricing.total,
      currency: shipment.pricing.currency,
    };
  }

  public static processPaymentConfirmation(
    shipmentId: string,
    transactionReference: string,
    method: PaymentMethod,
    provider: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE' | 'INTERNAL_WALLET' | 'COD'
  ): PaymentRecord {
    const shipment = db.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found`);
    }

    const payment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      invoiceId: `inv_${Date.now()}`,
      amount: shipment.pricing.total,
      currency: shipment.pricing.currency,
      method,
      status: 'SUCCEEDED',
      provider,
      transactionReference,
      createdAt: new Date().toISOString(),
    };

    // Update shipment payment
    db.updateShipment(shipment.id, { payment });

    // Generate invoice automatically
    InvoiceService.generateForShipment(shipment);

    db.createAuditLog({
      actorId: shipment.customerId,
      actorName: shipment.customerName,
      actorRole: 'CUSTOMER',
      action: 'PAYMENT_RECEIVED',
      targetType: 'PAYMENT',
      targetId: payment.id,
      details: `Received payment of $${payment.amount} via ${method} (${provider}). Ref: ${transactionReference}`,
    });

    return payment;
  }
}
