"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import StudentSearchDropdown from "../selection/StudentSearchDropdown";
import RelationshipSelector from "../relationship/RelationshipSelector";

export default function LinkStudentButton({ parentId, onLinked }) {
  const [open, setOpen] = useState(false);
  const [relationshipType, setRelationshipType] = useState("Guardian");

  const handleLink = async (studentId) => {
    if (!parentId || !studentId) return;
    try {
      const { linkedStudentsApi } = await import("@/services/api/linkedStudentsApi");
      await linkedStudentsApi.linkStudent(parentId, { studentId, relationshipType });
      setOpen(false);
      onLinked?.();
    } catch (e) {
      alert(e?.message || "Failed to link student.");
    }
  };

  if (!parentId) return null;

  return (
    <div className="relative">
      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
      >
        <Link2 className="h-4 w-4" />
        Link Student
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border bg-card p-3 shadow-xl">
            <div className="mb-2 text-xs font-semibold text-muted-foreground">
              Relationship Type
            </div>
            <RelationshipSelector
              value={relationshipType}
              onChange={setRelationshipType}
            />
            <div className="mt-3 text-xs font-semibold text-muted-foreground">
              Select Student
            </div>
            <StudentSearchDropdown
              parentId={parentId}
              onSelect={handleLink}
              onCancel={() => setOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
