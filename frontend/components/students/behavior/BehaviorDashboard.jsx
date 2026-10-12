"use client";
import React, { useEffect, useMemo, useState } from "react";
import { behaviorApi } from "@/services/api/behaviorApi";
import BehaviorLayout from "./layout/BehaviorLayout";
import DateFilter from "./filters/DateFilter";
import SeverityFilter from "./filters/SeverityFilter";
import StudentFilter from "./filters/StudentFilter";
import IncidentTable from "./incidents/IncidentTable";
import LogIncidentForm from "./logging/LogIncidentForm";
import BehaviorTimeline from "./history/BehaviorTimeline";
import BehaviorReportGenerator from "./reports/BehaviorReportGenerator";
import ParentNotificationPanel from "./notifications/ParentNotificationPanel";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default function BehaviorDashboard() {
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    start: daysAgoISO(29),
    end: todayISO(),
    severity: "",
    studentId: "",
  });

  const [filtersMeta, setFiltersMeta] = useState({ severities: [], categories: [] });

  const [studentSearch, setStudentSearch] = useState("");
  const [students, setStudents] = useState([]);

  const [incidents, setIncidents] = useState([]);
  const [history, setHistory] = useState([]);

  const [selectedIncident, setSelectedIncident] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notifIncidentId, setNotifIncidentId] = useState("");

  const reportFilters = useMemo(
    () => ({
      start: filters.start,
      end: filters.end,
      severity: filters.severity || undefined,
      studentId: filters.studentId || undefined,
    }),
    [filters]
  );

  const fetchStudents = async () => {
    try {
      const out = await behaviorApi.fetchStudents({ search: studentSearch || undefined });
      setStudents(Array.isArray(out) ? out : []);
    } catch {
      setStudents([]);
    }
  };

  const fetchAll = async () => {
    setError("");
    setBusy(false);
    setLoading(true);
    try {
      const [meta, inc, hist, notif] = await Promise.all([
        behaviorApi.fetchFilters(),
        behaviorApi.fetchIncidents({
          start: filters.start,
          end: filters.end,
          severity: filters.severity || undefined,
          studentId: filters.studentId || undefined,
        }),
        behaviorApi.fetchHistory({
          studentId: filters.studentId || undefined,
          start: filters.start,
          end: filters.end,
        }),
        behaviorApi.fetchNotifications({ studentId: filters.studentId || undefined }),
      ]);

      setFiltersMeta({
        severities: meta?.severities || [],
        categories: meta?.categories || [],
      });

      const list = inc?.incidents || [];
      setIncidents(list);

      const h = hist?.incidents || [];
      setHistory(h);

      setNotifications(Array.isArray(notif?.items) ? notif.items : notif || []);

      // keep selected incident consistent with current filtered list
      if (!list.length) {
        setSelectedIncident(null);
        setNotifIncidentId("");
      } else {
        const stillValid = selectedIncident ? list.some((x) => String(x.id) === String(selectedIncident.id)) : false;
        if (!stillValid) {
          setSelectedIncident(list[0]);
          setNotifIncidentId(list[0].id);
        }
      }
    } catch (e) {
      setError(e?.message || "Failed to load behavior module.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // sync student selection from Directory/Profile
    const handler = (e) => {
      const sid = e?.detail?.studentId;
      if (sid) {
        setFilters((p) => ({ ...p, studentId: sid }));
      }
    };
    window.addEventListener("student-selected", handler);
    return () => window.removeEventListener("student-selected", handler);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentStudentId");
      if (stored) setFilters((p) => ({ ...p, studentId: stored }));
    } catch {}
  }, []);

  useEffect(() => {
    // debounce student searching
    const t = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentSearch]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.start, filters.end, filters.severity, filters.studentId]);

  useEffect(() => {
    if (selectedIncident?.id) setNotifIncidentId(selectedIncident.id);
  }, [selectedIncident?.id]);

  const onRefresh = () => fetchAll().catch(() => {});

  return (
    <BehaviorLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Behavior / Discipline</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Log incidents, track behavior history, generate reports, and notify parents based on real backend data.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Button variant="outline" onClick={onRefresh} disabled={busy} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border bg-card p-4 shadow-sm space-y-4">
        <DateFilter value={{ start: filters.start, end: filters.end }} onChange={(v) => setFilters((p) => ({ ...p, start: v.start, end: v.end }))} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5">
            <StudentFilter
              students={students}
              selectedId={filters.studentId}
              onSelect={(v) => setFilters((p) => ({ ...p, studentId: v }))}
              search={studentSearch}
              onSearch={setStudentSearch}
            />
          </div>

          <div className="lg:col-span-3">
            <SeverityFilter
              options={filtersMeta.severities}
              value={filters.severity}
              onChange={(v) => setFilters((p) => ({ ...p, severity: v }))}
            />
          </div>

          <div className="lg:col-span-4 flex justify-end">
            <Button
              onClick={onRefresh}
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading behavior data...</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-6">
            <IncidentTable
              incidents={incidents}
              selectedIncidentId={selectedIncident?.id}
              onSelect={(it) => setSelectedIncident(it)}
            />
            <BehaviorTimeline incidents={history} />
          </div>

          <div className="xl:col-span-5 space-y-6">
            <LogIncidentForm
              studentId={filters.studentId}
              categories={filtersMeta.categories}
              severities={filtersMeta.severities}
              onLogged={() => {
                setBusy(false);
                fetchAll().catch(() => {});
              }}
            />

            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Remarks / Notes</div>
              {selectedIncident ? (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-semibold text-foreground">{selectedIncident.category}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Severity:</span> {selectedIncident.severity}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Status:</span> {selectedIncident.status}
                  </div>
                  {selectedIncident.remarks ? (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">Remarks:</span> {selectedIncident.remarks}
                    </div>
                  ) : null}
                  {selectedIncident.notes ? (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">Notes:</span> {selectedIncident.notes}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-3 text-sm text-muted-foreground">Select an incident from the table to view remarks.</div>
              )}
            </div>

            <BehaviorReportGenerator filters={reportFilters} />

            <ParentNotificationPanel
              studentId={filters.studentId}
              incidentId={notifIncidentId}
              notifications={notifications}
              onSent={() => fetchAll().catch(() => {})}
            />
          </div>
        </div>
      )}
    </BehaviorLayout>
  );
}

