"use client";
import React from "react";
import { GraduationCap } from "lucide-react";
import RelationshipSelector from "../relationship/RelationshipSelector";
import ViewStudentButton from "../actions/ViewStudentButton";
import UnlinkStudentButton from "../actions/UnlinkStudentButton";

export default function StudentRow(props) {
  const { student, parentId, onUnlink, onRelationshipChange } = props;
  if (!student) return null;
  const handleRelChange = (v) => onRelationshipChange && onRelationshipChange(student.id, v);
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3 transition-all hover:border-primary/30 hover:bg-primary/5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <GraduationCap className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-foreground truncate">{student.name || "-"}</div>
        <div className="text-xs text-muted-foreground truncate">
          {student.enrollmentId || "-"} - {student.assignedClass || "-"}
          {student.assignedSection ? " / " + student.assignedSection : ""}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <RelationshipSelector value={student.relationshipType} onChange={handleRelChange} compact />
        <ViewStudentButton studentId={student.id} />
        <UnlinkStudentButton studentId={student.id} studentName={student.name} parentId={parentId} onUnlinked={onUnlink} />
      </div>
    </div>
  );
}
