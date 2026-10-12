"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LinkedStudentsLayout from "./layout/LinkedStudentsLayout";
import LinkedStudentsList from "./list/LinkedStudentsList";
import LinkStudentButton from "./actions/LinkStudentButton";
import StudentDetailCard from "./details/StudentDetailCard";
import ClassFilter from "./filters/ClassFilter";
import SectionFilter from "./filters/SectionFilter";
import { parentProfileApi } from "@/services/api/parentProfileApi";
import { linkedStudentsApi } from "@/services/api/linkedStudentsApi";

export default function LinkedStudentsDashboard({ initialParentId }) {
  const router = useRouter();
  const [parentId, setParentId] = useState(initialParentId || "");
  const [parent, setParent] = useState(null);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ classes: [], sections: [] });
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const loadParent = async (id) => {
    if (!id) return;
    setError("");
    setLoading(true);
    try {
      const p = await parentProfileApi.fetchParentProfile(id);
      setParent(p);
      const list = await linkedStudentsApi.fetchLinkedStudents(id);
      setLinkedStudents(Array.isArray(list) ? list : []);
      setSelectedStudent(null);
    } catch (e) {
      setError(e?.message || "Failed to load parent.");
      setParent(null);
      setLinkedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialParentId) setParentId(initialParentId);
  }, [initialParentId]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentParentId");
      if (stored && !parentId) setParentId(stored);
    } catch {}
    const handler = (e) => {
      const pid = e?.detail?.parentId;
      if (pid) setParentId(pid);
    };
    window.addEventListener("parent-selected", handler);
    return () => window.removeEventListener("parent-selected", handler);
  }, []);

  useEffect(() => {
    if (parentId) loadParent(parentId);
  }, [parentId]);

  useEffect(() => {
    fetch("http://localhost:5000/api/directory/filters")
      .then((r) => r.json())
      .then((f) => setFilters({ classes: f?.classes || [], sections: f?.sections || [] }))
      .catch(() => {});
  }, []);

  const handleLinked = () => loadParent(parentId);
  const handleUnlink = () => loadParent(parentId);

  const handleRelationshipChange = async (studentId, relationshipType) => {
    if (!parentId) return;
    try {
      const list = await linkedStudentsApi.updateRelationshipType(parentId, studentId, relationshipType);
      setLinkedStudents(Array.isArray(list) ? list : []);
    } catch (e) {
      alert(e?.message || "Failed to update relationship.");
    }
  };

  const filteredStudents = (linkedStudents || []).filter((s) => {
    if (classFilter && s.assignedClass !== classFilter) return false;
    if (sectionFilter && s.assignedSection !== sectionFilter) return false;
    return true;
  });

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    if (!parentId || !student?.id) return;
    try {
      const details = await linkedStudentsApi.fetchStudentDetails(parentId, student.id);
      setSelectedStudent(details);
    } catch {
      setSelectedStudent(student);
    }
  };

  return (
    <LinkedStudentsLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Linked Students</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Manage parent-student relationships, link or unlink students, and view child details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <Input
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            placeholder="Parent ID"
            className="sm:w-56"
          />
          <Button variant="outline" onClick={() => loadParent(parentId)} disabled={loading || !parentId}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => router.push("/parents/directory")}>
            <UsersRound className="h-4 w-4 mr-2" />
            Directory
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading && !parent ? (
        <div className="p-10 text-center animate-pulse text-primary">Loading...</div>
      ) : parent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border bg-gradient-to-br from-blue-500/15 via-sky-500/20 to-blue-600/15 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-blue-100/90">Linked Students List</h2>
                <LinkStudentButton parentId={parentId} onLinked={handleLinked} />
              </div>
              <LinkedStudentsList
                students={filteredStudents}
                parentId={parentId}
                onUnlink={handleUnlink}
                onRelationshipChange={handleRelationshipChange}
              />
            </div>

            <div className="rounded-2xl border bg-gradient-to-br from-orange-500/15 to-amber-500/10 p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-100/90 mb-4">Multiple Children</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(filteredStudents || []).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStudent(s)}
                    className={`rounded-xl border p-3 text-left transition-all hover:border-primary/40 ${
                      selectedStudent?.id === s.id ? "border-primary bg-primary/5" : "border-border/50 bg-card/30"
                    }`}
                  >
                    <div className="font-semibold truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.assignedClass} {s.assignedSection}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-teal-100/90 mb-4">Filters</h2>
              <div className="space-y-3">
                <ClassFilter classes={filters.classes} value={classFilter} onChange={setClassFilter} />
                <SectionFilter sections={filters.sections} value={sectionFilter} onChange={setSectionFilter} />
              </div>
            </div>

            <div className="rounded-2xl border bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-100/90 mb-4">Student Details</h2>
              <StudentDetailCard student={selectedStudent} />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-background/30">
          <p className="text-muted-foreground">Enter a Parent ID or go to Directory to select a parent.</p>
          <Button className="mt-4" onClick={() => router.push("/parents/directory")}>
            Open Directory
          </Button>
        </div>
      )}
    </LinkedStudentsLayout>
  );
}
