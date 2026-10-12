"use client";
import React from "react";
import DocumentRow from "./DocumentRow";

export default function DocumentListTable({ documents, selectedId, onSelect }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-sky-500/10 to-indigo-600/10 p-4 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-2">
        Uploaded Documents
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-muted/80">
            <tr>
              <th className="px-3 py-2 font-semibold text-muted-foreground">Upload date</th>
              <th className="px-3 py-2 font-semibold text-muted-foreground">Applicant</th>
              <th className="px-3 py-2 font-semibold text-muted-foreground">Document type</th>
              <th className="px-3 py-2 font-semibold text-muted-foreground">Program</th>
              <th className="px-3 py-2 font-semibold text-muted-foreground text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {documents && documents.length ? (
              documents.map((d) => (
                <DocumentRow
                  key={d.id}
                  doc={d}
                  selected={d.id === selectedId}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No documents found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

