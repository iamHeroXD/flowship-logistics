import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || 'usr_cust_1';
    const notifications = db.getNotifications(userId);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { notificationId, userId = 'usr_cust_1', markAll = false } = await req.json();

    if (markAll) {
      db.markAllNotificationsAsRead(userId);
      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (notificationId) {
      db.markNotificationAsRead(notificationId, userId);
      return NextResponse.json({ success: true, message: 'Marked as read' });
    }

    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Missing parameters' } },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
