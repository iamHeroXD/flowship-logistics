'use client';

import React from 'react';
import { Invoice } from '@/types';
import { formatMoney, formatDate } from '@/lib/formatters';
import { Truck, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const InvoiceView: React.FC<{ invoice: Invoice; onPrint?: () => void }> = ({
  invoice,
  onPrint = () => window.print(),
}) => {
  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-elevated max-w-3xl mx-auto print:border-none print:shadow-none print:p-0">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-surface flex items-center justify-center text-brand-mint border border-slate-200">
              <Truck className="w-5 h-5 text-brand-mint" />
            </div>
            <span className="font-extrabold text-brand-navy tracking-tight text-lg">
              Flowship Logistics
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            450 Lexington Avenue, 18th Floor<br />
            New York, NY 10017 &bull; billing@flowship.com
          </p>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            Commercial Waybill Invoice
          </span>
          <h2 className="text-2xl font-black text-brand-navy mt-0.5">{invoice.invoiceNumber}</h2>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paid in Full</span>
          </div>
        </div>
      </div>

      {/* Bill To & Metadata */}
      <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-100 text-xs">
        <div>
          <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Billed To
          </span>
          <div className="font-bold text-slate-900 text-sm">{invoice.customerName}</div>
          <div className="text-slate-600">{invoice.customerEmail}</div>
          <div className="text-slate-500 mt-1">
            {invoice.billingAddress.street}, {invoice.billingAddress.city}
          </div>
        </div>

        <div className="text-right space-y-1">
          <div>
            <span className="text-slate-400">Tracking Reference:</span>{' '}
            <strong className="font-mono text-slate-800">{invoice.trackingNumber}</strong>
          </div>
          <div>
            <span className="text-slate-400">Issue Date:</span>{' '}
            <strong className="text-slate-800">{formatDate(invoice.issuedDate)}</strong>
          </div>
          <div>
            <span className="text-slate-400">Payment Due:</span>{' '}
            <strong className="text-slate-800">{formatDate(invoice.dueDate)}</strong>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="py-6 border-b border-slate-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Line Item Description</th>
              <th className="py-2.5 px-4 text-center">Qty</th>
              <th className="py-2.5 px-4 text-right">Unit Price</th>
              <th className="py-2.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.lineItems.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 px-4 font-medium text-slate-900">{item.description}</td>
                <td className="py-3 px-4 text-center text-slate-600">{item.quantity}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-600">
                  {formatMoney(item.unitPrice)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                  {formatMoney(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="py-6 flex justify-end text-xs">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono font-semibold">{formatMoney(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Regional Tax / VAT (8.25%):</span>
            <span className="font-mono font-semibold">{formatMoney(invoice.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-brand-navy pt-2 border-t border-slate-200">
            <span>Total Settled:</span>
            <span className="font-mono">{formatMoney(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 print:hidden">
        <Button variant="outline" size="sm" onClick={onPrint} leftIcon={<Printer className="w-4 h-4" />}>
          Print Receipt
        </Button>
        <Button variant="pill-primary" size="sm" onClick={onPrint} leftIcon={<Download className="w-4 h-4" />}>
          Download PDF
        </Button>
      </div>
    </div>
  );
};
