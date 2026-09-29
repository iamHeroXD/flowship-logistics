import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  try {
    const warehouses = db.getWarehouses();
    return NextResponse.json({ success: true, data: warehouses });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
