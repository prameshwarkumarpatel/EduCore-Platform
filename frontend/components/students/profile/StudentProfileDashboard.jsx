"use client";
import React, { useEffect, useState } from "react";
import ProfileLayout from "./layout/ProfileLayout";
import ProfileHeader from "./overview/ProfileHeader";
import PersonalDetailsSection from "./sections/PersonalDetailsSection";
import ParentGuardianSection from "./sections/ParentGuardianSection";
import ContactDetailsSection from "./sections/ContactDetailsSection";
import AcademicInfoSection from "./sections/AcademicInfoSection";
import EditProfileButton from "./actions/EditProfileButton";
import SaveChangesButton from "./actions/SaveChangesButton";
import CancelEditButton from "./actions/CancelEditButton";
import { studentProfileApi } from "@/services/api/studentProfileApi";
import { Input } from "@/components/ui/input";
import ProfileForm from "./edit/ProfileForm";

export default function StudentProfileDashboard({ studentId }) {
  const [id, setId] = useState(studentId || "");
  const [student, setStudent] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const current = editing ? draft : student;

  const load = async (targetId) => {
    if (!targetId) return;
    setLoading(true);
    setError("");
    try {
      const p = await studentProfileApi.fetchStudentProfile(targetId);
      setStudent(p);
      setDraft(p);
    } catch (e) {
      setError(e?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (student?.id) {
      try {
        localStorage.setItem("currentStudentId", student.id);
        window.dispatchEvent(new CustomEvent("student-selected", { detail: { studentId: student.id } }));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id]);

  const startEdit = () => {
    setDraft(student);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(student);
    setEditing(false);
    setError("");
  };

  const save = async () => {
    if (!draft?.id) return;
    setBusy(true);
    setError("");
    try {
      const updated = await studentProfileApi.updateStudentProfile(draft.id, draft);
      setStudent(updated);
      setDraft(updated);
      setEditing(false);
      window.dispatchEvent(new Event("student-directory-updated"));
    } catch (e) {
      setError(e?.message || "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ProfileLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Student Profile</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            View and update full student information with a structured, color-coded layout.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Student ID"
            className="md:w-64"
          />
          <EditProfileButton onClick={startEdit} disabled={!student || busy || editing} />
          {editing ? (
            <>
              <SaveChangesButton onClick={save} disabled={busy} />
              <CancelEditButton onClick={cancelEdit} disabled={busy} />
            </>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading && !current ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading profile...</div>
      ) : current ? (
        <>
          <ProfileHeader student={current} />
          {editing ? (
            <ProfileForm draft={draft} onChange={setDraft} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PersonalDetailsSection student={current} />
              <ParentGuardianSection student={current} />
              <ContactDetailsSection student={current} />
              <AcademicInfoSection student={current} />
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground bg-background/30">
          Enter a Student ID or navigate from the Directory to view a profile.
        </div>
      )}
    </ProfileLayout>
  );
}

