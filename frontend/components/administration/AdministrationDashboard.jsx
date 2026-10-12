"use client";
import React, { useEffect, useState } from 'react';
import { administrationApi } from '@/services/api/administrationApi';
import AdminOverviewPanel from './overview/AdminOverviewPanel';
import AdminKPICards from './kpi/AdminKPICards';
import AdminModulesGrid from './modules/AdminModulesGrid';
import QuickActionsPanel from './actions/QuickActionsPanel';
import AdminActivityPanel from './activity/AdminActivityPanel';
import AdminNotifications from './notifications/AdminNotifications';

export default function AdministrationDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    administrationApi.fetchDashboardData()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch Admin Data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 flex items-center justify-center animate-pulse text-primary">Loading Administration Control Panel...</div>;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <AdminOverviewPanel data={data?.overview} />
        </div>
        <div className="lg:col-span-1">
          <QuickActionsPanel />
        </div>
      </div>

      {/* KPI Summary */}
      <AdminKPICards data={data} />

      {/* Modules Grid */}
      <AdminModulesGrid branches={data?.branches} roles={data?.roles} />

      {/* Bottom Section: Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminActivityPanel activities={data?.activities} />
        </div>
        <div className="lg:col-span-1">
          <AdminNotifications notifications={data?.notifications} />
        </div>
      </div>
    </div>
  );
}
