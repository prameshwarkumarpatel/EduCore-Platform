"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, KeyRound, Building, CalendarCheck2 } from 'lucide-react';

const KPICard = ({ title, value, subtext, icon: Icon, gradient }) => (
  <Card className={`border-none text-white shadow-md relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${gradient}`}>
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold opacity-90">{title}</h3>
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold">{value || '...'}</h2>
        <p className="text-xs mt-2 opacity-80 font-medium">{subtext}</p>
      </div>
    </CardContent>
  </Card>
);

export default function AdminKPICards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard 
        title="Total Users" 
        value={data?.users?.total?.toLocaleString()} 
        subtext={data?.users?.growth || "Active across all branches"}
        icon={Users}
        gradient="bg-gradient-to-r from-emerald-500 to-teal-400 hover:shadow-teal-500/20"
      />
      <KPICard 
        title="Active Roles" 
        value={data?.roles?.length || 0} 
        subtext="Configured permission levels"
        icon={KeyRound}
        gradient="bg-gradient-to-r from-orange-500 to-amber-400 hover:shadow-orange-500/20"
      />
      <KPICard 
        title="Total Branches" 
        value={data?.branches?.total || 0} 
        subtext={`${data?.branches?.active || 0} Active Campuses`}
        icon={Building}
        gradient="bg-gradient-to-r from-indigo-500 to-blue-400 hover:shadow-indigo-500/20"
      />
      <KPICard 
        title="Academic Year" 
        value={data?.academicYear?.currentYear || '...'} 
        subtext={data?.academicYear?.status === 'Ongoing' ? `${data?.academicYear?.daysRemaining} days remaining` : data?.academicYear?.status}
        icon={CalendarCheck2}
        gradient="bg-gradient-to-r from-rose-500 to-pink-400 hover:shadow-rose-500/20"
      />
    </div>
  );
}
