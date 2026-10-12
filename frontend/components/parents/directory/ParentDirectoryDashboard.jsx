"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParentDirectoryLayout from "./layout/ParentDirectoryLayout";
import ParentSearchBar from "./search/ParentSearchBar";
import FilterPanel from "./search/FilterPanel";
import ParentTable from "./table/ParentTable";
import ParentProfileCard from "./profile/ParentProfileCard";
import ExportParentDataButton from "./export/ExportParentDataButton";
import { parentDirectoryApi } from "@/services/api/parentDirectoryApi";

export default function ParentDirectoryDashboard() {
  const router = useRouter();
  const [parents, setParents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const params = useMemo(
    () => ({ search: search.trim() || undefined, status: status || undefined }),
    [search, status]
  );

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const list = await parentDirectoryApi.fetchParents(params);
      setParents(Array.isArray(list) ? list : []);
      if (!selected && list?.length) setSelected(list[0]);
    } catch (e) {
      setError(e?.message || "Failed to load parent directory.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setError("");
    try {
      const list = await parentDirectoryApi.fetchParents(params);
      setParents(Array.isArray(list) ? list : []);
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
  }, [search, status]);

  useEffect(() => {
    const handler = () => refresh().catch(() => {});
    window.addEventListener("parent-directory-updated", handler);
    return () => window.removeEventListener("parent-directory-updated", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectParent = async (p) => {
    setSelected(p);
    if (!p?.id) return;
    try {
      localStorage.setItem("currentParentId", p.id);
      window.dispatchEvent(new CustomEvent("parent-selected", { detail: { parentId: p.id } }));
    } catch {}
    try {
      const details = await parentDirectoryApi.fetchParentDetails(p.id);
      setSelected(details);
    } catch {
      setSelected(p);
    }
  };

  const handleView = (p) => selectParent(p);

  const handleEdit = (p) => {
    selectParent(p);
  };

  const handleDelete = async (p) => {
    if (!p?.id) return;
    if (!confirm(`Delete parent "${p.name}"? This action cannot be undone.`)) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`http://localhost:5000/api/parents/directory/${p.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Delete failed.");
      }
      setSelected(null);
      await load();
    } catch (e) {
      setError(e?.message || "Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = async () => {
    setBusy(true);
    setError("");
    try {
      const csv = await parentDirectoryApi.exportParentData(params);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "parent-directory.csv";
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

  return (
    <ParentDirectoryLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Parent Directory</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Search and filter parents, view profiles, linked students, and export directory data.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center flex-wrap">
          <ParentSearchBar value={search} onChange={setSearch} />
          <FilterPanel status={status} onStatusChange={setStatus} />
          <Button variant="outline" onClick={refresh} disabled={busy}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => selected?.id && router.push(`/parents/profile?id=${selected.id}`)}
            disabled={!selected?.id}
          >
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Button>
          <ExportParentDataButton onExport={exportCsv} disabled={busy} />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading && !parents.length ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading parent directory...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <ParentTable
              parents={parents}
              selectedId={selected?.id}
              onSelect={selectParent}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
          <div className="xl:col-span-4">
            <ParentProfileCard parent={selected} />
          </div>
        </div>
      )}
    </ParentDirectoryLayout>
  );
}
