"use client";
import React from "react";

export default function PayrollSummaryCard({ payroll }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-5 shadow-sm">
      <div className="text-xs font-black tracking-widest uppercase text-orange-100/80">Payroll Summary</div>
      <div className="mt-3 text-sm">Total Salary: <span className="font-bold">{payroll?.totalSalary || 0}</span></div>
      <div className="text-sm">Paid: <span className="font-bold">{payroll?.totalPaid || 0}</span></div>
      <div className="text-sm">Pending: <span className="font-bold">{payroll?.totalPending || 0}</span></div>
    </div>
  );
}

