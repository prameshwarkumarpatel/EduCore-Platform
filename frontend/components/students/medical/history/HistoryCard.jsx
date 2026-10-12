"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import EditMedicalRecordButton from "../actions/EditMedicalRecordButton";
import DeleteMedicalRecordButton from "../actions/DeleteMedicalRecordButton";

export default function HistoryCard({ record, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">{record.recordType || "General"}</div>
          <div className="mt-1 text-sm font-extrabold text-foreground truncate">{record.title}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Date: {record.date ? new Date(record.date).toLocaleDateString() : "—"}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <EditMedicalRecordButton onClick={() => onEdit?.(record)} />
          <DeleteMedicalRecordButton onClick={() => onDelete?.(record)} />
        </div>
      </div>

      {record.treatment ? (
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="font-bold text-foreground">Treatment:</span> {record.treatment}
        </div>
      ) : null}
      {record.notes ? (
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="font-bold text-foreground">Notes:</span> {record.notes}
        </div>
      ) : null}
    </div>
  );
}

