"use client";
import React, { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParentLayout from "./layout/ParentLayout";
import ParentSearchBar from "./search/ParentSearchBar";
import TotalParentsCard from "./overview/TotalParentsCard";
import LinkedStudentsCard from "./overview/LinkedStudentsCard";
import ParentStatsPanel from "./overview/ParentStatsPanel";
import RecentActivitiesList from "./activities/RecentActivitiesList";
import PendingRequestsPanel from "./requests/PendingRequestsPanel";
import NotificationPanel from "./alerts/NotificationPanel";
import ParentStudentChart from "./analytics/ParentStudentChart";
import InsightsCard from "./analytics/InsightsCard";
import QuickActionsPanel from "./quickActions/QuickActionsPanel";
import { parentDashboardApi } from "@/services/api/parentDashboardApi";

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(null);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [communicationSummary, setCommunicationSummary] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const [s, linked, activities, comm, pending, a] = await Promise.all([
        parentDashboardApi.fetchParentStats(),
        parentDashboardApi.fetchLinkedStudents(),
        parentDashboardApi.fetchRecentActivities(),
        parentDashboardApi.fetchCommunicationSummary(),
        parentDashboardApi.fetchPendingRequests(),
        parentDashboardApi.fetchAlerts(),
      ]);
      setStats(s || {});
      setLinkedStudents(Array.isArray(linked) ? linked : []);
      setRecentActivities(Array.isArray(activities) ? activities : []);
      setCommunicationSummary(comm || {});
      setPendingRequests(Array.isArray(pending) ? pending : []);
      setAlerts(Array.isArray(a) ? a : []);
    } catch (e) {
      setError(e?.message || "Failed to load parent dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const q = String(searchValue || "").trim();
      if (!q) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await parentDashboardApi.searchParents(q);
        setSearchResults(Array.isArray(res?.results) ? res.results : res || []);
      } catch {
        setSearchResults([]);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const totalParents = useMemo(() => stats?.totalParents ?? 0, [stats]);

  const onSelectParent = (p) => {
    if (!p?.id) return;
    setSelectedParentId(p.id);
    const el = document.getElementById("linked");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ParentLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Parent Mgmt Dashboard</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">Centralized overview of parent-student mapping, communication, requests, and alerts.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <ParentSearchBar value={searchValue} onChange={setSearchValue} results={searchResults} onSelect={onSelectParent} />
          <Button
            variant="outline"
            onClick={load}
            disabled={loading}
            className="shrink-0"
            aria-label="Refresh parent dashboard"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading parent dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4">
              <TotalParentsCard totalParents={totalParents} />
            </div>
            <div className="xl:col-span-5">
              <div id="communication">
                <ParentStatsPanel stats={communicationSummary || stats} />
              </div>
            </div>
            <div className="xl:col-span-3">
              <InsightsCard stats={communicationSummary || stats} linkedStudents={linkedStudents} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7">
              <div id="linked">
                <LinkedStudentsCard
                  parents={linkedStudents}
                  selectedParentId={selectedParentId}
                  onSelectParent={onSelectParent}
                />
              </div>
            </div>
            <div className="xl:col-span-5 space-y-6">
              <div>
                <RecentActivitiesList items={recentActivities} />
              </div>
              <QuickActionsPanel />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" style={{ marginTop: "0px" }}>
            <div className="xl:col-span-4">
              <div id="analytics">
                <ParentStudentChart linkedStudents={linkedStudents} />
              </div>
            </div>
            <div className="xl:col-span-4">
              <div id="pending">
                <PendingRequestsPanel items={pendingRequests} />
              </div>
            </div>
            <div className="xl:col-span-4">
              <div id="alerts">
                <NotificationPanel items={alerts} />
              </div>
            </div>
          </div>
        </>
      )}
    </ParentLayout>
  );
}

