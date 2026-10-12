"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Server, Clock } from 'lucide-react';

export default function AdminOverviewPanel({ data }) {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 border-none text-white shadow-lg overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">System Overview</h2>
            <p className="text-blue-100 max-w-md">
              Welcome to the central control panel. Monitor health, active users, and global parameters from a unified interface.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-cyan-200" />
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Status</p>
                <p className="text-lg font-bold">{data?.systemState || 'Checking...'}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-3">
              <Server className="w-8 h-8 text-cyan-200" />
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Uptime</p>
                <p className="text-lg font-bold">{data?.uptime || '...'}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-cyan-200" />
              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Last Backup</p>
                <p className="text-lg font-bold">{data?.lastBackup || '...'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
