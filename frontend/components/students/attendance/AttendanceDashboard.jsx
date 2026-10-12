"use client";
import React, { useEffect, useMemo, useState } from "react";
import AttendanceLayout from "./layout/AttendanceLayout";
import DateFilter from "./filters/DateFilter";
import ClassFilter from "./filters/ClassFilter";
import SectionFilter from "./filters/SectionFilter";
import AttendanceTable from "./logs/AttendanceTable";
import MarkAttendancePanel from "./marking/MarkAttendancePanel";
import AttendanceSummaryCard from "./overview/AttendanceSummaryCard";
import WeeklyAttendanceChart from "./overview/WeeklyAttendanceChart";
import MonthlyAttendanceChart from "./overview/MonthlyAttendanceChart";
import AttendanceReportGenerator from "./reports/AttendanceReportGenerator";
import LowAttendanceAlertPanel from "./alerts/LowAttendanceAlertPanel";
import { attendanceApi } from "@/services/api/attendanceApi";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default function AttendanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    date: todayISO(),
    className: "",
    section: "",
    start: daysAgoISO(29),
    end: todayISO(),
  });

  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [logs, setLogs] = useState([]);
  const [draftById, setDraftById] = useState({});

  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [alertThreshold, setAlertThreshold] = useState(75);

  const selectedClass = filters.className || "";
  const selectedSection = filters.section || "";

  const fetchAll = async () => {
    setError("");
    setBusy(false);
    setLoading(true);
    try {
      const [f, logsRes, sumRes, weeklyRes, monthlyRes, lowRes] = await Promise.all([
        attendanceApi.fetchFilters(),
        attendanceApi.fetchLogs({
          date: filters.date,
          assignedClass: selectedClass || undefined,
          assignedSection: selectedSection || undefined,
        }),
        attendanceApi.fetchSummary({
          start: filters.start,
          end: filters.end,
          assignedClass: selectedClass || undefined,
          assignedSection: selectedSection || undefined,
        }),
        attendanceApi.fetchTrends({
          start: daysAgoISO(41),
          end: filters.end,
          assignedClass: selectedClass || undefined,
          assignedSection: selectedSection || undefined,
          period: "weekly",
        }),
        attendanceApi.fetchTrends({
          start: daysAgoISO(365),
          end: filters.end,
          assignedClass: selectedClass || undefined,
          assignedSection: selectedSection || undefined,
          period: "monthly",
        }),
        attendanceApi.fetchLowAlerts({
          start: filters.start,
          end: filters.end,
          threshold: alertThreshold,
          assignedClass: selectedClass || undefined,
          assignedSection: selectedSection || undefined,
        }),
      ]);

      setClassOptions(f?.classes || []);
      setSectionOptions(f?.sections || []);
      setLogs(Array.isArray(logsRes) ? logsRes : []);
      setDraftById(
        (Array.isArray(logsRes) ? logsRes : []).reduce((acc, r) => {
          acc[r.id] = r.attendance === "Unmarked" ? "Present" : r.attendance;
          return acc;
        }, {})
      );
      setSummary(sumRes || null);
      setWeekly(Array.isArray(weeklyRes?.points) ? weeklyRes.points : []);
      setMonthly(Array.isArray(monthlyRes?.points) ? monthlyRes.points : []);
      setAlerts(Array.isArray(lowRes?.items) ? lowRes.items : []);
    } catch (e) {
      setError(e?.message || "Failed to load attendance module.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async () => {
    if (!filters.date) return;
    setBusy(true);
    setError("");
    try {
      const records = logs.map((r) => {
        const status = draftById[r.id] || r.attendance || "Present";
        return { studentId: r.id, status };
      });
      await attendanceApi.markAttendance({
        date: filters.date,
        assignedClass: selectedClass,
        assignedSection: selectedSection,
        records,
      });
      await fetchAll();
    } catch (e) {
      setError(e?.message || "Failed to save attendance.");
    } finally {
      setBusy(false);
    }
  };

  const markAll = (status) => {
    const next = {};
    logs.forEach((r) => {
      next[r.id] = status;
    });
    setDraftById(next);
  };

  const toggleDraft = (id, status) => {
    setDraftById((prev) => ({ ...prev, [id]: status }));
  };

  const onRefresh = () => fetchAll().catch(() => {});

  const pageTitle = "Attendance";

  // Disabled state: waiting for filters/date
  const canMark = Boolean(filters.date);

  return (
    <AttendanceLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Track daily attendance, analyze trends, generate reports, and act on low attendance alerts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Button variant="outline" onClick={onRefresh} disabled={busy} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border bg-card p-4 shadow-sm">
        <DateFilter
          date={filters.date}
          onChange={(v) => setFilters((p) => ({ ...p, date: v }))}
          start={filters.start}
          end={filters.end}
          onRangeChange={(r) => setFilters((p) => ({ ...p, start: r.start, end: r.end }))}
        />

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          <ClassFilter
            options={classOptions}
            value={filters.className}
            onChange={(v) => setFilters((p) => ({ ...p, className: v, section: "" }))}
          />
          <SectionFilter
            options={sectionOptions}
            value={filters.section}
            disabled={!filters.className && sectionOptions.length > 0}
            onChange={(v) => setFilters((p) => ({ ...p, section: v }))}
          />
          <div className="flex items-end justify-end">
            <Button
              onClick={() => fetchAll().catch(() => {})}
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
          </div>
        </div>

        {error ? <div className="mt-3 text-sm text-rose-300">{error}</div> : null}
      </div>

      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading attendance...</div>
      ) : (
        <div className="mt-6 space-y-6">
          <AttendanceSummaryCard summary={summary} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyAttendanceChart points={weekly} />
                <MonthlyAttendanceChart points={monthly} />
              </div>

              <AttendanceTable rows={logs} />
            </div>

            <div className="xl:col-span-5 space-y-6">
              <MarkAttendancePanel
                rows={logs}
                draftById={draftById}
                onToggle={toggleDraft}
                onMarkAll={markAll}
                onSave={onSave}
                busy={busy || !canMark}
              />

              <div className="rounded-2xl border bg-card p-4 shadow-sm space-y-4">
                <AttendanceReportGenerator
                  start={filters.start}
                  end={filters.end}
                  assignedClass={selectedClass}
                  assignedSection={selectedSection}
                  onRangeChange={(r) => setFilters((p) => ({ ...p, start: r.start, end: r.end }))}
                  disabled={busy}
                />

                <div className="space-y-2">
                  <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Low attendance threshold</div>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(Number(e.target.value))}
                    className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => fetchAll().catch(() => {})}
                    disabled={loading || busy}
                    className="w-full"
                  >
                    Refresh Alerts
                  </Button>
                </div>
              </div>

              <LowAttendanceAlertPanel items={alerts} threshold={alertThreshold} />
            </div>
          </div>
        </div>
      )}
    </AttendanceLayout>
  );
}

