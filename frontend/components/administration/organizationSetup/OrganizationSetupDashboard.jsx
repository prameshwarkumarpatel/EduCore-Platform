"use client";
import React, { useEffect, useState } from 'react';
import { organizationApi } from '@/services/api/organizationApi';
import OrganizationDetailsForm from './OrganizationDetailsForm';
import HierarchyConfigPanel from './HierarchyConfigPanel';
import SystemSettingsPanel from './SystemSettingsPanel';
import PoliciesPanel from './PoliciesPanel';

export default function OrganizationSetupDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    organizationApi.fetchSetupData()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load Organization data:", err);
        setError(err?.message || "Failed to load organization setup.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 flex justify-center text-primary animate-pulse">Loading Organization Setup...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Details + Editable Information */}
      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <OrganizationDetailsForm
        defaults={data?.details}
        onUpdated={(updated) => setData((prev) => ({ ...(prev || {}), details: updated }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Hierarchy Builder */}
        <HierarchyConfigPanel hierarchy={data?.hierarchy} />

        {/* Global System Settings */}
        <SystemSettingsPanel settings={data?.settings} />
      </div>

      {/* Rules & Corporate Policies */}
      <PoliciesPanel policies={data?.policies} />
    </div>
  );
}
