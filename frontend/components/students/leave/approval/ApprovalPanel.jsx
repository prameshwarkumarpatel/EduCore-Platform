"use client";
import React, { useEffect, useState } from "react";
import ApproveButton from "./ApproveButton";
import RejectButton from "./RejectButton";

import LeaveStatusBadge from "../requests/LeaveStatusBadge";

export default function ApprovalPanel({ selectedRequest, onApprove, onReject, busy }) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes("");
  }, [selectedRequest?.id]);

  const canDecide = selectedRequest?.status === "Pending";

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Approval Panel</div>
          <div className="text-sm font-semibold text-foreground mt-1">Approve / reject leave requests</div>
        </div>
        {selectedRequest ? <LeaveStatusBadge status={selectedRequest.status} /> : null}
      </div>

      {selectedRequest ? (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">
            {selectedRequest.student?.name} • {selectedRequest.student?.enrollmentId}
          </div>
          <div className="text-xs text-muted-foreground">
            Dates:{" "}
            {selectedRequest.startDate ? new Date(selectedRequest.startDate).toLocaleDateString() : "—"} →{" "}
            {selectedRequest.endDate ? new Date(selectedRequest.endDate).toLocaleDateString() : "—"}
          </div>
          <div className="text-xs text-muted-foreground">
            Reason: <span className="font-semibold text-foreground">{selectedRequest.reason}</span>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={canDecide ? "Decision notes (optional)" : "Decision notes"}
            className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            disabled={!canDecide || busy}
          />

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
            <ApproveButton
              disabled={!canDecide || busy}
              onClick={() => onApprove?.(selectedRequest.id, notes)}
            />
            <RejectButton
              disabled={!canDecide || busy}
              onClick={() => onReject?.(selectedRequest.id, notes)}
            />
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Select a leave request from the table.</div>
      )}
    </div>
  );
}

