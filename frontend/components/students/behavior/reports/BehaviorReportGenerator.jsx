"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { behaviorApi } from "@/services/api/behaviorApi";
import DownloadBehaviorReport from "./DownloadBehaviorReport";

export default function BehaviorReportGenerator({ filters }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const generate = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await behaviorApi.generateBehaviorReport(filters || {});
      setPreview(res?.content || "");
    } catch (e) {
      setError(e?.message || "Failed to generate report.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-4 shadow-sm space-y-3">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Behavior Reports</div>
        <div className="text-sm font-semibold text-foreground mt-1">Generate and export discipline report</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <Button onClick={generate} disabled={busy} className="gap-2">
          {busy ? "Generating..." : "Generate Report"}
        </Button>
        <DownloadBehaviorReport filters={filters} disabled={busy} />
      </div>

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}

      <div className="rounded-xl border border-border/60 bg-background/40 p-3">
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">Preview</div>
        {preview ? (
          <div className="max-h-64 overflow-auto" dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <div className="text-sm text-muted-foreground">Generate to preview report here.</div>
        )}
      </div>
    </div>
  );
}

