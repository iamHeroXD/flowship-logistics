import { NextRequest, NextResponse } from 'next/server';
import { BulkShipmentService } from '@/server/services/bulkShipmentService';
import { db } from '@/server/db';

export async function POST(req: NextRequest) {
  try {
    const { csvContent, action = 'validate', validRows } = await req.json();

    if (action === 'validate') {
      if (!csvContent) {
        return NextResponse.json(
          { success: false, error: { code: 'EMPTY_FILE', message: 'No CSV content provided.' } },
          { status: 400 }
        );
      }
      const validation = BulkShipmentService.validateCsv(csvContent);
      return NextResponse.json({ success: true, data: validation });
    }

    if (action === 'import') {
      if (!validRows || !Array.isArray(validRows) || validRows.length === 0) {
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_DATA', message: 'No valid rows provided for batch creation.' } },
          { status: 400 }
        );
      }

      const defaultCustomer = db.getUserById('usr_cust_1')!;
      const created = BulkShipmentService.importValidRows(validRows, defaultCustomer);

      return NextResponse.json({
        success: true,
        data: {
          importedCount: created.length,
          shipments: created,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Action must be validate or import' } },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
