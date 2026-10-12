"use client";
import React from "react";

export default function ErrorMessages({ errors }) {
  const entries = errors ? Object.entries(errors) : [];
  if (!entries.length) return null;
  return (
    <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
      <div className="text-xs font-black tracking-widest uppercase text-rose-200 mb-2">Validation</div>
      <ul className="list-disc pl-5 space-y-1">
        {entries.map(([k, v]) => (
          <li key={k}>
            <span className="font-semibold">{k}</span>: {String(v)}
          </li>
        ))}
      </ul>
    </div>
  );
}

