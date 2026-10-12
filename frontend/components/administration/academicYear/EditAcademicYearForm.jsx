"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangePicker from "./DateRangePicker";
import { Save } from "lucide-react";

export default function EditAcademicYearForm({ year, onSubmit, loading }) {
  const [form, setForm] = useState(() => ({
    year: year?.year || "",
    startDate: year?.startDate || "",
    endDate: year?.endDate || "",
  }));
  const [error, setError] = useState("");

  if (!year) {
    return (
      <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 text-sm text-muted-foreground">
        Select an academic year to edit.
      </div>
    );
  }

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.year.trim() || !form.startDate || !form.endDate) {
      setError("Year label, start date, and end date are required.");
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError("Start date must be before end date.");
      return;
    }
    try {
      await onSubmit(year.id, form);
    } catch (err) {
      setError(err?.message || "Failed to update academic year.");
    }
  };

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 shadow-sm">
      <div>
        <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Edit Academic Year</div>
        <div className="text-lg font-extrabold tracking-tight text-foreground">Update timeline</div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error ? (
          <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>
        ) : null}

        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-1">Academic year label</div>
          <Input
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
            placeholder="e.g. 2026-2027"
          />
        </div>

        <DateRangePicker
          startDate={form.startDate}
          endDate={form.endDate}
          onChange={({ startDate, endDate }) => setForm((p) => ({ ...p, startDate, endDate }))}
        />

        <div className="flex items-center justify-end pt-1">
          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-black hover:from-emerald-400 hover:to-lime-400"
          >
            <Save className="h-4 w-4" />
            {loading ? "Updating..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

