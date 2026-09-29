'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { InvoiceView } from '@/components/shared/InvoiceView';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatDate } from '@/lib/formatters';
import { Invoice } from '@/types';
import { Receipt, Eye, Download, CheckCircle2 } from 'lucide-react';

function InvoicesContent() {
  const searchParams = useSearchParams();
  const highlightedShipmentId = searchParams.get('shipmentId');
  const { format } = useCurrency();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/invoices')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setInvoices(d.data);
          if (highlightedShipmentId) {
            const match = d.data.find((inv: Invoice) => inv.shipmentId === highlightedShipmentId);
            if (match) setSelectedInvoice(match);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [highlightedShipmentId]);

  return (
    <>
      <DashboardHeader
        title="Invoices & Waybill Billing"
        subtitle="Download tax-compliant commercial invoices and receipts for accounting."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-brand-navy">Commercial Invoices</h2>
              <p className="text-xs text-slate-500">Auto-generated for settled consignments.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Invoice Number</th>
                  <th className="py-3.5 px-6">Tracking Ref</th>
                  <th className="py-3.5 px-6">Issued Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Total Amount</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-brand-navy">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      {inv.trackingNumber}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {formatDate(inv.issuedDate)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Paid</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      {format(inv.total)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInvoice(inv)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {invoices.length === 0 && !loading && (
              <div className="p-12 text-center text-slate-400 text-sm">
                No invoices issued yet. Invoices generate automatically once shipments are booked.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          maxWidth="2xl"
        >
          <InvoiceView invoice={selectedInvoice} />
        </Modal>
      )}
    </>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading invoices...</div>}>
      <InvoicesContent />
    </Suspense>
  );
}
