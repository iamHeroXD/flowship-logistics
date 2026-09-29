'use client';

import React from 'react';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MapCoordinates {
  lat: number;
  lng: number;
  label?: string;
}

export interface InteractiveMapProps {
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  currentLocation?: MapCoordinates;
  stops?: MapCoordinates[];
  height?: string;
  className?: string;
  zoom?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin = { lat: 40.7128, lng: -74.006, label: 'Origin' },
  destination = { lat: 40.7589, lng: -73.9851, label: 'Destination' },
  currentLocation,
  stops = [],
  height = '360px',
  className,
}) => {
  return (
    <div
      style={{ height }}
      className={cn(
        'relative w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-200 shadow-inner flex flex-col justify-between p-4',
        className
      )}
    >
      {/* Visual Cartographic Map Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* SVG Simulated Transit Corridor Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 360">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2ea88b" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1e3a47" />
          </linearGradient>
        </defs>

        {/* Ambient road grid lines */}
        <path d="M 0 120 Q 300 90 600 140" stroke="#334155" strokeWidth="2" fill="none" />
        <path d="M 0 240 Q 250 280 600 210" stroke="#334155" strokeWidth="2" fill="none" />
        <path d="M 180 0 Q 220 200 190 360" stroke="#334155" strokeWidth="2" fill="none" />
        <path d="M 420 0 Q 380 180 430 360" stroke="#334155" strokeWidth="2" fill="none" />

        {/* Active Freight Transit Corridor */}
        <path
          d="M 120 250 C 220 240, 280 140, 480 100"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeDasharray="6 4"
          fill="none"
          className="animate-pulse"
        />

        {/* Origin Node */}
        <circle cx="120" cy="250" r="7" fill="#2ea88b" stroke="#ffffff" strokeWidth="2" />

        {/* Live In-Transit Vehicle Node */}
        {currentLocation && (
          <g transform="translate(280, 160)">
            <circle cx="0" cy="0" r="14" fill="#38bdf8" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          </g>
        )}

        {/* Destination Node */}
        <circle cx="480" cy="100" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
      </svg>

      {/* Top Map HUD Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white rounded-xl px-3 py-1.5 text-xs flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-brand-mint animate-spin-slow" />
          <span className="font-mono">TELEMETRY: ACTIVE</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 p-1.5 rounded-lg text-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-300 p-1.5 rounded-lg text-xs">
            <Compass className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bottom Map Waypoint Summary */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs text-white">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-mint" />
          <span className="text-slate-400">Origin:</span>
          <span className="font-semibold text-white truncate max-w-[140px]">
            {origin.label || `${origin.lat.toFixed(3)}, ${origin.lng.toFixed(3)}`}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-500 font-mono">
          &bull;&bull;&bull;&bull;&bull;&bull;
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-400">Destination:</span>
          <span className="font-semibold text-white truncate max-w-[140px]">
            {destination.label || `${destination.lat.toFixed(3)}, ${destination.lng.toFixed(3)}`}
          </span>
        </div>
      </div>
    </div>
  );
};
