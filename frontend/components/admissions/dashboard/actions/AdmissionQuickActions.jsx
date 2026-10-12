"use client";
import React from "react";
import ActionButton from "./ActionButton";
import { UserPlus, CheckCircle2, XCircle } from "lucide-react";

export default function AdmissionQuickActions({ onNew, onApprove, onReject }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
        Quick Actions
      </div>
      <div className="space-y-2">
        <ActionButton icon={UserPlus} label="Add new application" onClick={onNew} />
        <ActionButton icon={CheckCircle2} label="Approve latest pending" onClick={onApprove} />
        <ActionButton icon={XCircle} label="Reject latest pending" onClick={onReject} />
      </div>
    </div>
  );
}

