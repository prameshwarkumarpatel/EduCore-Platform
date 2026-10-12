"use client";
import React from "react";
import { User } from "lucide-react";

export default function ProfileAvatar({ student }) {
  const src = student?.photoUrl;
  return (
    <div className="relative">
      <div className="h-24 w-24 rounded-3xl border-4 border-blue-400/60 bg-blue-900/40 flex items-center justify-center overflow-hidden shadow-lg">
        {src ? (
          <img src={src} alt={student?.name || "Student"} className="w-full h-full object-cover" />
        ) : (
          <User className="h-10 w-10 text-blue-100" />
        )}
      </div>
    </div>
  );
}

