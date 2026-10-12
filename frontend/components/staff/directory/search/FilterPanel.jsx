"use client";
import React from "react";
import CategoryTabs from "../categories/CategoryTabs";
import DepartmentFilter from "../categories/DepartmentFilter";

export default function FilterPanel({ roleType, onRoleType, department, onDepartment, departments }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-yellow-500/15 to-amber-500/10 p-4 shadow-sm space-y-3">
      <div className="text-xs font-black tracking-widest uppercase text-amber-100/80">Search & Filters</div>
      <CategoryTabs value={roleType} onChange={onRoleType} />
      <DepartmentFilter departments={departments} value={department} onChange={onDepartment} />
    </div>
  );
}

