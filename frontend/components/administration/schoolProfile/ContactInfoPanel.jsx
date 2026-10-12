"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Phone, Mail, Globe, Sparkles } from 'lucide-react';

export default function ContactInfoPanel({ contact }) {
  return (
    <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 border-none shadow-xl text-white h-full relative overflow-hidden">
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-200" />
          Global Reach Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10 pt-4">
        <div className="flex items-center gap-4 bg-black/10 p-4 rounded-2xl border border-white/10 hover:bg-black/20 transition-colors">
          <div className="p-3 bg-emerald-400/20 rounded-xl text-emerald-100 border border-emerald-400/30">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-200 uppercase tracking-widest font-bold">Primary Contact</p>
            <p className="text-lg font-semibold">{contact?.phone || '+1 (555) 000-0000'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/10 p-4 rounded-2xl border border-white/10 hover:bg-black/20 transition-colors">
          <div className="p-3 bg-emerald-400/20 rounded-xl text-emerald-100 border border-emerald-400/30">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-emerald-200 uppercase tracking-widest font-bold">Institutional Email</p>
            <p className="text-lg font-semibold truncate">{contact?.email || 'admin@school.edu'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/10 p-4 rounded-2xl border border-white/10 hover:bg-black/20 transition-colors">
          <div className="p-3 bg-emerald-400/20 rounded-xl text-emerald-100 border border-emerald-400/30">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-emerald-200 uppercase tracking-widest font-bold">Official Gateway</p>
            <p className="text-lg font-semibold truncate">{contact?.website || 'www.school.edu'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
