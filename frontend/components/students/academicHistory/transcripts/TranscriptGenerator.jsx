"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { academicHistoryApi } from "@/services/api/academicHistoryApi";
import TranscriptPreview from "./TranscriptPreview";
import DownloadTranscriptButton from "./DownloadTranscriptButton";

export default function TranscriptGenerator({ studentId, onTranscript }) {
  const [transcriptType, setTranscriptType] = useState("Official");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  const generate = async () => {
    if (!studentId) return;
    setError("");
    setBusy(true);
    try {
      const res = await academicHistoryApi.generateTranscript(studentId, { transcriptType });
      setContent(res?.content || "");
      onTranscript?.(res || null);
    } catch (e) {
      setError(e?.message || "Failed to generate transcript.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Transcript Generator</div>
          <div className="text-xs text-muted-foreground">Official record</div>
        </div>

        {studentId ? (
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <select
              value={transcriptType}
              onChange={(e) => setTranscriptType(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Official">Official</option>
              <option value="Student Copy">Student Copy</option>
            </select>
            <Button onClick={generate} disabled={busy} className="gap-2">
              {busy ? "Generating..." : "Generate Transcript"}
            </Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Enter a Student ID to generate transcript.</div>
        )}

        {error ? <div className="mt-3 text-sm text-rose-300">{error}</div> : null}
      </div>

      <TranscriptPreview content={content} />
      <DownloadTranscriptButton content={content} disabled={!content || busy} />
    </div>
  );
}

