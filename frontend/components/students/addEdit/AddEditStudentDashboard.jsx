"use client";
import React, { useEffect, useMemo, useState } from "react";
import StudentLayout from "@/components/students/dashboard/layout/StudentLayout";
import { studentFormApi } from "@/services/api/studentFormApi";
import { directoryApi } from "@/services/api/directoryApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle2, RefreshCcw } from "lucide-react";
import StudentForm from "./form/StudentForm";
import SaveDraftButton from "./actions/SaveDraftButton";
import ConfirmChangesButton from "./actions/ConfirmChangesButton";
import CancelButton from "./actions/CancelButton";
import { validateStudent } from "./validation/FormValidation";

export default function AddEditStudentDashboard() {
  const [classes, setClasses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    status: "Active",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", zip: "", country: "" },
    guardian: { name: "", phone: "", email: "" },
    assignedClass: "",
    assignedSection: "",
    enrollmentId: "",
    photoUrl: "",
  });

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(studentId.trim());

  const loadClasses = async () => {
    const list = await studentFormApi.fetchClasses();
    setClasses(Array.isArray(list) ? list : []);
  };

  const loadStudent = async (id) => {
    const s = await studentFormApi.fetchStudentDetails(id);
    setForm({
      ...form,
      ...s,
      dob: s?.dob ? String(s.dob).slice(0, 10) : "",
      address: s?.address || form.address,
      guardian: s?.guardian || form.guardian,
    });
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      await loadClasses();
    } catch (e) {
      setError(e?.message || "Failed to load form.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runValidate = (mode) => {
    const errs = validateStudent(form, { mode });
    setErrors(errs);
    return errs;
  };

  const refreshDirectory = async () => {
    // small nudge for other pages using fetch(no-store); users will see changes on next navigation
    try {
      window.dispatchEvent(new Event("student-directory-updated"));
    } catch {}
  };

  const save = async (mode) => {
    setBusy(true);
    setError("");
    try {
      const errs = runValidate(mode === "draft" ? "draft" : "confirm");
      if (Object.keys(errs).length) return;

      const payload = { ...form };
      if (isEdit) {
        const updated = await studentFormApi.updateStudent(studentId.trim(), payload, mode);
        setForm((p) => ({ ...p, ...updated, dob: updated?.dob ? String(updated.dob).slice(0, 10) : p.dob }));
      } else {
        const created = await studentFormApi.createStudent(payload, mode);
        setStudentId(created.id);
        setForm((p) => ({ ...p, ...created, dob: created?.dob ? String(created.dob).slice(0, 10) : p.dob }));
      }

      await refreshDirectory();
    } catch (e) {
      setError(e?.message || "Save failed.");
      if (e?.details) setErrors(e.details);
    } finally {
      setBusy(false);
    }
  };

  const uploadPhoto = async (dataUrl) => {
    setForm((p) => ({ ...p, photoUrl: dataUrl }));
    if (!studentId.trim()) return; // upload after create
    setUploadingPhoto(true);
    try {
      const updated = await studentFormApi.uploadProfilePhoto(studentId.trim(), dataUrl);
      setForm((p) => ({ ...p, photoUrl: updated.photoUrl || dataUrl }));
      await refreshDirectory();
    } finally {
      setUploadingPhoto(false);
    }
  };

  const fetchById = async () => {
    if (!studentId.trim()) return;
    setBusy(true);
    setError("");
    try {
      await loadStudent(studentId.trim());
      setErrors({});
    } catch (e) {
      setError(e?.message || "Student not found.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <StudentLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add / Edit Student</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Create or update student records with step-by-step validation, class assignment, and photo upload.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex items-center gap-2">
            <Input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Student ID (for edit)"
              className="md:w-72"
            />
            <Button variant="outline" onClick={fetchById} disabled={busy || !studentId.trim()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Load
            </Button>
          </div>
          <SaveDraftButton onClick={() => save("draft")} disabled={busy} />
          <ConfirmChangesButton onClick={() => save("confirm")} disabled={busy} />
          <CancelButton
            onClick={() => {
              setStudentId("");
              setForm({
                name: "",
                dob: "",
                gender: "",
                status: "Active",
                email: "",
                phone: "",
                address: { street: "", city: "", state: "", zip: "", country: "" },
                guardian: { name: "", phone: "", email: "" },
                assignedClass: "",
                assignedSection: "",
                enrollmentId: "",
                photoUrl: "",
              });
              setErrors({});
              setStep(0);
            }}
            disabled={busy}
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading student form...</div>
      ) : (
        <StudentForm
          value={form}
          onChange={setForm}
          classes={classes}
          errors={errors}
          step={step}
          onStepChange={setStep}
          uploadingPhoto={uploadingPhoto}
          onPhotoChange={uploadPhoto}
        />
      )}
    </StudentLayout>
  );
}

