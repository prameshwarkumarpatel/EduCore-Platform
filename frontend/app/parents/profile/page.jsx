import React from "react";
import ParentProfileDashboard from "@/components/parents/profile/ParentProfileDashboard";

export default function Page({ searchParams }) {
  const idParam = searchParams?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam || "";
  return <ParentProfileDashboard parentId={id} />;
}
