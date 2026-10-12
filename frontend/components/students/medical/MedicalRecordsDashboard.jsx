"use client";
import React, { useEffect, useMemo, useState } from "react";
import MedicalLayout from "./layout/MedicalLayout";
import { medicalRecordsApi } from "@/services/api/medicalRecordsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCcw } from "lucide-react";

import MedicalHistorySection from "./history/MedicalHistorySection";
import ImmunizationTable from "./immunization/ImmunizationTable";
import AllergiesSection from "./conditions/AllergiesSection";
import EmergencyContactsCard from "./emergency/EmergencyContactsCard";
import UploadMedicalDocument from "./documents/UploadMedicalDocument";
import MedicalDocumentList from "./documents/MedicalDocumentList";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function MedicalRecordsDashboard() {
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState(null);

  const studentHint = useMemo(() => {
    return "Student ID or Enrollment ID";
  }, []);

  const load = async (overrideId) => {
    const id = (overrideId ?? studentId).trim();
    if (!id) return;
    setError("");
    setBusy(false);
    setLoading(true);
    try {
      const out = await medicalRecordsApi.fetchDashboard(id);
      setData(out || null);
    } catch (e) {
      setError(e?.message || "Failed to load medical records.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentStudentId") || "";
      if (stored) {
        setStudentId(stored);
        load(stored).catch(() => {});
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
    const handler = (e) => {
      const sid = e?.detail?.studentId;
      if (sid) {
        setStudentId(sid);
        load(sid).catch(() => {});
      }
    };
    window.addEventListener("student-selected", handler);
    return () => window.removeEventListener("student-selected", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => load().catch(() => {});

  const onAddHistory = async (payload) => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.historyAdd(studentId.trim(), payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to add medical record.");
    } finally {
      setBusy(false);
    }
  };

  const onUpdateHistory = async (recordId, payload) => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.historyUpdate(studentId.trim(), recordId, payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to update medical record.");
    } finally {
      setBusy(false);
    }
  };

  const onDeleteHistory = async (record) => {
    if (!studentId.trim()) return;
    const recordId = String(record?._id || record?.id || "");
    if (!recordId) return;
    const ok = confirm("Delete this medical record?");
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.historyDelete(studentId.trim(), recordId);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to delete medical record.");
    } finally {
      setBusy(false);
    }
  };

  const onAddImmunization = async (payload) => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.immunizationAdd(studentId.trim(), payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to add immunization.");
    } finally {
      setBusy(false);
    }
  };

  const onUpdateImmunization = async (id, payload) => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.immunizationUpdate(studentId.trim(), id, payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to update immunization.");
    } finally {
      setBusy(false);
    }
  };

  const onDeleteImmunization = async (id) => {
    if (!studentId.trim()) return;
    const ok = confirm("Delete this immunization?");
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.immunizationDelete(studentId.trim(), id);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to delete immunization.");
    } finally {
      setBusy(false);
    }
  };

  const onAddAllergy = async (payload) => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.allergyAdd(studentId.trim(), payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to add condition.");
    } finally {
      setBusy(false);
    }
  };

  const onUpdateAllergy = async (id, payload) => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.allergyUpdate(studentId.trim(), id, payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to update condition.");
    } finally {
      setBusy(false);
    }
  };

  const onDeleteAllergy = async (id) => {
    if (!studentId.trim()) return;
    const ok = confirm("Delete this condition?");
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.allergyDelete(studentId.trim(), id);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to delete condition.");
    } finally {
      setBusy(false);
    }
  };

  const onAddEmergency = async (payload) => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.emergencyAdd(studentId.trim(), payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to add emergency contact.");
    } finally {
      setBusy(false);
    }
  };

  const onDeleteEmergency = async (id) => {
    if (!studentId.trim()) return;
    const ok = confirm("Delete this emergency contact?");
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.emergencyDelete(studentId.trim(), id);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to delete emergency contact.");
    } finally {
      setBusy(false);
    }
  };

  const onUploadDoc = async (payload) => {
    setBusy(true);
    setError("");
    try {
      await medicalRecordsApi.uploadDocument(studentId.trim(), payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to upload medical document.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MedicalLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Medical Records</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Manage medical history, immunizations, allergies/conditions, emergency contacts, and certificates for student safety.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
          <div className="flex gap-2">
            <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder={studentHint} className="lg:w-72" />
            <Button variant="outline" onClick={() => load(studentId).catch(() => {})} disabled={!studentId.trim() || busy} className="gap-2">
              Load
            </Button>
          </div>
          <Button variant="outline" onClick={() => refresh()} disabled={busy} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>
      ) : null}

      {loading ? (
        <div className="mt-6 p-10 text-center animate-pulse text-primary">Loading medical records...</div>
      ) : (
        data ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {data.student?.photoUrl ? (
                    <img src={data.student.photoUrl} alt={data.student.name} className="h-11 w-11 rounded-full border object-cover bg-primary/5" />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center font-bold text-primary">
                      {(data.student?.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{data.student?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {data.student?.enrollmentId ? `Enrollment: ${data.student.enrollmentId}` : "Enrollment: —"} • Class{" "}
                      {data.student?.assignedClass || "—"} / {data.student?.assignedSection || "—"}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated: {new Date().toLocaleDateString()} • {busy ? "Working..." : "Ready"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-7 space-y-6">
                <MedicalHistorySection
                  items={data.history || []}
                  onAdd={onAddHistory}
                  onUpdate={onUpdateHistory}
                  onDelete={onDeleteHistory}
                  busy={busy}
                />

                <AllergiesSection
                  items={data.allergies || []}
                  onAdd={onAddAllergy}
                  onUpdate={onUpdateAllergy}
                  onDelete={onDeleteAllergy}
                  busy={busy}
                />
              </div>

              <div className="xl:col-span-5 space-y-6">
                <ImmunizationTable
                  items={data.immunizations || []}
                  onAdd={onAddImmunization}
                  onUpdate={onUpdateImmunization}
                  onDelete={onDeleteImmunization}
                  busy={busy}
                />

                <EmergencyContactsCard
                  items={data.emergencyContacts || []}
                  onAdd={onAddEmergency}
                  onDelete={onDeleteEmergency}
                  busy={busy}
                />

                <UploadMedicalDocument onUpload={onUploadDoc} busy={busy} />
                <MedicalDocumentList items={data.documents || []} busy={busy} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground bg-background/30">
            No medical data available yet.
          </div>
        )
      )}
    </MedicalLayout>
  );
}

