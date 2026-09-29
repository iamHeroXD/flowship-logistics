import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  try {
    const inventory = db.getInventory();
    return NextResponse.json({ success: true, data: inventory });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { itemId, action, quantity = 1 } = await req.json();

    const inventory = db.getInventory();
    const item = inventory.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Inventory SKU item not found' } },
        { status: 404 }
      );
    }

    let updates: any = {};
    if (action === 'RESERVE') {
      if (item.quantityAvailable < quantity) {
        return NextResponse.json(
          { success: false, error: { code: 'INSUFFICIENT_STOCK', message: 'Not enough available units' } },
          { status: 400 }
        );
      }
      updates = {
        quantityReserved: item.quantityReserved + quantity,
        quantityAvailable: item.quantityAvailable - quantity,
      };
    } else if (action === 'RELEASE') {
      updates = {
        quantityReserved: Math.max(0, item.quantityReserved - quantity),
        quantityAvailable: item.quantityAvailable + quantity,
      };
    } else if (action === 'RECEIVE') {
      updates = {
        quantityOnHand: item.quantityOnHand + quantity,
        quantityAvailable: item.quantityAvailable + quantity,
      };
    }

    const updatedItem = db.updateInventoryItem(item.id, updates);

    db.createAuditLog({
      actorId: 'usr_adm_1',
      actorName: 'Warehouse Supervisor',
      actorRole: 'ADMIN',
      action: `INVENTORY_${action}`,
      targetType: 'INVENTORY',
      targetId: item.sku,
      details: `${action} ${quantity} units for ${item.name} (${item.sku}).`,
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
