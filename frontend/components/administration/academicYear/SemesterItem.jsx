"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function SemesterItem({ semester, onChange, onRemove }) {
  const update = (k, v) => onChange({ ...semester, [k]: v });

  return (
    <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-end">
      <div className="flex-1">
        <div className="text-xs font-semibold text-muted-foreground mb-1">Name</div>
        <Input
          value={semester.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Term 1"
        />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-muted-foreground mb-1">Start</div>
        <Input
          type="date"
          value={semester.startDate ? semester.startDate.substring(0, 10) : ""}
          onChange={(e) => update("startDate", e.target.value)}
        />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-muted-foreground mb-1">End</div>
        <Input
          type="date"
          value={semester.endDate ? semester.endDate.substring(0, 10) : ""}
          onChange={(e) => update("endDate", e.target.value)}
        />
      </div>
      <div className="md:self-end">
        <Button variant="outline" size="icon" className="mt-5" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

