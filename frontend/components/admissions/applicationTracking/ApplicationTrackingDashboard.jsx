"use client";
import React, { useEffect, useState } from "react";
import TrackingLayout from "./layout/TrackingLayout";
import TrackingTopbar from "./layout/TrackingTopbar";
import ApplicationsTable from "./list/ApplicationsTable";
import StatusFilter from "./filters/StatusFilter";
import DateFilter from "./filters/DateFilter";
import ApplicationDetailsPanel from "./details/ApplicationDetailsPanel";
import UpdateStatusDropdown from "./actions/UpdateStatusDropdown";
import ActionButtons from "./actions/ActionButtons";
import { applicationTrackingApi } from "@/services/api/applicationTrackingApi";

export default function ApplicationTrackingDashboard() {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const [sort, setSort] = useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async (params = {}) => {
    setError("");
    setLoading(true);
    try {
      const res = await applicationTrackingApi.fetchApplications(params);
      setApps(Array.isArray(res) ? res : []);
      if (!selected && res && res.length) {
        setSelected(res[0]);
      }
    } catch (e) {
      setError(e?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({});
  }, []);

  const refresh = () => {
    const params = {
      search,
      status,
      from: range.from,
      to: range.to,
      sort,
    };
    load(params);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sort, range.from, range.to]);

  const handleSelect = async (app) => {
    setSelected(app);
    try {
      const details = await applicationTrackingApi.fetchApplicationDetails(app.id);
      setSelected(details);
    } catch {
      // ignore
    }
  };

  const handleStatusChange = async (nextStatus) => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await applicationTrackingApi.updateApplicationStatus(selected.id, nextStatus);
      await refresh();
      const details = await applicationTrackingApi.fetchApplicationDetails(selected.id);
      setSelected(details);
    } catch (e) {
      setError(e?.message || "Failed to update status.");
    } finally {
      setBusy(false);
    }
  };

  if (loading && !apps.length) {
    return (
      <TrackingLayout>
        <div className="p-10 text-center animate-pulse text-primary">
          Loading application tracking...
        </div>
      </TrackingLayout>
    );
  }

  return (
    <TrackingLayout>
      <TrackingTopbar
        search={search}
        onSearch={(value) => {
          setSearch(value);
          load({ search: value, status, from: range.from, to: range.to, sort }).catch(() => {});
        }}
        onOpenFilters={() => {}}
        sort={sort}
        onSortChange={setSort}
      />

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        <div className="rounded-2xl border bg-gradient-to-r from-yellow-400/10 to-amber-400/10 p-4 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            Filters
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <StatusFilter status={status} onChange={setStatus} />
            <DateFilter
              from={range.from}
              to={range.to}
              onChange={(next) => setRange(next)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 space-y-4">
            <ApplicationsTable
              applications={apps}
              selectedId={selected?.id}
              onSelect={handleSelect}
            />
          </div>

          <div className="xl:col-span-2 space-y-4">
            <ApplicationDetailsPanel app={selected} />
            <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-4 shadow-sm space-y-3">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
                Status & Actions
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <UpdateStatusDropdown
                  status={selected?.status || "Pending"}
                  disabled={!selected || busy}
                  onChange={handleStatusChange}
                />
                <ActionButtons
                  disabled={!selected || busy}
                  onApprove={() => handleStatusChange("Approved")}
                  onReject={() => handleStatusChange("Rejected")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TrackingLayout>
  );
}

