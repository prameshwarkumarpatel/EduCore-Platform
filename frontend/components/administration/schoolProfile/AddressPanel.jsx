"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, Landmark } from 'lucide-react';

export default function AddressPanel({ address }) {
  return (
    <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-none shadow-xl text-white h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-100" />
          Physical Campus Logic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10 pt-4">
        <div className="flex gap-4 items-start bg-white/10 p-5 rounded-2xl border border-white/10">
          <div className="p-3 bg-amber-400/30 rounded-full text-amber-50 border border-amber-300/40 mt-1">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-100">Main Street Address</h3>
            <p className="text-xl font-bold leading-tight">{address?.street || '789 Education Valley'}</p>
            <p className="text-lg text-amber-50/80">{address?.city}, {address?.state} {address?.zip}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/10 p-5 rounded-xl border border-white/5 group hover:bg-black/20 transition-all cursor-crosshair">
          <Navigation className="w-6 h-6 text-amber-300 animate-pulse group-hover:scale-125 transition-transform" />
          <div>
            <p className="text-xs text-amber-200 font-bold uppercase tracking-widest">Global Coordinates</p>
            <p className="font-mono text-sm opacity-80">{address?.country || 'USA'} Region</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
