/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { schoolProfileApi } from "@/services/api/schoolProfileApi";

export type SchoolProfile = {
  name?: string;
  motto?: string;
  logo_url?: string;
  email?: string;
  phone?: string;
  website?: string;
  established_year?: number | string;
  address?: Record<string, any>;
  branding?: Record<string, any>;
};

type SchoolProfileContextValue = {
  profile: SchoolProfile | null;
  loading: boolean;
  error: string;
  refreshProfile: () => Promise<void>;
  setProfileOptimistic: (next: SchoolProfile) => void;
};

const SchoolProfileContext = createContext<SchoolProfileContextValue | null>(null);

export function SchoolProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProfile = useCallback(async () => {
    setError("");
    try {
      const data = await schoolProfileApi.fetchProfile();
      setProfile(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load school profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  const setProfileOptimistic = useCallback((next: SchoolProfile) => {
    setProfile(next);
  }, []);

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    const handler = () => refreshProfile().catch(() => {});
    window.addEventListener("school-profile-updated", handler);
    return () => window.removeEventListener("school-profile-updated", handler);
  }, [refreshProfile]);

  const value = useMemo(
    () => ({ profile, loading, error, refreshProfile, setProfileOptimistic }),
    [profile, loading, error, refreshProfile, setProfileOptimistic]
  );

  return <SchoolProfileContext.Provider value={value}>{children}</SchoolProfileContext.Provider>;
}

export function useSchoolProfile() {
  const ctx = useContext(SchoolProfileContext);
  if (!ctx) throw new Error("useSchoolProfile must be used within SchoolProfileProvider");
  return ctx;
}

