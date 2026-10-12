"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Unlink } from "lucide-react";
import { linkedStudentsApi } from "@/services/api/linkedStudentsApi";

export default function UnlinkStudentButton({ studentId, studentName, parentId, onUnlinked }) {
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleUnlink = async () => {
    if (!parentId || !studentId) return;
    setBusy(true);
    try {
      await linkedStudentsApi.unlinkStudent(parentId, studentId);
      setConfirm(false);
      onUnlinked?.();
    } catch (e) {
      alert(e?.message || "Failed to unlink.");
    } finally {
      setBusy(false);
    }
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8 text-xs"
          onClick={handleUnlink}
          disabled={busy}
        >
          {busy ? "..." : "Confirm"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setConfirm(false)}
          disabled={busy}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={() => setConfirm(true)}
    >
      <Unlink className="h-3.5 w-3.5" />
      Unlink
    </Button>
  );
}
