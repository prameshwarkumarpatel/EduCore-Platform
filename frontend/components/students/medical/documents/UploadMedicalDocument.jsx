"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export default function UploadMedicalDocument({ onUpload, busy }) {
  const [docType, setDocType] = useState("Certificate");
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("application/octet-stream");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  const selectFile = async (file) => {
    setError("");
    if (!file) return;
    // basic guard: keep payload manageable
    if (file.size > 8 * 1024 * 1024) {
      setError("File too large (max 8MB). Try a smaller certificate.");
      return;
    }
    setFileName(file.name);
    setMimeType(file.type || "application/octet-stream");
    const url = await readFileAsDataUrl(file);
    setDataUrl(url);
  };

  const submit = async () => {
    if (!dataUrl) return setError("Choose a certificate first.");
    setError("");
    await onUpload?.({
      docType,
      fileName,
      mimeType,
      dataUrl,
    });
    setDocType("Certificate");
    setFileName("");
    setMimeType("application/octet-stream");
    setDataUrl("");
  };

  return (
    <div className="rounded-2xl border bg-purple-500/10 p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Upload Medical Certificate</div>
          <div className="text-sm font-semibold text-foreground mt-1">Store and access health documents</div>
        </div>
        <FileText className="h-5 w-5 text-purple-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="Certificate">Certificate</option>
          <option value="Prescription">Prescription</option>
          <option value="Lab Report">Lab Report</option>
          <option value="Immunization Proof">Immunization Proof</option>
        </select>

        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => selectFile(e.target.files?.[0])}
          className="text-xs"
        />
      </div>

      {fileName ? (
        <div className="text-xs text-muted-foreground">
          Selected: <span className="font-semibold text-foreground">{fileName}</span>
        </div>
      ) : null}

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}

      <div className="flex justify-end">
        <Button onClick={submit} disabled={busy || !dataUrl} className="gap-2">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}

