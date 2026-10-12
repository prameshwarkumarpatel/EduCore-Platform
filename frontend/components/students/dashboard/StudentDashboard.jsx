"use client";
import React, { useEffect, useMemo, useState } from "react";
import { studentDashboardApi } from "@/services/api/studentDashboardApi";
import StudentLayout from "./layout/StudentLayout";
import DateRangeFilter from "./overview/DateRangeFilter";
import StudentOverviewPanel from "./overview/StudentOverviewPanel";
import AnalyticsContainer from "./analytics/AnalyticsContainer";
import RecentActivitiesPanel from "./activities/RecentActivitiesPanel";
import PendingApprovalsPanel from "./approvals/PendingApprovalsPanel";
import StudentAlertsPanel from "./alerts/StudentAlertsPanel";
import StudentQuickActions from "./actions/StudentQuickActions";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default function StudentDashboard() {
  const [range, setRange] = useState({ start: daysAgoISO(29), end: todayISO() });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await studentDashboardApi.fetchDashboard({ start: range.start, end: range.end });
      setData(res);
    } catch (e) {
      setError(e?.message || "Failed to load student dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.start, range.end]);

  useEffect(() => {
    const handler = () => {
      load().catch(() => {});
    };
    window.addEventListener("student-directory-updated", handler);
    return () => window.removeEventListener("student-directory-updated", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.start, range.end]);

  const filteredActivities = useMemo(() => {
    const list = data?.recentActivities || [];
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter((x) => String(x.action || "").toLowerCase().includes(q) || String(x.subject || "").toLowerCase().includes(q));
  }, [data?.recentActivities, search]);

  return (
    <StudentLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Mgmt Dashboard</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Centralized student metrics: distribution, attendance insights, recent activity, approvals, and alerts.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activities..." className="pl-10" />
          </div>
          <DateRangeFilter value={range} onChange={setRange} />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading && !data ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading student dashboard...</div>
      ) : (
        <>
          <StudentOverviewPanel totalStudents={data?.totalStudents} gradeDistribution={data?.gradeDistribution} />

          <AnalyticsContainer attendance={data?.attendance} gradeDistribution={data?.gradeDistribution} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 space-y-6">
              <RecentActivitiesPanel items={filteredActivities} />
              <StudentQuickActions />
            </div>
            <div className="xl:col-span-5 space-y-6">
              <PendingApprovalsPanel items={data?.pendingApprovals} />
              <StudentAlertsPanel items={data?.alerts} />
            </div>
          </div>
        </>
      )}
    </StudentLayout>
  );
}

