"use client";

export function validateStaffForm(v) {
  const errors = {};
  if (!String(v.name || "").trim()) errors.name = "Name is required";
  if (!String(v.role || "").trim()) errors.role = "Role is required";
  if (!String(v.department || "").trim()) errors.department = "Department is required";
  if (!String(v.joiningDate || "").trim()) errors.joiningDate = "Joining date is required";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v.email))) errors.email = "Invalid email";
  return errors;
}

