import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  try {
    const drivers = db.getDrivers();
    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, currentLocation } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Driver id is required.' } },
        { status: 400 }
      );
    }

    const updated = db.updateDriver(id, {
      ...(status && { status }),
      ...(currentLocation && { currentLocation }),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Driver not found.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
