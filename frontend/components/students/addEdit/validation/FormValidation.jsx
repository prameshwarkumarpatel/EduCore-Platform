"use client";

export function validateStudent(payload, { mode } = {}) {
  const errors = {};
  if (!payload?.name || !String(payload.name).trim()) errors.name = "Name is required";
  if (mode === "confirm") {
    if (!payload?.assignedClass) errors.assignedClass = "Grade/Class is required";
    if (!payload?.assignedSection) errors.assignedSection = "Section is required";
  }
  return errors;
}

