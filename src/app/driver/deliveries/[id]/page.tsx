'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SignaturePad } from '@/components/shared/SignaturePad';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { STATUS_CONFIG, TIER_CONFIG } from '@/lib/constants';
import { Shipment, ShipmentStatus } from '@/types';
import {
  Truck,
  MapPin,
  Package,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Navigation,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';

export default function DriverDeliveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  // POD Modal state
  const [podModalOpen, setPodModalOpen] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [podNotes, setPodNotes] = useState('Signed and accepted with all seals intact.');
  const [isSubmittingPod, setIsSubmittingPod] = useState(false);

  const fetchShipment = () => {
    fetch(`/api/shipments/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setShipment(d.data);
          if (d.data.customerName) setReceiverName(d.data.customerName);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchShipment();
  }, [params.id]);

  const handleAdvanceStatus = async (nextStatus: ShipmentStatus) => {
    setAdvancing(true);
    try {
      const res = await fetch(`/api/shipments/${params.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          actor: { id: 'usr_drv_1', name: 'Carlos Mendoza', role: 'DRIVER' },
          notes: `Driver Carlos Mendoza updated status to ${nextStatus}.`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        success(`Status updated to ${nextStatus.replace(/_/g, ' ')}`);
        fetchShipment();
      } else {
        error(data.error?.message || 'Failed to update status.');
      }
    } catch {
      error('Connection error.');
    } finally {
      setAdvancing(false);
    }
  };

  const handleCompletePod = async () => {
    if (!receiverName.trim()) {
      error('Please enter the name of the person receiving the package.');
      return;
    }
    if (!signatureData) {
      error('Please capture a recipient signature on the pad.');
      return;
    }

    setIsSubmittingPod(true);
    try {
      const res = await fetch(`/api/shipments/${params.id}/pod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverName,
          signatureDataUrl: signatureData,
          notes: podNotes,
          driverId: 'drv_01',
        }),
      });
      const data = await res.json();
      if (data.success) {
        success('Delivery marked complete! Proof of Delivery registered.');
        setPodModalOpen(false);
        fetchShipment();
      } else {
        error(data.error?.message || 'Failed to submit POD.');
      }
    } catch {
      error('Connection error submitting POD.');
    } finally {
      setIsSubmittingPod(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading stop dossier...</div>;
  }

  if (!shipment) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-white font-bold">Stop Not Found</div>
        <Link href="/driver" className="text-emerald-400 underline text-sm">
          Return to Cockpit
        </Link>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[shipment.status] || STATUS_CONFIG.PENDING;

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/driver"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cockpit</span>
        </Link>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
        >
          {statusConf.label}
        </span>
      </div>

      {/* Tracking and Address Card */}
      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
        <div>
          <span className="font-mono text-xs text-emerald-400 font-bold block">
            {shipment.trackingNumber}
          </span>
          <h1 className="text-xl font-black text-white mt-1">
            {shipment.destination.street}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {shipment.destination.city}, {shipment.destination.postalCode || 'NY'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-700/80">
          <div>
            <span className="text-slate-400 block text-[10px]">Contact Person:</span>
            <span className="font-bold text-slate-200">{shipment.customerName}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Phone:</span>
            <a
              href={`tel:${shipment.customerPhone}`}
              className="font-bold text-emerald-400 underline"
            >
              {shipment.customerPhone}
            </a>
          </div>
        </div>

        {/* Navigation Action */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${shipment.destination.street}, ${shipment.destination.city}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Navigation className="w-4 h-4 fill-slate-950" />
          <span>Navigate in Google Maps</span>
        </a>
      </div>

      {/* Package Specs */}
      <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700 text-xs space-y-2">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
          <Package className="w-4 h-4 text-emerald-400" />
          <span>Cargo Details</span>
        </h3>
        <div className="flex justify-between text-slate-300">
          <span>Contents:</span>
          <strong className="text-white">{shipment.package.description}</strong>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Gross Weight:</span>
          <strong className="font-mono text-emerald-400">{shipment.package.weightKg} kg</strong>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Service SLA:</span>
          <strong>{TIER_CONFIG[shipment.deliveryTier]?.label}</strong>
        </div>
      </div>

      {/* Driver State Transition Flow */}
      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-4">
        <h3 className="font-bold text-white text-sm">Update Stop Milestone</h3>

        {shipment.status === 'PENDING' && (
          <Button
            variant="pill-primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500"
            isLoading={advancing}
            onClick={() => handleAdvanceStatus('ASSIGNED')}
          >
            Acknowledge & Assign to My Vehicle
          </Button>
        )}

        {shipment.status === 'ASSIGNED' && (
          <Button
            variant="pill-primary"
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-500"
            isLoading={advancing}
            onClick={() => handleAdvanceStatus('PICKED_UP')}
          >
            Arrived at Pickup & Confirm Loaded
          </Button>
        )}

        {shipment.status === 'PICKED_UP' && (
          <Button
            variant="pill-primary"
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-500"
            isLoading={advancing}
            onClick={() => handleAdvanceStatus('IN_TRANSIT')}
          >
            Departed Pickup & In Transit
          </Button>
        )}

        {shipment.status === 'IN_TRANSIT' && (
          <Button
            variant="pill-primary"
            size="lg"
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold"
            isLoading={advancing}
            onClick={() => handleAdvanceStatus('OUT_FOR_DELIVERY')}
          >
            Arrived at Destination Dropoff
          </Button>
        )}

        {shipment.status === 'OUT_FOR_DELIVERY' && (
          <Button
            variant="pill-primary"
            size="lg"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
            onClick={() => setPodModalOpen(true)}
            leftIcon={<FileCheck2 className="w-5 h-5 text-slate-950" />}
          >
            Complete Delivery & Sign POD
          </Button>
        )}

        {shipment.status === 'DELIVERED' && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="font-extrabold text-white text-base">Delivery Completed & Verified!</div>
            <p className="text-xs text-slate-300">
              Signed by: {shipment.proofOfDelivery?.receiverName || shipment.customerName}
            </p>
          </div>
        )}
      </div>

      {/* Proof of Delivery Modal */}
      <Modal
        isOpen={podModalOpen}
        onClose={() => setPodModalOpen(false)}
        title="Electronic Proof of Delivery (POD)"
        description="Capture recipient signature and release custody."
      >
        <div className="space-y-4 text-slate-900">
          <Input
            label="Recipient Full Name"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="e.g. Julian Sterling"
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Recipient Digital Signature
            </label>
            <SignaturePad
              onSave={(dataUrl) => {
                setSignatureData(dataUrl);
                success('Signature registered on pad.');
              }}
            />
          </div>

          <Input
            label="Handover Notes / Verification"
            value={podNotes}
            onChange={(e) => setPodNotes(e.target.value)}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setPodModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="pill-primary"
              onClick={handleCompletePod}
              isLoading={isSubmittingPod}
              disabled={!signatureData}
            >
              Confirm Delivery & Close Stop
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
