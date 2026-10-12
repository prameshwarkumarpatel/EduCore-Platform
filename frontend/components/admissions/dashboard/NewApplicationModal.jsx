"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UserPlus } from "lucide-react";

export default function NewApplicationModal({ open, onClose, onCreate, loading }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", program: "" });
  const [error, setError] = useState("");

  if (!open) return null;

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.program.trim()) {
      setError("Name, email and program are required.");
      return;
    }
    try {
      await onCreate(form);
      setForm({ name: "", email: "", phone: "", program: "" });
    } catch (err) {
      setError(err?.message || "Failed to create application.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-black tracking-widest uppercase opacity-90">
                  New Application
                </div>
                <div className="text-xl font-extrabold">Register an applicant</div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-md p-2 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {error ? (
            <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              {error}
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Applicant name</div>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Email</div>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="applicant@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Phone</div>
              <Input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+91 9xxxx xxxxx"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Program / Class</div>
              <Input
                value={form.program}
                onChange={(e) => update("program", e.target.value)}
                placeholder="e.g. Grade 8, B.Sc IT"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

