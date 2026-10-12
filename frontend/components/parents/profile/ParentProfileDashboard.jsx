"use client";
import React, { useEffect, useState } from "react";
import ParentProfileLayout from "./layout/ParentProfileLayout";
import ProfileHeader from "./overview/ProfileHeader";
import ProfileQuickInfo from "./overview/ProfileQuickInfo";
import PersonalDetailsSection from "./sections/PersonalDetailsSection";
import ContactDetailsSection from "./sections/ContactDetailsSection";
import AddressSection from "./sections/AddressSection";
import LinkedStudentsSection from "./sections/LinkedStudentsSection";
import EditProfileButton from "./actions/EditProfileButton";
import SaveChangesButton from "./actions/SaveChangesButton";
import CancelEditButton from "./actions/CancelEditButton";
import ParentProfileForm from "./edit/ParentProfileForm";
import { parentProfileApi } from "@/services/api/parentProfileApi";
import { Input } from "@/components/ui/input";

export default function ParentProfileDashboard({ parentId }) {
  const [id, setId] = useState(parentId || "");

  useEffect(() => {
    if (parentId) return;
    try {
      const stored = localStorage.getItem("currentParentId");
      if (stored) setId(stored);
    } catch {}
    const handler = (e) => {
      const pid = e?.detail?.parentId;
      if (pid) setId(pid);
    };
    window.addEventListener("parent-selected", handler);
    return () => window.removeEventListener("parent-selected", handler);
  }, [parentId]);
  const [parent, setParent] = useState(null);
  const [draft, setDraft] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const current = editing ? draft : parent;

  const load = async (targetId) => {
    if (!targetId) return;
    setLoading(true);
    setError("");
    try {
      const p = await parentProfileApi.fetchParentProfile(targetId);
      setParent(p);
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

  const startEdit = () => {
    setDraft(parent);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(parent);
    setEditing(false);
    setError("");
  };

  const save = async () => {
    if (!draft?.id) return;
    setBusy(true);
    setError("");
    try {
      const updated = await parentProfileApi.updateParentProfile(draft.id, draft);
      setParent(updated);
      setDraft(updated);
      setEditing(false);
      window.dispatchEvent(new Event("parent-directory-updated"));
    } catch (e) {
      setError(e?.message || "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ParentProfileLayout>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Parent Profile</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            View and update parent information with linked students and contact details.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Parent ID"
            className="md:w-64"
          />
          <EditProfileButton onClick={startEdit} disabled={!parent || busy || editing} />
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
          <ProfileHeader parent={current} />
          <ProfileQuickInfo parent={current} />
          {editing ? (
            <ParentProfileForm draft={draft} onChange={setDraft} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PersonalDetailsSection parent={current} />
              <ContactDetailsSection parent={current} />
              <AddressSection parent={current} />
              <LinkedStudentsSection parent={current} />
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground bg-background/30">
          Enter a Parent ID or navigate from the Directory to view a profile.
        </div>
      )}
    </ParentProfileLayout>
  );
}
