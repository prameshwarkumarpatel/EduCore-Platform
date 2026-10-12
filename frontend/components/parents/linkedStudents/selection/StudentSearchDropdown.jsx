"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { linkedStudentsApi } from "@/services/api/linkedStudentsApi";
import ClassFilter from "../filters/ClassFilter";
import SectionFilter from "../filters/SectionFilter";

export default function StudentSearchDropdown(props) {
  const { parentId, onSelect, onCancel } = props;
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ classes: [], sections: [] });

  const searchStudents = useCallback(async () => {
    if (!parentId) return;
    setLoading(true);
    try {
      const list = await linkedStudentsApi.searchStudents(parentId, {
        search: search.trim() || undefined,
        class: classFilter || undefined,
        section: sectionFilter || undefined,
      });
      setResults(Array.isArray(list) ? list : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [parentId, search, classFilter, sectionFilter]);

  useEffect(() => {
    const t = setTimeout(searchStudents, 300);
    return () => clearTimeout(t);
  }, [searchStudents]);

  useEffect(() => {
    fetch("http://localhost:5000/api/directory/filters")
      .then((r) => r.json())
      .then((f) => setFilters({ classes: f?.classes || [], sections: f?.sections || [] }))
      .catch(() => {});
  }, []);

  return (
    <div className="mt-2 space-y-2">
      <Input placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 text-sm" autoFocus />
      <div className="flex gap-2">
        <ClassFilter classes={filters.classes} value={classFilter} onChange={setClassFilter} compact />
        <SectionFilter sections={filters.sections} value={sectionFilter} onChange={setSectionFilter} compact />
      </div>
      <div className="max-h-48 overflow-y-auto rounded border bg-muted/30">
        {loading ? (
          <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
        ) : results.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">No students found</div>
        ) : (
          results.map((s) => (
            <button
              key={s.id}
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-primary/10 transition-colors"
              onClick={() => onSelect && onSelect(s.id)}
            >
              <span className="font-medium truncate">{s.name}</span>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">{s.assignedClass} {s.assignedSection ? "/ " + s.assignedSection : ""}</span>
            </button>
          ))
        )}
      </div>
      <button type="button" className="text-xs text-muted-foreground hover:underline" onClick={onCancel}>Cancel</button>
    </div>
  );
}
