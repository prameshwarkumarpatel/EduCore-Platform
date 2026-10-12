"use client";
import React from "react";

export default function OverloadWarningCard({ warning }) {
  return <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200">{warning.message}</div>;
}

