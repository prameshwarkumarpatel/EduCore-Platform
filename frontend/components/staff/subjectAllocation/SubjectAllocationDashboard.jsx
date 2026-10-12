"use client";
import React, { useEffect, useMemo, useState } from "react";
import { subjectAllocationApi } from "@/services/api/subjectAllocationApi";
import SubjectAllocationLayout from "./layout/SubjectAllocationLayout";
import SubjectAllocationTopbar from "./layout/SubjectAllocationTopbar";
import SubjectAllocationSidebar from "./layout/SubjectAllocationSidebar";
import TeacherFilter from "./filters/TeacherFilter";
import ClassFilter from "./filters/ClassFilter";
import SubjectFilter from "./filters/SubjectFilter";
import AllocationForm from "./allocation/AllocationForm";
import AllocationTable from "./table/AllocationTable";
import TeacherWorkloadPanel from "./workload/TeacherWorkloadPanel";
import ConflictDetectionPanel from "./conflict/ConflictDetectionPanel";

const emptyDraft = { teacherId: "", subjectId: "", className: "", section: "" };

export default function SubjectAllocationDashboard() {
  const [meta, setMeta] = useState({ teachers: [], subjects: [], classes: [] });
  const [filters, setFilters] = useState({ teacherId: "", className: "", subjectId: "" });
  const [allocations, setAllocations] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [selected, setSelected] = useState(null);
  const [conflict, setConflict] = useState({ hasConflict: false, warnings: [] });
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateDraft = () => {
    if (!draft.teacherId || !draft.subjectId || !draft.className || !draft.section) {
      return "Please fill all required fields: teacher, subject, class, and section.";
    }
    return "";
  };

  const refresh = async () => {
    const [m, a, w] = await Promise.all([
      subjectAllocationApi.fetchMeta(),
      subjectAllocationApi.fetchAllocations(filters),
      subjectAllocationApi.fetchWorkload(),
    ]);
    setMeta(m || { teachers: [], subjects: [], classes: [] });
    setAllocations(Array.isArray(a) ? a : []);
    setWorkload(Array.isArray(w) ? w : []);
  };

  useEffect(() => {
    refresh().catch((e) => setError(e.message || "Failed loading data"));
  }, [filters.teacherId, filters.className, filters.subjectId]);

  useEffect(() => {
    const canCheck = draft.teacherId && draft.subjectId && draft.className && draft.section;
    if (!canCheck) {
      setConflict({ hasConflict: false, warnings: [] });
      return;
    }
    subjectAllocationApi
      .checkConflicts({ ...draft, excludeId: selected?.id || "" })
      .then(setConflict)
      .catch(() => setConflict({ hasConflict: false, warnings: ["Unable to validate conflict right now"] }));
  }, [draft.teacherId, draft.subjectId, draft.className, draft.section, selected?.id]);

  const select = (row) => {
    setSelected(row);
    setDraft({
      teacherId: row.teacher?.id || "",
      subjectId: row.subject?.id || "",
      className: row.className || "",
      section: row.section || "",
    });
  };

  const onCreate = async () => {
    const msg = validateDraft();
    if (msg) {
      setValidationError(msg);
      setSuccess("");
      setError("");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    setValidationError("");
    try {
      await subjectAllocationApi.createAllocation(draft);
      setDraft(emptyDraft);
      setSelected(null);
      await refresh();
      setSuccess("Subject allocation added successfully.");
    } catch (e) {
      setError(e.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  const onUpdate = async () => {
    if (!selected?.id) return;
    const msg = validateDraft();
    if (msg) {
      setValidationError(msg);
      setSuccess("");
      setError("");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    setValidationError("");
    try {
      await subjectAllocationApi.updateAllocation(selected.id, draft);
      await refresh();
      setSuccess("Subject allocation updated successfully.");
    } catch (e) {
      setError(e.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (item) => {
    setDeletingId(item.id);
    setError("");
    setSuccess("");
    try {
      await subjectAllocationApi.deleteAllocation(item.id);
      if (selected?.id === item.id) {
        setSelected(null);
        setDraft(emptyDraft);
      }
      await refresh();
      setSuccess("Subject allocation deleted successfully.");
    } catch (e) {
      setError(e.message || "Delete failed");
    } finally {
      setDeletingId("");
    }
  };

  const overloadedCount = useMemo(() => workload.filter((w) => w.overloaded).length, [workload]);
  const canSubmit = Boolean(draft.teacherId && draft.subjectId && draft.className && draft.section);

  return (
    <SubjectAllocationLayout>
      <SubjectAllocationTopbar />
      <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-4">
        <SubjectAllocationSidebar />
        <div className="space-y-4">
          <div className="rounded-2xl border bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-4">
            <div className="text-xs font-black tracking-widest uppercase text-teal-100/80 mb-2">Filters (for list only)</div>
            <div className="flex flex-wrap gap-2">
            <TeacherFilter teachers={meta.teachers} value={filters.teacherId} onChange={(teacherId) => setFilters((s) => ({ ...s, teacherId }))} />
            <ClassFilter classes={meta.classes} value={filters.className} onChange={(className) => setFilters((s) => ({ ...s, className }))} />
            <SubjectFilter subjects={meta.subjects} value={filters.subjectId} onChange={(subjectId) => setFilters((s) => ({ ...s, subjectId }))} />
            </div>
          </div>
          {error ? <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
          {success ? <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">{success}</div> : null}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AllocationForm
              draft={draft}
              onChange={(next) => {
                setDraft(next);
                setValidationError("");
                setError("");
                setSuccess("");
              }}
              meta={meta}
              onCreate={onCreate}
              onUpdate={onUpdate}
              editing={Boolean(selected)}
              busy={busy}
              validationError={validationError}
              canSubmit={canSubmit}
            />
            <AllocationTable items={allocations} selectedId={selected?.id} onSelect={select} onDelete={onDelete} deletingId={deletingId} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TeacherWorkloadPanel items={workload} />
            <div className="space-y-4">
              <ConflictDetectionPanel conflict={conflict} />
              <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-5">
                <div className="text-xs font-black tracking-widest uppercase text-orange-100/80">Action Panel</div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Total allocations: <span className="font-semibold text-foreground">{allocations.length}</span> · Overloaded teachers:{" "}
                  <span className={`font-semibold ${overloadedCount ? "text-rose-300" : "text-emerald-300"}`}>{overloadedCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubjectAllocationLayout>
  );
}

