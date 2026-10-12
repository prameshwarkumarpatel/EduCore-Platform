"use client";
import React, { useEffect, useState } from "react";
import StaffLayout from "./layout/StaffLayout";
import StaffTopbar from "./layout/StaffTopbar";
import TotalStaffCard from "./overview/TotalStaffCard";
import StaffRatioCard from "./overview/StaffRatioCard";
import DepartmentDistributionCard from "./overview/DepartmentDistributionCard";
import WorkloadSummaryPanel from "./workload/WorkloadSummaryPanel";
import StaffAttendanceCard from "./attendance/StaffAttendanceCard";
import AttendanceTrendChart from "./attendance/AttendanceTrendChart";
import PayrollSummaryCard from "./payroll/PayrollSummaryCard";
import PayrollStatsPanel from "./payroll/PayrollStatsPanel";
import RecentActivitiesList from "./activities/RecentActivitiesList";
import PendingTasksPanel from "./tasks/PendingTasksPanel";
import StaffAnalyticsChart from "./analytics/StaffAnalyticsChart";
import InsightsCard from "./analytics/InsightsCard";
import QuickActionsPanel from "./quickActions/QuickActionsPanel";
import { staffDashboardApi } from "@/services/api/staffDashboardApi";

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [s, w, a, p, act, t] = await Promise.all([
        staffDashboardApi.fetchStaffStats(),
        staffDashboardApi.fetchWorkload(),
        staffDashboardApi.fetchAttendance(),
        staffDashboardApi.fetchPayrollSummary(),
        staffDashboardApi.fetchActivities(),
        staffDashboardApi.fetchPendingTasks(),
      ]);
      setStats(s || {});
      setWorkload(w || {});
      setAttendance(a || {});
      setPayroll(p || {});
      setActivities(Array.isArray(act) ? act : []);
      setTasks(Array.isArray(t) ? t : []);
    } catch (e) {
      setError(e?.message || "Failed to load staff dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <StaffLayout>
      <StaffTopbar onRefresh={load} loading={loading} />

      {error ? <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading staff dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-3"><TotalStaffCard total={stats?.totalStaff} /></div>
            <div className="xl:col-span-4"><StaffRatioCard teachers={stats?.teachers} nonTeaching={stats?.nonTeaching} /></div>
            <div className="xl:col-span-5"><DepartmentDistributionCard items={stats?.departmentDistribution || []} /></div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8"><WorkloadSummaryPanel data={workload} /></div>
            <div className="xl:col-span-4 space-y-6">
              <StaffAttendanceCard data={attendance} />
              <AttendanceTrendChart trend={attendance?.trend || []} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4"><PayrollSummaryCard payroll={payroll} /></div>
            <div className="xl:col-span-4"><PayrollStatsPanel payroll={payroll} /></div>
            <div className="xl:col-span-4"><QuickActionsPanel /></div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4"><RecentActivitiesList items={activities} /></div>
            <div className="xl:col-span-4"><PendingTasksPanel items={tasks} /></div>
            <div className="xl:col-span-2"><StaffAnalyticsChart stats={stats} /></div>
            <div className="xl:col-span-2"><InsightsCard stats={stats} attendance={attendance} /></div>
          </div>
        </>
      )}
    </StaffLayout>
  );
}

