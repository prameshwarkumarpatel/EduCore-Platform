"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function AssignRolePanel({ user, roles = [], onAssignRole, loading }) {
  const options = useMemo(() => roles.map((r) => r.name), [roles]);
  const [selectedRole, setSelectedRole] = useState(user?.role || options[0] || "Student");

  React.useEffect(() => {
    setSelectedRole(user?.role || options[0] || "Student");
  }, [user, options]);

  if (!user) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-amber-400/10 to-yellow-500/10 p-5 text-sm text-muted-foreground">
        Select a user to assign roles.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-amber-400/10 to-yellow-500/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Role Assignment</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Assign a role to this user</div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-8">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Role</div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background/60 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {(options.length ? options : ["Admin", "Teacher", "Staff", "Student", "Parent"]).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-4">
          <Button
            disabled={loading || !selectedRole}
            onClick={() => onAssignRole(user.id, selectedRole)}
            className="w-full gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400"
          >
            <ShieldCheck className="h-4 w-4" />
            {loading ? "Assigning..." : "Assign role"}
          </Button>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Current: <span className="font-semibold text-foreground">{user.role}</span>
      </div>
    </div>
  );
}

