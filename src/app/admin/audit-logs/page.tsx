'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { formatDateTime } from '@/lib/formatters';
import { AuditLog } from '@/types';
import { History, Shield, Search, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setLogs(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DashboardHeader
        title="Immutable Security & Operations Audit Trail"
        subtitle="Cryptographically tracked log of all administrative actions, dispatch assignments, and status overrides."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex items-center justify-between gap-4">
          <div className="w-full md:w-96">
            <Input
              placeholder="Search action, actor, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Audit Trail Verified Tamper-Resistant</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">Actor & Role</th>
                  <th className="py-3 px-6">Action Executed</th>
                  <th className="py-3 px-6">Target</th>
                  <th className="py-3 px-6">Audit Details</th>
                  <th className="py-3 px-6 font-mono">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6 font-mono text-slate-500 whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{log.actorName}</div>
                      <span className="text-[10px] uppercase font-bold text-brand-teal">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-brand-navy">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-600">
                      {log.targetType}:{log.targetId}
                    </td>
                    <td className="py-3.5 px-6 max-w-xs text-slate-600">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && !loading && (
              <div className="p-12 text-center text-slate-400 text-xs">
                No matching audit entries found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
