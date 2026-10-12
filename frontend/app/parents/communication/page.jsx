import React from "react";
import CommunicationDashboard from "@/components/parents/communication/CommunicationDashboard";

export default function CommunicationPage({ searchParams }) {
  const idParam = searchParams?.id;
  const parentId = Array.isArray(idParam) ? idParam[0] : idParam || "";
  return <CommunicationDashboard initialParentId={parentId} />;
}

