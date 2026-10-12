"use client";
import React, { useEffect, useState } from "react";
import { academicYearApi } from "@/services/api/academicYearApi";
import AcademicLayout from "./layout/AcademicLayout";
import AcademicTopbar from "./layout/AcademicTopbar";
import AcademicSidebar from "./layout/AcademicSidebar";
import AcademicYearFilter from "./AcademicYearFilter";
import AcademicYearListPanel from "./AcademicYearListPanel";
import CreateAcademicYearForm from "./CreateAcademicYearForm";
import EditAcademicYearForm from "./EditAcademicYearForm";
import DateRangePicker from "./DateRangePicker";
import SemesterConfigPanel from "./SemesterConfigPanel";
import AcademicYearStatusToggle from "./AcademicYearStatusToggle";
import ViewAcademicYearDetails from "./ViewAcademicYearDetails";
import DeleteAcademicYearModal from "./DeleteAcademicYearModal";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";

export default function AcademicYearDashboard() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("list");
  const [mode, setMode] = useState("view"); // view | create | edit
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [draftSemesters, setDraftSemesters] = useState([]);
  const [draftDates, setDraftDates] = useState({ startDate: "", endDate: "" });

  const loadYears = async (q) => {
    const list = await academicYearApi.fetchAcademicYears({ search: q ?? search });
    setYears(Array.isArray(list) ? list : []);
  };

  const loadAll = async () => {
    setError("");
    setLoading(true);
    try {
      await loadYears("");
      const list = await academicYearApi.fetchAcademicYears({});
      if (!selectedYear && list && list.length) {
        const first = list[0];
        const details = await academicYearApi.fetchAcademicYearDetails(first.id);
        setSelectedYear(details);
        setDraftSemesters(details.semesters || []);
        setDraftDates({ startDate: details.startDate || "", endDate: details.endDate || "" });
      }
    } catch (e) {
      setError(e?.message || "Failed to load academic years.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectYear = async (year) => {
    setError("");
    setSelectedYear(year);
    try {
      const details = await academicYearApi.fetchAcademicYearDetails(year.id);
      setSelectedYear(details);
      setDraftSemesters(details.semesters || []);
      setDraftDates({ startDate: details.startDate || "", endDate: details.endDate || "" });
    } catch {
      // keep basic version
    }
  };

  const handleCreate = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await academicYearApi.createAcademicYear(payload);
      setMode("view");
      setActiveSection("list");
      await loadYears("");
    } catch (e) {
      setError(e?.message || "Failed to create academic year.");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    setBusy(true);
    setError("");
    try {
      await academicYearApi.editAcademicYear(id, payload);
      await loadYears();
      const details = await academicYearApi.fetchAcademicYearDetails(id);
      setSelectedYear(details);
      setDraftSemesters(details.semesters || []);
      setDraftDates({ startDate: details.startDate || "", endDate: details.endDate || "" });
      setMode("view");
    } catch (e) {
      setError(e?.message || "Failed to update academic year.");
      throw e;
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateDates = async (dates) => {
    setDraftDates(dates);
    if (!selectedYear) return;
    await handleUpdate(selectedYear.id, dates);
  };

  const handleConfigureSemesters = async (semesters) => {
    setDraftSemesters(semesters);
    if (!selectedYear) return;
    setBusy(true);
    setError("");
    try {
      await academicYearApi.configureSemesters(selectedYear.id, semesters);
      const details = await academicYearApi.fetchAcademicYearDetails(selectedYear.id);
      setSelectedYear(details);
      setDraftSemesters(details.semesters || []);
    } catch (e) {
      setError(e?.message || "Failed to update semesters.");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async (nextActive) => {
    if (!selectedYear) return;
    setBusy(true);
    setError("");
    try {
      await academicYearApi.toggleAcademicYearStatus(selectedYear.id, nextActive);
      await loadYears();
      const details = await academicYearApi.fetchAcademicYearDetails(selectedYear.id);
      setSelectedYear(details);
    } catch (e) {
      setError(e?.message || "Failed to update status.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedYear) return;
    setBusy(true);
    setError("");
    try {
      await academicYearApi.deleteAcademicYear(selectedYear.id);
      setDeleteOpen(false);
      setSelectedYear(null);
      await loadYears();
    } catch (e) {
      setError(e?.message || "Failed to delete academic year.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-primary">Loading academic year timeline...</div>;
  }

  return (
    <>
      <AcademicLayout
        topbar={
          <AcademicTopbar
            total={years.length}
            onCreateYear={() => {
              setMode("create");
              setActiveSection("edit");
            }}
          />
        }
        sidebar={<AcademicSidebar activeSection={activeSection} onSelectSection={setActiveSection} />}
      >
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-4">
            <AcademicYearFilter
              search={search}
              onSearch={(value) => {
                setSearch(value);
                loadYears(value).catch(() => {});
              }}
            />
            <AcademicYearListPanel years={years} selectedId={selectedYear?.id} onSelect={selectYear} />
          </div>

          <div className="xl:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card p-4 shadow-sm">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
                {selectedYear ? `Selected: ${selectedYear.year}` : "No year selected"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={!selectedYear}
                  onClick={() => {
                    setMode("edit");
                    setActiveSection("edit");
                  }}
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-destructive hover:bg-destructive/10"
                  disabled={!selectedYear}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>

            {activeSection === "edit" ? (
              mode === "create" ? (
                <CreateAcademicYearForm
                  loading={busy}
                  onCancel={() => {
                    setMode("view");
                    setActiveSection("list");
                  }}
                  onSubmit={handleCreate}
                />
              ) : (
                <EditAcademicYearForm year={selectedYear} loading={busy} onSubmit={handleUpdate} />
              )
            ) : null}

            {activeSection === "dates" ? (
              <DateRangePicker
                startDate={draftDates.startDate}
                endDate={draftDates.endDate}
                onChange={handleUpdateDates}
              />
            ) : null}

            {activeSection === "semesters" ? (
              <SemesterConfigPanel semesters={draftSemesters} onChange={handleConfigureSemesters} />
            ) : null}

            {activeSection === "status" ? (
              <AcademicYearStatusToggle year={selectedYear} disabled={busy || !selectedYear} onToggle={handleToggleStatus} />
            ) : null}

            {activeSection === "list" ? <ViewAcademicYearDetails year={selectedYear} /> : null}
          </div>
        </div>
      </AcademicLayout>

      <DeleteAcademicYearModal
        open={deleteOpen}
        year={selectedYear}
        loading={busy}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

