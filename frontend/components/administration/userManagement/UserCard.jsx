"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Mail, Phone, ShieldCheck, UserCircle2 } from "lucide-react";

function roleTone(role) {
  const r = String(role || "").toLowerCase();
  if (r === "admin") return "from-indigo-600 to-sky-500";
  if (r === "teacher") return "from-emerald-600 to-lime-500";
  if (r === "staff") return "from-amber-500 to-yellow-400";
  if (r === "parent") return "from-fuchsia-600 to-purple-500";
  return "from-slate-600 to-slate-500";
}

export default function UserCard({ user, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(user)}
      className={cn(
        "w-full text-left rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md",
        selected ? "border-primary/40 bg-primary/5" : "border-muted bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("h-11 w-11 rounded-xl grid place-items-center text-white shadow bg-gradient-to-br", roleTone(user.role))}>
          <UserCircle2 className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate">
              <div className="font-bold text-foreground truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <div
              className={cn(
                "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border",
                user.isActive ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-400" : "border-rose-300/40 bg-rose-500/10 text-rose-400"
              )}
            >
              {user.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{user.role}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                <Phone className="h-3.5 w-3.5" />
                <span className="truncate">{user.phone}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

