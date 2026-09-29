'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

const SAMPLE_CSV = `recipient_name,recipient_phone,pickup_address,pickup_city,delivery_address,delivery_city,weight_kg,category,delivery_tier,declared_value,description
Acme Industrial Tech,+1 (555) 123-4567,450 Lexington Ave,New York,120 Industry City Way,Brooklyn,14.5,ELECTRONICS,EXPRESS,2400,Server Blades Batch A
Summit Logistics LLC,+1 (555) 987-6543,725 Gateway Blvd,Jersey City,350 5th Ave,New York,5.0,DOCUMENTS,SAME_DAY,500,Urgent Legal Filings
BioCare Laboratories,+1 (555) 333-8899,100 Terminal Island,Brooklyn,600 Atlantic Ave,Brooklyn,8.2,PERISHABLE,STANDARD,1200,Thermal Cartridges
Delta Mechanical Inc,,200 Broad St,Newark,80 Pine St,New York,-2.0,GENERAL,INVALID_TIER,300,Invalid Row Example for Error Demo`;

export default function BulkShipmentPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importSummary, setImportSummary] = useState<any>(null);

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowship_bulk_shipment_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    success('Downloaded CSV template');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      validateFile(content);
    };
    reader.readAsText(file);
  };

  const validateFile = async (content: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/shipments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: content, action: 'validate' }),
      });
      const data = await res.json();
      if (data.success) {
        setValidationResult(data.data);
      } else {
        error(data.error?.message || 'CSV validation failed.');
      }
    } catch {
      error('Error connecting to validation engine.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommitImport = async () => {
    if (!validationResult || !validationResult.validRows?.length) {
      error('No valid rows available to import.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/shipments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'import', validRows: validationResult.validRows }),
      });
      const data = await res.json();
      if (data.success) {
        setImportSummary(data.data);
        success(`Successfully batch imported ${data.data.importedCount} shipments!`);
      } else {
        error(data.error?.message || 'Batch commit failed.');
      }
    } catch {
      error('Connection error importing batch.');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleData = () => {
    setCsvText(SAMPLE_CSV);
    validateFile(SAMPLE_CSV);
  };

  return (
    <>
      <DashboardHeader
        title="CSV & Excel Bulk Order Engine"
        subtitle="Batch ingestion for high-volume enterprise shippers with row-level validation."
      />

      <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">
        {/* Upload and Template Actions Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-brand-navy mb-1">Batch Shipment Ingestion</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Download the standardized CSV template, populate your freight line items, and drag it into the dropzone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Template (.CSV)
            </Button>
            <Button
              variant="pill-secondary"
              size="sm"
              onClick={loadSampleData}
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            >
              Load Demo Dataset
            </Button>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        {!importSummary && (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-300 hover:border-brand-teal transition-all text-center">
            <input
              type="file"
              id="csv-file-input"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer block">
              <div className="w-16 h-16 rounded-2xl bg-brand-surface text-brand-teal mx-auto flex items-center justify-center mb-4 border border-slate-200 shadow-xs">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-brand-navy mb-1">
                Upload Bulk Shipment Spreadsheet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Drag and drop your .CSV file here, or click to browse from your workstation.
              </p>
              <span className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-colors">
                Browse Files
              </span>
            </label>
          </div>
        )}

        {/* Validation Review Panel */}
        {validationResult && !importSummary && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-elevated space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-brand-navy">Batch Ingestion Pre-Check</h3>
                <p className="text-xs text-slate-500">
                  Total Parsed Rows: <strong className="text-slate-800">{validationResult.totalRows}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{validationResult.validRows.length} Valid Rows</span>
                </span>

                {validationResult.invalidRows.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{validationResult.invalidRows.length} Errors Found</span>
                  </span>
                )}
              </div>
            </div>

            {/* Error Table if any */}
            {validationResult.invalidRows.length > 0 && (
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Row Validation Exceptions (Will be skipped or flagged)</span>
                </h4>
                <div className="space-y-1.5 text-xs text-rose-800">
                  {validationResult.invalidRows.map((inv: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono font-bold">Row {inv.rowNumber}:</span>
                      <span>{inv.errors.join(' &bull; ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Valid Rows Preview Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Valid Manifest Preview ({validationResult.validRows.length} entries)
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Recipient</th>
                      <th className="py-2.5 px-4">Origin Hub</th>
                      <th className="py-2.5 px-4">Destination</th>
                      <th className="py-2.5 px-4">Weight</th>
                      <th className="py-2.5 px-4">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {validationResult.validRows.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          {row.recipient_name}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{row.pickup_city}</td>
                        <td className="py-2.5 px-4 text-slate-600">{row.delivery_city}</td>
                        <td className="py-2.5 px-4 font-mono">{row.weight_kg} kg</td>
                        <td className="py-2.5 px-4 font-bold text-brand-teal">{row.delivery_tier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                variant="pill-primary"
                size="md"
                onClick={handleCommitImport}
                isLoading={isProcessing}
                disabled={validationResult.validRows.length === 0}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Import {validationResult.validRows.length} Shipments Now
              </Button>
            </div>
          </div>
        )}

        {/* Import Summary Confirmation */}
        {importSummary && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-elevated text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-brand-navy">
                Batch Successfully Committed!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Generated {importSummary.importedCount} trackable shipments and registered waybills.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="pill-primary"
                onClick={() => router.push('/dashboard/shipments')}
              >
                Go to Shipments Ledger
              </Button>
              <Button
                variant="pill-secondary"
                onClick={() => {
                  setImportSummary(null);
                  setValidationResult(null);
                  setCsvText('');
                }}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Upload Another File
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
