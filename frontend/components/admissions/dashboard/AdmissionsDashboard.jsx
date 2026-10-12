"use client";
import React, { useEffect, useState } from "react";
import AdmissionsLayout from "./layout/AdmissionsLayout";
import AdmissionsTopbar from "./layout/AdmissionsTopbar";
import AdmissionsOverviewPanel from "./overview/AdmissionsOverviewPanel";
import DateRangeFilter from "./overview/DateRangeFilter";
import AdmissionTrendsChart from "./analytics/AdmissionTrendsChart";
import RecentApplicationsPanel from "./applications/RecentApplicationsPanel";
import AdmissionNotifications from "./notifications/AdmissionNotifications";
import AdmissionQuickActions from "./actions/AdmissionQuickActions";
import { admissionsApi } from "@/services/api/admissionsApi";
import { useRouter } from "next/navigation";

export default function AdmissionsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const load = async (params) => {
    setError("");
    setLoading(true);
    try {
      const res = await admissionsApi.fetchDashboard(params);
      setData(res);
    } catch (e) {
      setError(e?.message || "Failed to load admissions data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({});
  }, []);

  const handleRangeChange = (next) => {
    setRange(next);
    const params = {};
    if (next.from) params.from = next.from;
    if (next.to) params.to = next.to;
    load(params).catch(() => {});
  };

  const handleUpdateLatestPending = async (status) => {
    if (!data || !data.recentApplications || !data.recentApplications.length) return;
    const pending = data.recentApplications.find((a) => a.status === "Pending");
    if (!pending) return;
    setBusy(true);
    setError("");
    try {
      await admissionsApi.updateApplicationStatus(pending.id, status);
      await load(range.from || range.to ? { from: range.from, to: range.to } : {});
    } catch (e) {
      setError(e?.message || "Failed to update application status.");
    } finally {
      setBusy(false);
    }
  };

  if (loading && !data) {
    return (
      <AdmissionsLayout>
        <div className="p-10 text-center animate-pulse text-primary">
          Initializing admissions dashboard...
        </div>
      </AdmissionsLayout>
    );
  }

  return (
    <AdmissionsLayout>
      <AdmissionsTopbar onDateFilter={() => {}} onNewApplication={() => router.push("/admissions/new-application")} />
      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        <DateRangeFilter from={range.from} to={range.to} onChange={handleRangeChange} />

        <AdmissionsOverviewPanel total={data?.total || 0} byStatus={data?.byStatus} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdmissionTrendsChart trends={data?.trends || []} />
          </div>
          <div className="lg:col-span-1 space-y-4">
            <AdmissionNotifications notifications={data?.notifications || []} />
            <AdmissionQuickActions
              onNew={() => router.push("/admissions/new-application")}
              onApprove={() => handleUpdateLatestPending("Approved")}
              onReject={() => handleUpdateLatestPending("Rejected")}
            />
          </div>
        </div>

        <RecentApplicationsPanel applications={data?.recentApplications || []} />
      </div>
    </AdmissionsLayout>
  );
}

