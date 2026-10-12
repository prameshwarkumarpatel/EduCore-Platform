"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

export default function MedicalDocumentList({ items = [], onDeleted, busy }) {
  const list = Array.isArray(items) ? items : [];

  const view = (doc) => {
    if (!doc?.dataUrl) return;
    window.open(doc.dataUrl, "_blank", "noopener,noreferrer");
  };

  const download = (doc) => {
    if (!doc?.dataUrl) return;
    const a = document.createElement("a");
    a.href = doc.dataUrl;
    a.download = doc.fileName || "medical-document";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="rounded-2xl border bg-purple-500/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Medical Documents</div>
          <div className="text-sm font-semibold text-foreground mt-1">{list.length} files</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/40">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3 font-bold">Type</th>
              <th className="px-5 py-3 font-bold">File</th>
              <th className="px-5 py-3 font-bold">Uploaded</th>
              <th className="px-5 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((d) => (
                <tr key={d.id} className="border-b last:border-b-0">
                  <td className="px-5 py-3 text-muted-foreground">{d.docType}</td>
                  <td className="px-5 py-3 font-semibold text-foreground truncate max-w-[260px]">{d.fileName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => view(d)} disabled={busy} className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => download(d)} disabled={busy} className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No medical documents uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

