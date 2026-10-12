"use client";
import React, { useEffect, useMemo, useState } from "react";
import DepartmentsLayout from "./layout/DepartmentsLayout";
import DepartmentsTopbar from "./layout/DepartmentsTopbar";
import DepartmentsSidebar from "./layout/DepartmentsSidebar";
import DepartmentFilter from "./filters/DepartmentFilter";
import DepartmentTable from "./list/DepartmentTable";
import DepartmentForm from "./form/DepartmentForm";
import DepartmentStaffList from "./staff/DepartmentStaffList";
import AssignStaffPanel from "./staff/AssignStaffPanel";
import { departmentsApi } from "@/services/api/departmentsApi";

export default function DepartmentsDashboard() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [staffPool, setStaffPool] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [draft, setDraft] = useState({ name: "", headId: "" });
  const [editing, setEditing] = useState(false);

  const params = useMemo(() => ({ search: search.trim() || undefined }), [search]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [deps, pool] = await Promise.all([
        departmentsApi.fetchDepartments(params),
        departmentsApi.fetchStaffPool(),
      ]);
      const list = Array.isArray(deps) ? deps : [];
      setItems(list);
      setStaffPool(Array.isArray(pool) ? pool : []);
      if (!selected && list.length) {
        const details = await departmentsApi.fetchDepartmentDetails(list[0].id);
        setSelected(details);
        setSelectedStaffIds((details.staff || []).map((s) => s.id));
      } else if (selected?.id) {
        const cur = list.find((x) => x.id === selected.id);
        if (cur) {
          const details = await departmentsApi.fetchDepartmentDetails(cur.id);
          setSelected(details);
          setSelectedStaffIds((details.staff || []).map((s) => s.id));
        } else {
          setSelected(null);
          setSelectedStaffIds([]);
        }
      }
    } catch (e) {
      setError(e?.message || "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) return;
    load();
  }, [params.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const view = async (row) => {
    const d = await departmentsApi.fetchDepartmentDetails(row.id);
    setSelected(d);
    setSelectedStaffIds((d.staff || []).map((s) => s.id));
    setEditing(false);
  };

  const startEdit = (row) => {
    setDraft({ name: row.name || "", headId: row.head?.id || "" });
    setEditing(true);
  };

  const createDepartment = async () => {
    if (!String(draft.name || "").trim()) return;
    setBusy(true);
    try {
      const created = await departmentsApi.createDepartment({ name: draft.name.trim(), headId: draft.headId || undefined });
      setDraft({ name: "", headId: "" });
      setEditing(false);
      await load();
      if (created?.id) {
        const d = await departmentsApi.fetchDepartmentDetails(created.id);
        setSelected(d);
        setSelectedStaffIds((d.staff || []).map((s) => s.id));
      }
    } catch (e) {
      setError(e?.message || "Create failed.");
    } finally {
      setBusy(false);
    }
  };

  const updateDepartment = async () => {
    if (!editing || !selected?.id) return;
    setBusy(true);
    try {
      const updated = await departmentsApi.updateDepartment(selected.id, { name: draft.name, headId: draft.headId || null });
      setSelected(updated);
      setEditing(false);
      await load();
    } catch (e) {
      setError(e?.message || "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row) => {
    if (!confirm(`Delete department "${row.name}"?`)) return;
    setDeletingId(row.id);
    try {
      await departmentsApi.deleteDepartment(row.id);
      if (selected?.id === row.id) {
        setSelected(null);
        setSelectedStaffIds([]);
      }
      await load();
    } catch (e) {
      setError(e?.message || "Delete failed.");
    } finally {
      setDeletingId("");
    }
  };

  const toggleStaff = (id) => {
    setSelectedStaffIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const saveAssignments = async () => {
    if (!selected?.id) return;
    setBusy(true);
    try {
      const updated = await departmentsApi.assignStaffToDepartment(selected.id, selectedStaffIds);
      setSelected(updated);
      await load();
    } catch (e) {
      setError(e?.message || "Assignment failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DepartmentsLayout>
      <DepartmentsTopbar />
      <div className="flex items-center gap-2">
        <DepartmentFilter value={search} onChange={setSearch} />
      </div>
      {error ? <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-4">
            <DepartmentTable items={items} selectedId={selected?.id} onView={view} onEdit={startEdit} onDelete={remove} deletingId={deletingId} />
            <DepartmentStaffList department={selected} />
          </div>
          <div className="xl:col-span-4 space-y-4">
            <DepartmentsSidebar />
            <DepartmentForm draft={draft} onChange={setDraft} staffPool={staffPool} onCreate={createDepartment} onUpdate={updateDepartment} editing={editing} busy={busy} />
            <AssignStaffPanel
              staffPool={staffPool}
              selectedIds={selectedStaffIds}
              onToggle={toggleStaff}
              onSave={saveAssignments}
              busy={busy}
              disabled={!selected?.id}
            />
          </div>
        </div>
      )}
    </DepartmentsLayout>
  );
}

