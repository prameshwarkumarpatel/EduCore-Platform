"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { parentDirectoryApi } from "@/services/api/parentDirectoryApi";

export default function RecipientSelector({
  valueIds,
  onChange,
  allowMultiple = true,
  placeholder = "Search parents...",
  disabled = false,
}) {
  const current = useMemo(() => (Array.isArray(valueIds) ? valueIds : valueIds ? [valueIds] : []), [valueIds]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const searchParents = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const list = await parentDirectoryApi.searchParents(query.trim());
      setResults(Array.isArray(list) ? list : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const t = setTimeout(() => searchParents(), 250);
    return () => clearTimeout(t);
  }, [searchParents]);

  const pick = (id) => {
    if (disabled) return;
    if (!id) return;

    if (!allowMultiple) {
      onChange?.([id]);
      setOpen(false);
      return;
    }

    if (current.includes(id)) return;
    onChange?.([...current, id]);
    setOpen(true);
  };

  const remove = (id) => {
    if (disabled) return;
    onChange?.(current.filter((x) => x !== id));
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="h-9 text-xs"
        />
        {open && query.trim() ? (
          <div className="absolute z-50 mt-2 w-full rounded-xl border bg-card shadow-xl max-h-56 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-xs text-muted-foreground">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground">No parents found</div>
            ) : (
              results.slice(0, 12).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="w-full text-left px-3 py-2 text-xs hover:bg-primary/10 transition-colors"
                  onClick={() => pick(p.id)}
                >
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {p.email || p.phone || p.id}
                  </div>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      {current.length ? (
        <div className="flex flex-wrap gap-2">
          {current.map((id) => (
            <span key={id} className="inline-flex items-center gap-1 rounded-full border bg-muted/30 px-2 py-0.5 text-[11px]">
              <span className="font-semibold">{id}</span>
              <button type="button" onClick={() => remove(id)} disabled={disabled} className="opacity-80 hover:opacity-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-muted-foreground">No recipients selected.</div>
      )}
    </div>
  );
}

