"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Filter, Search, UserPlus } from "lucide-react";

export default function AdmissionsTopbar({ onDateFilter, onNewApplication }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admissions Control Center</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Monitor the entire application funnel in one view—status, trends, and pending approvals.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search applicants..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2" onClick={onDateFilter}>
          <Filter className="h-4 w-4" />
          Date range
        </Button>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button className="gap-2" onClick={onNewApplication}>
          <UserPlus className="h-4 w-4" />
          New Application
        </Button>
      </div>
    </div>
  );
}

