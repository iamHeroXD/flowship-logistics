'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/Button';
import { Route, MapPin, Clock, ArrowRight, CheckCircle2, Shuffle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function DispatcherRoutesPage() {
  const { success } = useToast();

  const [stops, setStops] = useState([
    { id: 1, name: 'Origin Terminal: Newark Logistics Hub', address: '750 Logistics Blvd, Newark, NJ', timeWindow: '08:00 - 09:30', dist: '0.0 km' },
    { id: 2, name: 'Stop 1: Apex Robotics Assembly', address: '725 Gateway Blvd, Jersey City, NJ', timeWindow: '10:00 - 11:00', dist: '12.4 km' },
    { id: 3, name: 'Stop 2: Hudson Tech Research', address: '180 Varick St, New York, NY', timeWindow: '12:30 - 13:30', dist: '8.2 km' },
    { id: 4, name: 'Stop 3: Empire State Suite 540', address: '350 5th Ave, New York, NY', timeWindow: '14:00 - 15:00', dist: '4.6 km' },
    { id: 5, name: 'Stop 4: Brooklyn Marine Terminal', address: '600 Atlantic Ave, Brooklyn, NY', timeWindow: '16:00 - 17:00', dist: '11.8 km' },
  ]);

  const [optimizing, setOptimizing] = useState(false);

  const handleOptimizeRoute = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      success('Route optimized using Dijkstra geodesic algorithm! Saved 6.2 km and 28 minutes transit time.');
    }, 700);
  };

  return (
    <>
      <DashboardHeader
        title="Corridor Route Sequencing"
        subtitle="Multi-stop delivery optimization, turn-by-turn waypoint ordering, and fuel saving telemetry."
      />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-brand-surface px-3 py-1 rounded-full border border-slate-200 inline-block mb-2">
              Route Corridor #NY-METRO-04
            </span>
            <h2 className="text-xl font-bold text-brand-navy">Carlos Mendoza &bull; Ford E-Transit (FS-982-NY)</h2>
            <p className="text-xs text-slate-500 mt-1">
              5 Planned Waypoint Stops &bull; Total Estimated Distance: 37.0 km &bull; Projected Duration: 3h 40m
            </p>
          </div>

          <Button
            variant="pill-primary"
            size="md"
            onClick={handleOptimizeRoute}
            isLoading={optimizing}
            leftIcon={<Shuffle className="w-4 h-4" />}
          >
            Optimize Waypoint Sequence
          </Button>
        </div>

        {/* Stops Sequence Cards */}
        <div className="space-y-3">
          {stops.map((stop, idx) => (
            <div
              key={stop.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    idx === 0
                      ? 'bg-brand-navy text-white'
                      : idx === stops.length - 1
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  #{idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-navy">{stop.name}</h3>
                  <p className="text-xs text-slate-500">{stop.address}</p>
                </div>
              </div>

              <div className="text-right text-xs shrink-0">
                <span className="font-semibold text-slate-700 block">{stop.timeWindow}</span>
                <span className="text-slate-400 font-mono text-[11px]">{stop.dist} leg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
