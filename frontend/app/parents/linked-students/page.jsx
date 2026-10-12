import React from "react";
import LinkedStudentsDashboard from "@/components/parents/linkedStudents/LinkedStudentsDashboard";

export default function LinkedStudentsPage({ searchParams }) {
  const idParam = searchParams?.id;
  const parentId = Array.isArray(idParam) ? idParam[0] : idParam || "";
  return <LinkedStudentsDashboard initialParentId={parentId} />;
}
