"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Globe, Navigation, Phone, Mail } from 'lucide-react';

export default function BranchLocationPanel({ branch }) {
  return (
    <Card className="bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-800 border-none shadow-xl text-white relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-200" />
          Geographic HQ Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10 pt-4">
        <div className="flex gap-4 items-start bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md">
          <div className="p-3 bg-indigo-500/30 rounded-full text-indigo-50 border border-indigo-300/40 mt-1 shadow-inner">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Campus Coordinates</h3>
            <p className="text-xl font-bold leading-tight">{branch.address.street}</p>
            <p className="text-lg text-indigo-50/80 font-medium italic">{branch.address.city}, {branch.address.state} {branch.address.zip}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-black/30 transition-all cursor-alias">
             <Phone className="w-5 h-5 text-indigo-300" />
             <div className="min-w-0">
               <p className="text-[10px] text-indigo-200 font-bold uppercase">Hotline</p>
               <p className="text-sm font-semibold truncate">{branch.contact.phone}</p>
             </div>
           </div>
           <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-black/30 transition-all cursor-alias">
             <Mail className="w-5 h-5 text-indigo-300" />
             <div className="min-w-0">
               <p className="text-[10px] text-indigo-200 font-bold uppercase">Institutional Email</p>
               <p className="text-sm font-semibold truncate">{branch.contact.email}</p>
             </div>
           </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-indigo-100/80">
          <div className="flex items-center gap-2">
             <Navigation className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
             <span>Regional HQ Visibility: Private</span>
          </div>
          <span>Active Nodes: 03</span>
        </div>
      </CardContent>
    </Card>
  );
}
