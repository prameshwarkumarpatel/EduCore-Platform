"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Quote, Calendar } from 'lucide-react';

export default function SchoolProfileCard({ profile }) {
  return (
    <Card className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 border-none shadow-2xl text-white relative overflow-hidden group min-h-[220px]">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-700" />
      <CardContent className="p-8 relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-32 h-32 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md flex items-center justify-center p-4 shadow-inner group-hover:bg-white/20 transition-all duration-500">
           {profile?.logo_url ? (
             <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain drop-shadow-lg" />
           ) : (
             <GraduationCap className="w-16 h-16 text-blue-100" />
           )}
        </div>
        
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-4xl font-black tracking-tighter drop-shadow-md mb-1">{profile?.name || 'EduPro Academy'}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100 font-medium">
              <Calendar className="w-4 h-4" />
              <span>Established {profile?.established_year || '1998'}</span>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 italic text-blue-50 flex gap-3 items-start backdrop-blur-sm">
            <Quote className="w-5 h-5 text-blue-300 shrink-0 mt-1" />
            <p className="text-lg leading-relaxed">&quot;{profile?.motto || 'Empowering Minds, Shaping Futures'}&quot;</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
