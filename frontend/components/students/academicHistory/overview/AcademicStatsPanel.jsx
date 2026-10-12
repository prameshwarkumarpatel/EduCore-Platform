"use client";
import React from "react";
import GPAOverviewCard from "./GPAOverviewCard";
import GradesSummaryCard from "./GradesSummaryCard";

export default function AcademicStatsPanel({ gpa, grades }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <GPAOverviewCard overallGpa={gpa?.overallGpa} latestGpa={gpa?.latestGpa} />
      </div>
      <div className="lg:col-span-8">
        <GradesSummaryCard latest={grades?.latest} />
      </div>
    </div>
  );
}

