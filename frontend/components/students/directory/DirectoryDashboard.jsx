"use client";
import React, { useEffect, useMemo, useState } from "react";
import StudentLayout from "@/components/students/dashboard/layout/StudentLayout";
import { directoryApi } from "@/services/api/directoryApi";
import SearchBar from "./filters/SearchBar";
import ClassFilter from "./filters/ClassFilter";
import SectionFilter from "./filters/SectionFilter";
import StatusFilter from "./filters/StatusFilter";
import StudentsTable from "./list/StudentsTable";
import StudentProfilePanel from "./profile/StudentProfilePanel";
import ExportDirectoryButton from "./actions/ExportDirectoryButton";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DirectoryDashboard() {
  const router = useRouter();
  const [filters, setFilters] = useState({ classes: [], sections: [] });
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [cls, setCls] = useState("");
  const [sec, setSec] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const params = useMemo(
    () => ({
      search,
      class: cls || undefined,
      section: sec || undefined,
      status: status || undefined,
    }),
    [search, cls, sec, status]
  );

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const [f, list] = await Promise.all([directoryApi.fetchFilters(), directoryApi.fetchStudents(params)]);
      setFilters(f || { classes: [], sections: [] });
      setRows(Array.isArray(list) ? list : []);
      if (!selected && list?.length) setSelected(list[0]);
    } catch (e) {
      setError(e?.message || "Failed to load directory.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setError("");
    try {
      const list = await directoryApi.fetchStudents(params);
      setRows(Array.isArray(list) ? list : []);
      if (selected?.id) {
        const cur = (Array.isArray(list) ? list : []).find((x) => x.id === selected.id);
        if (cur) setSelected(cur);
      }
    } catch (e) {
      setError(e?.message || "Failed to refresh.");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, cls, sec, status]);

  useEffect(() => {
    const handler = () => {
      refresh().catch(() => {});
    };
    window.addEventListener("student-directory-updated", handler);
    return () => window.removeEventListener("student-directory-updated", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportCsv = async () => {
    setBusy(true);
    setError("");
    try {
      const csv = await directoryApi.exportDirectoryData(params);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student-directory.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || "Export failed.");
    } finally {
      setBusy(false);
    }
  };

  const selectStudent = async (s) => {
    setSelected(s);
    try {
      if (s?.id) localStorage.setItem("currentStudentId", s.id);
      window.dispatchEvent(new CustomEvent("student-selected", { detail: { studentId: s?.id } }));
    } catch {}
    if (!s?.id) return;
    try {
      const profile = await directoryApi.fetchStudentProfile(s.id);
      setSelected(profile);
    } catch {
      // fallback to row data
    }
  };

  return (
    <StudentLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Directory</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Search, filter, quick-view student profiles, and export directory data.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <SearchBar value={search} onChange={setSearch} />
          <ClassFilter
            options={filters.classes}
            value={cls}
            onChange={(v) => {
              setCls(v);
              setSec("");
            }}
          />
          <SectionFilter options={filters.sections} value={sec} onChange={setSec} disabled={!cls && !filters.sections?.length} />
          <StatusFilter value={status} onChange={setStatus} />
          <Button variant="outline" onClick={refresh} disabled={busy}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <ExportDirectoryButton onExport={exportCsv} disabled={busy} />
          <Button onClick={() => router.push("/students/add-edit")}>Add Student</Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading && !rows.length ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading directory...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <StudentsTable students={rows} selectedId={selected?.id} onSelect={selectStudent} onQuickView={selectStudent} />
          </div>
          <div className="xl:col-span-4">
            <StudentProfilePanel student={selected} />
          </div>
        </div>
      )}
    </StudentLayout>
  );
}

