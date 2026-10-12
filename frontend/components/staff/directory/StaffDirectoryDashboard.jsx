"use client";
import React, { useEffect, useMemo, useState } from "react";
import StaffDirectoryLayout from "./layout/StaffDirectoryLayout";
import StaffSearchBar from "./search/StaffSearchBar";
import FilterPanel from "./search/FilterPanel";
import StaffTable from "./table/StaffTable";
import StaffProfileCard from "./profile/StaffProfileCard";
import ExportStaffDataButton from "./export/ExportStaffDataButton";
import { staffDirectoryApi } from "@/services/api/staffDirectoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StaffDirectoryDashboard() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleType, setRoleType] = useState("ALL");
  const [department, setDepartment] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);

  const params = useMemo(() => ({
    search: search.trim() || undefined,
    roleType: roleType === "ALL" ? undefined : roleType,
    department: department || undefined,
  }), [search, roleType, department]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await staffDirectoryApi.fetchStaffList(params);
      const arr = Array.isArray(list) ? list : [];
      setItems(arr);
      if (!selected && arr.length) {
        const details = await staffDirectoryApi.fetchStaffDetails(arr[0].id);
        setSelected(details);
      } else if (selected?.id) {
        const cur = arr.find((x) => x.id === selected.id);
        if (cur) {
          const details = await staffDirectoryApi.fetchStaffDetails(cur.id);
          setSelected(details);
        } else {
          setSelected(arr[0] || null);
        }
      }
    } catch (e) {
      setError(e?.message || "Failed to load staff directory.");
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
  }, [params.search, params.roleType, params.department]); // eslint-disable-line react-hooks/exhaustive-deps

  const departments = useMemo(() => Array.from(new Set(items.map((x) => x.department).filter(Boolean))).sort(), [items]);

  const view = async (row) => {
    const details = await staffDirectoryApi.fetchStaffDetails(row.id);
    setSelected(details);
    setEditing(false);
  };

  const startEdit = (row) => {
    setEditDraft({
      id: row.id,
      name: row.name || "",
      roleType: row.roleType || "Teacher",
      department: row.department || "",
      email: row.email || "",
      phone: row.phone || "",
      status: row.status || "Active",
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!editDraft?.id) return;
    try {
      const updated = await staffDirectoryApi.updateStaff(editDraft.id, editDraft);
      setSelected(updated);
      setEditing(false);
      await load();
    } catch (e) {
      setError(e?.message || "Update failed.");
    }
  };

  const remove = async (row) => {
    if (!confirm(`Delete staff "${row.name}"?`)) return;
    setDeletingId(row.id);
    try {
      await staffDirectoryApi.deleteStaff(row.id);
      if (selected?.id === row.id) setSelected(null);
      await load();
    } catch (e) {
      setError(e?.message || "Delete failed.");
    } finally {
      setDeletingId("");
    }
  };

  const onExport = async () => {
    setExporting(true);
    try {
      const csv = await staffDirectoryApi.exportStaffData(params);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "staff-directory.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <StaffDirectoryLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Directory</h1>
          <p className="text-muted-foreground mt-1">Centralized list of teachers and staff with search, filters, and profile preview.</p>
        </div>
        <div className="flex gap-2 items-center">
          <StaffSearchBar value={search} onChange={setSearch} />
          <ExportStaffDataButton onExport={onExport} busy={exporting} />
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}

      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading staff directory...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-4">
            <FilterPanel roleType={roleType} onRoleType={setRoleType} department={department} onDepartment={setDepartment} departments={departments} />
            <StaffTable
              items={items}
              selectedId={selected?.id}
              onView={view}
              onEdit={startEdit}
              onDelete={remove}
              deletingId={deletingId}
            />
          </div>
          <div className="xl:col-span-4 space-y-4">
            <StaffProfileCard staff={selected} />
            {editing && editDraft ? (
              <div className="rounded-2xl border bg-gradient-to-br from-red-500/10 to-rose-500/10 p-4 shadow-sm space-y-2">
                <div className="text-xs font-black tracking-widest uppercase text-rose-100/80">Edit Staff</div>
                <Input value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} placeholder="Name" />
                <Input value={editDraft.department} onChange={(e) => setEditDraft({ ...editDraft, department: e.target.value })} placeholder="Department" />
                <Input value={editDraft.email} onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })} placeholder="Email" />
                <Input value={editDraft.phone} onChange={(e) => setEditDraft({ ...editDraft, phone: e.target.value })} placeholder="Phone" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={editDraft.roleType} onChange={(e) => setEditDraft({ ...editDraft, roleType: e.target.value })} className="h-9 rounded-md border border-input bg-background px-3 text-xs">
                    <option value="Teacher">Teacher</option>
                    <option value="NonTeaching">Non-Teaching</option>
                  </select>
                  <select value={editDraft.status} onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value })} className="h-9 rounded-md border border-input bg-background px-3 text-xs">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </StaffDirectoryLayout>
  );
}

