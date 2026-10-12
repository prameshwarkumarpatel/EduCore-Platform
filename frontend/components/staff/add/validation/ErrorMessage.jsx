"use client";
import React from "react";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <div className="text-xs text-rose-300 mt-1">{message}</div>;
}

