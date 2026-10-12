"use client";
import React, { useEffect, useMemo, useState } from "react";
import AcademicLayout from "./layout/AcademicLayout";
import { academicHistoryApi } from "@/services/api/academicHistoryApi";
import DateRangeFilter from "./overview/DateRangeFilter";
import AcademicStatsPanel from "./overview/AcademicStatsPanel";
import SubjectPerformanceTable from "./subjects/SubjectPerformanceTable";
import AcademicTimeline from "./history/AcademicTimeline";
import PerformanceTrendChart from "./history/PerformanceTrendChart";
import TranscriptGenerator from "./transcripts/TranscriptGenerator";
import ExportAcademicDataButton from "./export/ExportAcademicDataButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw, FileText } from "lucide-react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default function AcademicHistoryDashboard({ initialStudentId = "" }) {
  const [studentId, setStudentId] = useState(initialStudentId || "");
  const [range, setRange] = useState({ start: daysAgoISO(180), end: todayISO() });

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [gpa, setGpa] = useState(null);
  const [grades, setGrades] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [history, setHistory] = useState(null);
  const [trend, setTrend] = useState([]);

  const [transcript, setTranscript] = useState(null);

  const params = useMemo(() => ({ start: range?.start, end: range?.end }), [range]);

  const load = async (overrideId) => {
    const id = (overrideId ?? studentId).trim();
    if (!id) return;
    setError("");
    setLoading(true);
    try {
      const res = await academicHistoryApi.fetchDashboard(id, params);
      setGpa(res?.gpa || null);
      setGrades(res?.grades || null);
      setSubjects(res?.subjects?.subjects || res?.subjects || null);
      setHistory(res?.history?.history || res?.history || null);
      setTrend(res?.trend || []);
      setTranscript(null);
    } catch (e) {
      setError(e?.message || "Failed to load academic history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialStudentId) {
      setStudentId(initialStudentId);
      load(initialStudentId).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStudentId]);

  useEffect(() => {
    if (!initialStudentId) {
      try {
        const stored = localStorage.getItem("currentStudentId") || "";
        if (stored) {
          setStudentId(stored);
          load(stored).catch(() => {});
        }
      } catch {}
    }
    const handler = (e) => {
      const sid = e?.detail?.studentId;
      if (sid) {
        setStudentId(sid);
        load(sid).catch(() => {});
      }
    };
    window.addEventListener("student-selected", handler);
    return () => window.removeEventListener("student-selected", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AcademicLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Academic History</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            View GPA, grade breakdown, subject-wise performance, and historical records with transcript + export.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Student ID or Enrollment ID"
            className="lg:w-72"
          />
          <Button variant="outline" onClick={load} disabled={loading || !studentId.trim()} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Load
          </Button>
          <DateRangeFilter value={range} onChange={setRange} />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading academic history...</div>
      ) : (
        <div className="space-y-6">
          <AcademicStatsPanel gpa={gpa} grades={grades} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 space-y-6">
              <SubjectPerformanceTable subjects={subjects || []} />
              <AcademicTimeline history={history || []} />
            </div>

            <div className="xl:col-span-5 space-y-6">
              <PerformanceTrendChart trend={trend} />

              <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Export</div>
                    <div className="text-sm font-semibold text-foreground mt-1">Academic data</div>
                  </div>
                  <FileText className="h-5 w-5 text-orange-300" />
                </div>
                <ExportAcademicDataButton studentId={studentId.trim()} disabled={busy || !studentId.trim()} />
              </div>

              <TranscriptGenerator studentId={studentId.trim()} onTranscript={(t) => setTranscript(t)} />
            </div>
          </div>
        </div>
      )}
    </AcademicLayout>
  );
}

