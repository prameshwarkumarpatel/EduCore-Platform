"use client";
import React, { useEffect, useMemo, useState } from "react";
import TrackingLayout from "../applicationTracking/layout/TrackingLayout";
import { enrollmentApi } from "@/services/api/enrollmentApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCcw } from "lucide-react";
import EnrollmentTable from "./list/EnrollmentTable";
import EnrollmentActionsPanel from "./actions/EnrollmentActionsPanel";
import AssignClassSection from "./actions/AssignClassSection";
import StudentRecordPanel from "./details/StudentRecordPanel";

export default function EnrollmentDashboard() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sections = useMemo(() => {
    const cls = classes.find((c) => c.name === classFilter);
    return cls?.sections || [];
  }, [classes, classFilter]);

  const params = useMemo(
    () => ({
      search,
      class: classFilter || undefined,
      section: sectionFilter || undefined,
      status: statusFilter || undefined,
    }),
    [search, classFilter, sectionFilter, statusFilter]
  );

  const loadAll = async () => {
    setError("");
    setLoading(true);
    try {
      const [cls, list] = await Promise.all([
        enrollmentApi.fetchClasses(),
        enrollmentApi.fetchEnrolledStudents(params),
      ]);
      setClasses(Array.isArray(cls) ? cls : []);
      setRows(Array.isArray(list) ? list : []);
      if (!selected && Array.isArray(list) && list.length) setSelected(list[0]);
    } catch (e) {
      setError(e?.message || "Failed to load enrollment records.");
    } finally {
      setLoading(false);
    }
  };

  const refreshList = async () => {
    setError("");
    try {
      const list = await enrollmentApi.fetchEnrolledStudents(params);
      setRows(Array.isArray(list) ? list : []);
      if (selected?.id) {
        const still = (Array.isArray(list) ? list : []).find((r) => r.id === selected.id);
        if (still) setSelected(still);
      } else if (!selected && list && list.length) {
        setSelected(list[0]);
      }
    } catch (e) {
      setError(e?.message || "Failed to refresh list.");
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    refreshList().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, classFilter, sectionFilter, statusFilter]);

  const exportCsv = async () => {
    setBusy(true);
    setError("");
    try {
      const csv = await enrollmentApi.exportEnrollmentData(params);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enrollments.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || "Failed to export CSV.");
    } finally {
      setBusy(false);
    }
  };

  const convert = async (applicationId) => {
    setBusy(true);
    setError("");
    try {
      const created = await enrollmentApi.convertApplicationToStudent(applicationId);
      await refreshList();
      if (created?.id) {
        setSelected((prev) => (prev?.id ? prev : created));
      }
    } catch (e) {
      setError(e?.message || "Failed to convert application.");
    } finally {
      setBusy(false);
    }
  };

  const assign = async ({ assignedClass, assignedSection }) => {
    if (!selected?.id) return;
    setBusy(true);
    setError("");
    try {
      const updated = await enrollmentApi.assignClassSection(selected.id, { assignedClass, assignedSection });
      setSelected(updated);
      await refreshList();
    } catch (e) {
      setError(e?.message || "Failed to assign class/section.");
    } finally {
      setBusy(false);
    }
  };

  if (loading && !rows.length) {
    return (
      <TrackingLayout>
        <div className="p-10 text-center animate-pulse text-primary">Loading enrollment records...</div>
      </TrackingLayout>
    );
  }

  return (
    <TrackingLayout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Enrollment Records</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Convert approved applications into student records, assign class/section, and export enrollment data.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name / ID..." className="pl-10" />
          </div>

          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setSectionFilter("");
            }}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:w-44"
          >
            <option value="">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:w-40"
            disabled={!classFilter}
          >
            <option value="">All sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:w-40"
          >
            <option value="">All status</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          <Button variant="outline" onClick={() => refreshList()} disabled={busy}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportCsv} disabled={busy}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-4">
            <EnrollmentTable rows={rows} selectedId={selected?.id} onSelect={setSelected} />
          </div>

          <div className="xl:col-span-5 space-y-4">
            <EnrollmentActionsPanel onConvert={convert} disabled={busy} />
            <AssignClassSection classes={classes} current={selected} onAssign={assign} disabled={busy || !selected} />
            <StudentRecordPanel record={selected} />
          </div>
        </div>
      </div>
    </TrackingLayout>
  );
}

