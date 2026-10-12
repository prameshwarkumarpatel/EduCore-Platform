"use client";
import React from "react";
import TotalStudentsCard from "./TotalStudentsCard";
import GradeDistributionCard from "./GradeDistributionCard";

export default function StudentOverviewPanel({ totalStudents, gradeDistribution }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4">
        <TotalStudentsCard total={totalStudents} />
      </div>
      <div className="lg:col-span-8">
        <GradeDistributionCard grades={gradeDistribution} />
      </div>
    </div>
  );
}

