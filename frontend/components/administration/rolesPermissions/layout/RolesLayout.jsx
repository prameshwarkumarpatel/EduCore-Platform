"use client";
import React from "react";

export default function RolesLayout({ topbar, sidebar, children }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1600px] mx-auto pb-10">
      <div className="xl:col-span-12">{topbar}</div>
      <div className="xl:col-span-3">{sidebar}</div>
      <div className="xl:col-span-9">{children}</div>
    </div>
  );
}

