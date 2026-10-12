"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteAcademicYearModal({ open, year, onClose, onConfirm, loading }) {
  if (!open) return null;

  const start = year?.startDate ? new Date(year.startDate) : null;
  const end = year?.endDate ? new Date(year.endDate) : null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-rose-600 to-red-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-black tracking-widest uppercase opacity-90">Danger Zone</div>
                <div className="text-xl font-extrabold">Delete Academic Year</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-md p-2 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="text-sm text-muted-foreground">
            You are about to permanently remove{" "}
            <span className="font-semibold text-foreground">{year?.year}</span>. Any semester mappings attached to it
            will also be removed.
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Timeline</div>
            <div className="mt-1 font-semibold text-foreground">
              {start && end ? `${start.toLocaleDateString()} → ${end.toLocaleDateString()}` : "No dates configured"}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={loading}>
              {loading ? "Deleting..." : "Delete year"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

