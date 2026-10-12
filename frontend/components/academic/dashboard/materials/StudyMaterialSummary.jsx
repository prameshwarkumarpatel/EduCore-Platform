"use client";
import React from "react";
import MaterialUploadStats from "./MaterialUploadStats";

export default function StudyMaterialSummary({ data }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Study Materials</div>
      <div className="mt-2 text-2xl font-bold">{data?.totalMaterials ?? 0}</div>
      <div className="text-sm text-muted-foreground">Total uploads</div>
      <MaterialUploadStats bySubject={data?.bySubject} />
    </div>
  );
}
