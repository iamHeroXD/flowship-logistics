'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { InventoryItem } from '@/types';
import { Boxes, Plus, ArrowRightLeft, ShieldCheck, Search } from 'lucide-react';

function InventoryContent() {
  const searchParams = useSearchParams();
  const whFilterParam = searchParams.get('warehouse') || 'ALL';
  const { format } = useCurrency();
  const { success, error } = useToast();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [whFilter, setWhFilter] = useState(whFilterParam);
  const [loading, setLoading] = useState(true);

  // Stock Movement Modal
  const [opModalOpen, setOpModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [opAction, setOpAction] = useState<'RECEIVE' | 'RESERVE' | 'RELEASE'>('RECEIVE');
  const [opQty, setOpQty] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = () => {
    fetch('/api/inventory')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setInventory(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockOp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qty = parseInt(opQty, 10);
    if (isNaN(qty) || qty <= 0) {
      error('Please enter a valid positive quantity.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItem.id,
          action: opAction,
          quantity: qty,
        }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Successfully recorded stock ${opAction} of ${qty} units.`);
        setOpModalOpen(false);
        fetchInventory();
      } else {
        error(data.error?.message || 'Operation failed.');
      }
    } catch {
      error('Connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchesWh = whFilter === 'ALL' || item.warehouseCode === whFilter;
    return matchesSearch && matchesWh;
  });

  return (
    <>
      <DashboardHeader
        title="Warehouse Inventory & SKU Control"
        subtitle="Real-time multi-hub stock management, bin locations, and reserve/release allocation."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        {/* Top Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96">
            <Input
              placeholder="Search SKU or item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={whFilter}
              onChange={(e) => setWhFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Warehouses' },
                { value: 'WH-NYC-01', label: 'WH-NYC-01 (New York)' },
                { value: 'WH-CHI-02', label: 'WH-CHI-02 (Chicago)' },
                { value: 'WH-LAX-03', label: 'WH-LAX-03 (Los Angeles)' },
              ]}
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">SKU Code</th>
                  <th className="py-3.5 px-6">Product Description</th>
                  <th className="py-3.5 px-6">Hub Facility</th>
                  <th className="py-3.5 px-6 text-right">On Hand</th>
                  <th className="py-3.5 px-6 text-right">Reserved</th>
                  <th className="py-3.5 px-6 text-right">Available</th>
                  <th className="py-3.5 px-6 text-right">Unit Value</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-brand-navy">
                      {item.sku}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-semibold text-brand-teal bg-brand-surface px-2.5 py-0.5 rounded-full border border-slate-200">
                        {item.warehouseCode}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">
                      {item.quantityOnHand.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-amber-600 font-bold">
                      {item.quantityReserved.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-extrabold text-emerald-600">
                      {item.quantityAvailable.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-slate-900">
                      {format(item.unitValue)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setOpModalOpen(true);
                        }}
                        leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
                      >
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedItem && (
        <Modal
          isOpen={opModalOpen}
          onClose={() => setOpModalOpen(false)}
          title={`Inventory Stock Adjustment — ${selectedItem.sku}`}
          description={selectedItem.name}
        >
          <form onSubmit={handleStockOp} className="space-y-4 text-xs">
            <Select
              label="Transaction Action"
              value={opAction}
              onChange={(e) => setOpAction(e.target.value as any)}
              options={[
                { value: 'RECEIVE', label: 'RECEIVE: Inbound Shipment Stock Add' },
                { value: 'RESERVE', label: 'RESERVE: Hold Units for Outbound Freight' },
                { value: 'RELEASE', label: 'RELEASE: Return Reserved Units to Available' },
              ]}
            />

            <Input
              label="Quantity of Units"
              type="number"
              value={opQty}
              onChange={(e) => setOpQty(e.target.value)}
              min="1"
              required
            />

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Current Available:</span>
                <strong className="font-mono">{selectedItem.quantityAvailable} units</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Current Reserved:</span>
                <strong className="font-mono text-amber-700">{selectedItem.quantityReserved} units</strong>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setOpModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="pill-primary" type="submit" isLoading={isSubmitting}>
                Execute Transaction
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading inventory SKU catalog...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
