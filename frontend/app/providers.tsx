"use client";

import React from "react";
import { SchoolProfileProvider } from "@/context/SchoolProfileContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SchoolProfileProvider>{children}</SchoolProfileProvider>;
}

