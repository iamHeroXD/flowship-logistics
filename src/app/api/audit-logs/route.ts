import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  try {
    const logs = db.getAuditLogs();
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
