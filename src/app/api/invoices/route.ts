import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const shipmentId = url.searchParams.get('shipmentId');

    let invoices = db.getInvoices();
    if (shipmentId) {
      invoices = invoices.filter((i) => i.shipmentId === shipmentId);
    }

    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
