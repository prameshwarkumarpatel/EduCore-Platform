"use client";
import React, { useEffect, useState, useMemo } from "react";
import { staffAttendanceApi } from "@/services/api/staffAttendanceApi";
import AttendanceLayout from "./layout/AttendanceLayout";
import AttendanceTopbar from "./layout/AttendanceTopbar";
import AttendanceSidebar from "./layout/AttendanceSidebar";
import DateFilter from "./filters/DateFilter";
import StaffFilter from "./filters/StaffFilter";
import StatusFilter from "./filters/StatusFilter";
import AttendanceMarkingPanel from "./marking/AttendanceMarkingPanel";
import DailyAttendanceTable from "./logs/DailyAttendanceTable";
import MonthlyAttendanceTable from "./logs/MonthlyAttendanceTable";
import AttendanceReportPanel from "./reports/AttendanceReportPanel";
import AttendanceChart from "./reports/AttendanceChart";
import LeaveIntegrationPanel from "./leave/LeaveIntegrationPanel";
import AbsenteeAlertPanel from "./alerts/AbsenteeAlertPanel";

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function StaffAttendanceDashboard() {
  const now = new Date();
  const [meta, setMeta] = useState({ staff: [], departments: [], statuses: [] });
  const [filters, setFilters] = useState({
    date: todayStr(),
    staffId: "",
    department: "",
    status: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    threshold: 3,
  });
  const [daily, setDaily] = useState({ date: "", items: [] });
  const [monthly, setMonthly] = useState({ month: 0, year: 0, items: [] });
  const [leave, setLeave] = useState({ items: [] });
  const [alerts, setAlerts] = useState({ items: [] });
  const [report, setReport] = useState(null);
  const [draftById, setDraftById] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [m, d, mon, l, a] = await Promise.all([
        staffAttendanceApi.fetchMeta(),
        staffAttendanceApi.fetchDailyAttendance({ date: filters.date, staffId: filters.staffId, department: filters.department }),
        staffAttendanceApi.fetchMonthlyAttendance({ month: filters.month, year: filters.year, staffId: filters.staffId, department: filters.department }),
        staffAttendanceApi.fetchLeaveData({ startDate: filters.date, endDate: filters.date }),
        staffAttendanceApi.fetchAlerts({ month: filters.month, year: filters.year, threshold: filters.threshold }),
      ]);
      setMeta(m || { staff: [], departments: [], statuses: [] });
      setDaily(d || { date: filters.date, items: [] });
      setMonthly(mon || { month: filters.month, year: filters.year, items: [] });
      setLeave(l || { items: [] });
      setAlerts(a || { items: [] });
      setDraftById({});
    } catch (e) {
      setError(e.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.date, filters.staffId, filters.department, filters.month, filters.year, filters.threshold]);

  const onToggle = (staffId, status) => {
    setDraftById((prev) => ({ ...prev, [staffId]: status }));
  };

  const onMarkAll = (status) => {
    const next = {};
    daily.items.forEach((r) => { next[r.id] = status; });
    setDraftById(next);
  };

  const onSave = async () => {
    const records = (daily.items || []).map((r) => ({
      staffId: r.id,
      status: draftById[r.id] ?? r.status ?? "Present",
    }));
    setActionBusy(true);
    setError("");
    setSuccess("");
    try {
      await staffAttendanceApi.markAttendance({ date: filters.date, records, lockDay: true });
      setSuccess("Attendance saved and locked for this date.");
      await load();
    } catch (e) {
      setError(e.message || "Failed to save attendance");
    } finally {
      setActionBusy(false);
    }
  };

  const onDownload = () => {
    if (!report?.csv) return;
    const blob = new Blob(["\ufeff" + report.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = report.reportName || "staff-attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onGenerate = async () => {
    setActionBusy(true);
    setError("");
    setSuccess("");
    try {
      const out = await staffAttendanceApi.generateReport({
        month: filters.month,
        year: filters.year,
        staffId: filters.staffId,
        department: filters.department,
      });
      setReport(out);
      setSuccess("Report generated. Click Download CSV to save the file.");
    } catch (e) {
      setError(e.message || "Failed to generate report");
    } finally {
      setActionBusy(false);
    }
  };

  const dailyFiltered = useMemo(() => {
    let list = daily.items || [];
    if (filters.status) list = list.filter((r) => (draftById[r.id] ?? r.status) === filters.status);
    return list;
  }, [daily.items, filters.status, draftById]);

  return (
    <AttendanceLayout>
      <AttendanceTopbar />

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] gap-4">
        <AttendanceSidebar />
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">Filters</div>
            <div className="flex flex-wrap gap-2">
              <DateFilter value={filters.date} onChange={(date) => setFilters((s) => ({ ...s, date }))} />
              <StaffFilter staff={meta.staff} value={filters.staffId} onChange={(staffId) => setFilters((s) => ({ ...s, staffId }))} />
              <StatusFilter statuses={meta.statuses} value={filters.status} onChange={(status) => setFilters((s) => ({ ...s, status }))} />
              <select
                value={`${filters.month}-${filters.year}`}
                onChange={(e) => {
                  const [m, y] = e.target.value.split("-").map(Number);
                  setFilters((s) => ({ ...s, month: m, year: y }));
                }}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {Array.from({ length: 6 }, (_, i) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - i);
                  const m = d.getMonth() + 1;
                  const y = d.getFullYear();
                  return <option key={`${m}-${y}`} value={`${m}-${y}`}>{y}-{String(m).padStart(2, "0")}</option>;
                })}
              </select>
              <button
                type="button"
                onClick={() => setFilters({ date: todayStr(), staffId: "", department: "", status: "", month: now.getMonth() + 1, year: now.getFullYear(), threshold: 3 })}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm hover:bg-muted"
              >
                Reset
              </button>
            </div>
          </div>

          {error ? <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
          {success ? <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">{success}</div> : null}
          {loading ? <div className="p-8 text-center text-primary animate-pulse">Loading attendance...</div> : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AttendanceMarkingPanel
              items={daily.items || []}
              date={filters.date}
              draftById={draftById}
              onToggle={onToggle}
              onMarkAll={onMarkAll}
              onSave={onSave}
              busy={actionBusy}
              isLocked={daily.isLocked}
            />
            <DailyAttendanceTable items={dailyFiltered} date={filters.date} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MonthlyAttendanceTable items={monthly.items || []} month={filters.month} year={filters.year} />
            <AttendanceChart monthlyItems={monthly.items || []} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AttendanceReportPanel onGenerate={onGenerate} onDownload={onDownload} report={report} loading={actionBusy} />
            <LeaveIntegrationPanel items={leave.items || []} />
          </div>

          <AbsenteeAlertPanel items={alerts.items || []} threshold={filters.threshold} />

        </div>
      </div>
    </AttendanceLayout>
  );
}
