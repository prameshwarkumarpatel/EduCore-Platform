"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, Building2, CalendarDays, Banknote, Megaphone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const ModuleCard = ({ title, desc, icon: Icon, href }) => (
  <Link href={href || '#'}>
    <div className="bg-gradient-to-br from-purple-900 to-purple-700 p-5 rounded-xl text-white shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/30 transition-all cursor-pointer relative overflow-hidden group border border-purple-500/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
          <Icon className="w-6 h-6 text-purple-100" />
        </div>
        <div>
          <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
          <p className="text-xs text-purple-200 mt-0.5">{desc}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default function AdminModulesGrid({ branches, roles }) {
  const adminModules = [
    { title: "Student Mgmt", desc: "Enrollments & profiles", icon: Users, href: "/students/dashboard" },
    { title: "Teacher Mgmt", desc: "Staff directory & payload", icon: GraduationCap, href: "/dashboard/teachers" },
    { title: "Class Mgmt", desc: "Sections & subjects", icon: Building2, href: "/dashboard/academics" },
    { title: "Attendance", desc: "Global tracking logs", icon: CalendarDays, href: "/dashboard/attendance" },
    { title: "Fees & Finance", desc: "Revenue & structures", icon: Banknote, href: "/dashboard/finance" },
    { title: "Announcements", desc: "Circulars & notices", icon: Megaphone, href: "/dashboard/communication" },
    { title: "Roles & Access", desc: `${roles?.length || 5} permission groups`, icon: ShieldCheck, href: "/dashboard/administration" },
    { title: "Branch Setup", desc: `${branches?.total || 4} total campuses`, icon: Building2, href: "/dashboard/administration" },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Core Modules Administration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adminModules.map((mod, idx) => (
            <ModuleCard key={idx} {...mod} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
