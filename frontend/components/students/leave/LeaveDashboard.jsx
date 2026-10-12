"use client";
import React, { useEffect, useMemo, useState } from "react";
import LeaveLayout from "./layout/LeaveLayout";
import DateFilter from "./filters/DateFilter";
import StatusFilter from "./filters/StatusFilter";
import StudentFilter from "./filters/StudentFilter";
import LeaveRequestTable from "./requests/LeaveRequestTable";
import SubmitLeaveForm from "./submission/SubmitLeaveForm";
import ApprovalPanel from "./approval/ApprovalPanel";
import LeaveHistoryTimeline from "./history/LeaveHistoryTimeline";
import NotificationPanel from "./notifications/NotificationPanel";
import LeaveReportGenerator from "./reports/LeaveReportGenerator";

import { leaveApi } from "@/services/api/leaveApi";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default function LeaveDashboard() {
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    start: daysAgoISO(29),
    end: todayISO(),
    status: "",
    studentId: "",
  });

  const [meta, setMeta] = useState({ statuses: [] });

  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const reportFilters = useMemo(
    () => ({
      start: filters.start,
      end: filters.end,
      status: filters.status || undefined,
      studentId: filters.studentId || undefined,
    }),
    [filters]
  );

  const applyAll = async () => {
    setError("");
    setBusy(false);
    setLoading(true);
    try {
      const [reqRes, histRes, notifRes] = await Promise.all([
        leaveApi.fetchRequests({
          start: filters.start,
          end: filters.end,
          status: filters.status || undefined,
          studentId: filters.studentId || undefined,
        }),
        leaveApi.fetchHistory({
          start: filters.start,
          end: filters.end,
          studentId: filters.studentId || undefined,
        }),
        leaveApi.fetchNotifications({
          studentId: filters.studentId || undefined,
        }),
      ]);

      setRequests(Array.isArray(reqRes?.items) ? reqRes.items : []);
      setHistory(Array.isArray(histRes?.items) ? histRes.items : Array.isArray(histRes) ? histRes : []);
      setNotifications(Array.isArray(notifRes?.items) ? notifRes.items : Array.isArray(notifRes) ? notifRes : []);

      // keep selection valid
      if (selectedRequest?.id) {
        const still = (reqRes?.items || []).some((x) => String(x.id) === String(selectedRequest.id));
        if (!still) setSelectedRequest(null);
      }
      if (!selectedRequest && (reqRes?.items || []).length) setSelectedRequest(reqRes.items[0]);
    } catch (e) {
      setError(e?.message || "Failed to load leave module.");
      setRequests([]);
      setHistory([]);
      setNotifications([]);
      setSelectedRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const loadMeta = async () => {
    const m = await leaveApi.fetchFilters();
    setMeta(m || { statuses: [] });
  };

  const loadStudents = async (search) => {
    const out = await leaveApi.fetchStudents({ search: search || undefined });
    setStudents(Array.isArray(out) ? out : []);
  };

  useEffect(() => {
    loadMeta()
      .then(() => {
        const stored = localStorage.getItem("currentStudentId") || "";
        setFilters((p) => ({ ...p, studentId: stored }));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!studentSearch) {
      loadStudents().catch(() => {});
      return;
    }
    const t = setTimeout(() => {
      loadStudents(studentSearch).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentSearch]);

  useEffect(() => {
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
    applyAll().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.start, filters.end, filters.status, filters.studentId]);

  const onSubmit = async (payload) => {
    if (!filters.studentId) return;
    setBusy(true);
    setError("");
    try {
      await leaveApi.submitRequest(payload);
      await applyAll();
    } catch (e) {
      setError(e?.message || "Failed to submit leave request.");
    } finally {
      setBusy(false);
    }
  };

  const onApprove = async (requestId, decisionNotes) => {
    setBusy(true);
    setError("");
    try {
      await leaveApi.approveRequest({ requestId, decisionNotes });
      await applyAll();
    } catch (e) {
      setError(e?.message || "Failed to approve leave.");
    } finally {
      setBusy(false);
    }
  };

  const onReject = async (requestId, decisionNotes) => {
    setBusy(true);
    setError("");
    try {
      await leaveApi.rejectRequest({ requestId, decisionNotes });
      await applyAll();
    } catch (e) {
      setError(e?.message || "Failed to reject leave.");
    } finally {
      setBusy(false);
    }
  };

  const onNotify = async ({ studentId, leaveRequestId, message }) => {
    setBusy(true);
    setError("");
    try {
      await leaveApi.notify({ studentId, leaveRequestId, message });
      await applyAll();
    } catch (e) {
      setError(e?.message || "Failed to send notification.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <LeaveLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Leave Requests</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">Submit leave requests, approve/reject, track history, send notifications, and export reports.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Button variant="outline" onClick={() => applyAll().catch(() => {})} disabled={busy} className="gap-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
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
            <StatusFilter options={meta.statuses} value={filters.status} onChange={(v) => setFilters((p) => ({ ...p, status: v }))} />
          </div>
          <div className="lg:col-span-4 flex justify-end">
            <Button onClick={() => applyAll().catch(() => {})} disabled={loading || busy} className="gap-2">
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 p-10 text-center animate-pulse text-primary">Loading leave module...</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-6">
            <LeaveRequestTable items={requests} selectedId={selectedRequest?.id} onSelect={setSelectedRequest} />
          </div>
          <div className="xl:col-span-5 space-y-6">
            <SubmitLeaveForm studentId={filters.studentId} busy={busy} onSubmit={onSubmit} />
            <ApprovalPanel selectedRequest={selectedRequest} onApprove={onApprove} onReject={onReject} busy={busy} />
            <LeaveHistoryTimeline items={history} />
            <NotificationPanel
              notifications={notifications}
              studentId={filters.studentId}
              leaveRequestId={selectedRequest?.id}
              onNotify={onNotify}
              busy={busy}
            />
            <LeaveReportGenerator filters={reportFilters} disabled={busy} />
          </div>
        </div>
      )}
    </LeaveLayout>
  );
}

