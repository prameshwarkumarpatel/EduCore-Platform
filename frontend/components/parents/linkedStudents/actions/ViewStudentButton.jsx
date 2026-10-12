"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function ViewStudentButton({ studentId }) {
  const router = useRouter();
  if (!studentId) return null;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 gap-1 text-xs"
      onClick={() => router.push(`/students/profile?id=${studentId}`)}
    >
      <ExternalLink className="h-3.5 w-3.5" />
      View
    </Button>
  );
}
