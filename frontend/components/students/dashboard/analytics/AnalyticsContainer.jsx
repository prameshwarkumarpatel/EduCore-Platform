"use client";
import React from "react";
import AttendanceChart from "./AttendanceChart";
import SectionDistributionChart from "./SectionDistributionChart";

export default function AnalyticsContainer({ attendance, gradeDistribution }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7">
        <AttendanceChart averagePct={attendance?.averagePct} trend={attendance?.trend} />
      </div>
      <div className="lg:col-span-5">
        <SectionDistributionChart gradeDistribution={gradeDistribution} />
      </div>
    </div>
  );
}

