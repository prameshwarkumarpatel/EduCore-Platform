"use client";
import React, { useState } from "react";
import AdmissionsLayout from "../dashboard/layout/AdmissionsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { admissionsApi } from "@/services/api/admissionsApi";
import { useRouter } from "next/navigation";

export default function NewApplicationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.program.trim()) {
      setError("Name, email and program/class are required.");
      return;
    }
    try {
      setBusy(true);
      await admissionsApi.createApplication(form);
      router.push("/admissions/dashboard");
    } catch (e) {
      setError(e?.message || "Failed to submit application.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdmissionsLayout>
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">New Application</h1>
          <p className="text-muted-foreground mt-1">
            Capture student and guardian details to create a new admission application.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-5 space-y-3">
            <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
              Student Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Full name</div>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Student name"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Email</div>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="student@example.com"
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
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admissions/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </AdmissionsLayout>
  );
}

