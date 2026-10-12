"use client";
import React, { useEffect, useState } from "react";
import { workloadApi } from "@/services/api/workloadApi";
import WorkloadLayout from "./layout/WorkloadLayout";
import WorkloadTopbar from "./layout/WorkloadTopbar";
import WorkloadSidebar from "./layout/WorkloadSidebar";
import StaffFilter from "./filters/StaffFilter";
import DepartmentFilter from "./filters/DepartmentFilter";
import WorkloadLevelFilter from "./filters/WorkloadLevelFilter";
import WorkloadSummaryCard from "./overview/WorkloadSummaryCard";
import TeachingHoursCard from "./overview/TeachingHoursCard";
import DistributionChart from "./overview/DistributionChart";
import WorkloadTable from "./table/WorkloadTable";
import TeachingHoursTracker from "./tracking/TeachingHoursTracker";
import WorkloadAnalysisPanel from "./analysis/WorkloadAnalysisPanel";
import AdjustWorkloadPanel from "./adjustment/AdjustWorkloadPanel";
import ReportPreview from "./reports/ReportPreview";

export default function WorkloadDashboard() {
  const [meta, setMeta] = useState({ staff: [], departments: [], workloadLevels: [] });
  const [filters, setFilters] = useState({ staffId: "", department: "", workloadLevel: "" });
  const [workloadData, setWorkloadData] = useState({ summary: {}, items: [] });
  const [hoursData, setHoursData] = useState({ totalHours: 0, items: [] });
  const [analysis, setAnalysis] = useState({ distribution: {}, warnings: [], insights: [] });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [m, w, h, a] = await Promise.all([
        workloadApi.fetchMeta(),
        workloadApi.fetchWorkloadData(filters),
        workloadApi.fetchTeachingHours(filters),
        workloadApi.analyzeWorkload(filters),
      ]);
      setMeta(m || { staff: [], departments: [], workloadLevels: [] });
      setWorkloadData(w || { summary: {}, items: [] });
      setHoursData(h || { totalHours: 0, items: [] });
      setAnalysis(a || { distribution: {}, warnings: [], insights: [] });
    } catch (e) {
      setError(e.message || "Failed to load workload data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.staffId, filters.department, filters.workloadLevel]);

  const onAdjust = async ({ allocationId, toStaffId }) => {
    setActionBusy(true);
    setError("");
    setSuccess("");
    try {
      await workloadApi.updateWorkload({ allocationId, toStaffId });
      setSuccess("Workload updated successfully.");
      await load();
    } catch (e) {
      setError(e.message || "Failed to update workload");
    } finally {
      setActionBusy(false);
    }
  };

  const onGenerate = async () => {
    setActionBusy(true);
    setError("");
    setSuccess("");
    try {
      const out = await workloadApi.generateWorkloadReport(filters);
      setReport(out);
      setSuccess("Workload report generated successfully.");
    } catch (e) {
      setError(e.message || "Failed to generate report");
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <WorkloadLayout>
      <WorkloadTopbar onGenerate={onGenerate} loading={actionBusy} />

      <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-4">
        <WorkloadSidebar />
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card/40 p-4">
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">Filters</div>
            <div className="flex flex-wrap gap-2">
              <StaffFilter staff={meta.staff} value={filters.staffId} onChange={(staffId) => setFilters((s) => ({ ...s, staffId }))} />
              <DepartmentFilter departments={meta.departments} value={filters.department} onChange={(department) => setFilters((s) => ({ ...s, department }))} />
              <WorkloadLevelFilter levels={meta.workloadLevels} value={filters.workloadLevel} onChange={(workloadLevel) => setFilters((s) => ({ ...s, workloadLevel }))} />
              <button
                type="button"
                onClick={() => setFilters({ staffId: "", department: "", workloadLevel: "" })}
                className="h-9 px-3 rounded-md border border-input bg-background text-xs hover:bg-muted"
              >
                Reset
              </button>
            </div>
          </div>

          {error ? <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{error}</div> : null}
          {success ? <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">{success}</div> : null}
          {loading ? <div className="p-8 text-center text-primary animate-pulse">Loading workload...</div> : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <WorkloadSummaryCard summary={workloadData.summary} />
            <TeachingHoursCard totalHours={hoursData.totalHours} avgHours={workloadData.summary?.avgHours} />
            <DistributionChart distribution={analysis.distribution} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TeachingHoursTracker items={hoursData.items} />
            <WorkloadAnalysisPanel analysis={analysis} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WorkloadTable items={workloadData.items || []} onReassign={() => {}} />
            <div className="space-y-4">
              <AdjustWorkloadPanel
                items={(workloadData.items || []).filter((i) => Array.isArray(i.assignments) && i.assignments.length > 0)}
                staff={meta.staff || []}
                onAdjust={onAdjust}
                busy={actionBusy}
              />
              <ReportPreview report={report} />
            </div>
          </div>
        </div>
      </div>
    </WorkloadLayout>
  );
}

