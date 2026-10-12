"use client";
import React from "react";
import TeacherSelector from "./TeacherSelector";
import SubjectSelector from "./SubjectSelector";
import ClassSectionSelector from "./ClassSectionSelector";
import AddAllocationButton from "../actions/AddAllocationButton";
import EditAllocationButton from "../actions/EditAllocationButton";

export default function AllocationForm({ draft, onChange, meta, onCreate, onUpdate, editing, busy, validationError, canSubmit }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-5 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-blue-100/80">Allocation Form</div>
      <div className="text-xs text-muted-foreground">All fields marked <span className="text-rose-300">*</span> are required.</div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">Teacher <span className="text-rose-300">*</span></label>
        <TeacherSelector teachers={meta?.teachers || []} value={draft.teacherId} onChange={(teacherId) => onChange({ ...draft, teacherId })} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">Subject <span className="text-rose-300">*</span></label>
        <SubjectSelector subjects={meta?.subjects || []} value={draft.subjectId} onChange={(subjectId) => onChange({ ...draft, subjectId })} />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">Class & Section <span className="text-rose-300">*</span></label>
        <ClassSectionSelector classes={meta?.classes || []} className={draft.className} section={draft.section} onChange={({ className, section }) => onChange({ ...draft, className, section })} />
      </div>

      {validationError ? (
        <div className="rounded-md border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200">
          {validationError}
        </div>
      ) : null}

      <div className="flex gap-2">
        <AddAllocationButton onClick={onCreate} disabled={busy || !canSubmit} />
        <EditAllocationButton onClick={onUpdate} disabled={busy || !editing || !canSubmit} />
      </div>
    </div>
  );
}

