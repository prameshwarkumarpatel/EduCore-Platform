"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileBadge, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { organizationApi } from '@/services/api/organizationApi';

const PolicyItem = ({ policy }) => (
  <div className="bg-white/60 hover:bg-white/80 p-5 rounded-xl border border-amber-200/50 shadow-sm transition-all group cursor-pointer relative overflow-hidden">
    <div className="absolute top-0 right-0 w-2 h-full bg-amber-400 group-hover:bg-amber-500 transition-colors" />
    <h3 className="font-bold text-amber-950 text-base">{policy.title}</h3>
    <p className="text-sm text-yellow-900/70 mt-1 leading-relaxed pr-6">{policy.content}</p>
    <div className="flex items-center gap-2 mt-4">
      <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
        {policy.is_active ? 'Active' : 'Draft'}
      </span>
    </div>
  </div>
);

export default function PoliciesPanel({ policies }) {
  const [items, setItems] = useState(policies || []);

  const handleEnforcePolicy = async () => {
    const title = prompt("Enter new Policy Title:");
    if (!title) return;
    const content = prompt("Enter Policy Description/Rules:");
    if (!content) return;

    try {
      const response = await organizationApi.addPolicy(title, content);
      if (response && response.data) {
        setItems([...items, response.data]);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to enforce policy.");
    }
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-200 to-amber-300 border-none shadow-xl h-full relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/20 blur-3xl rounded-full" />
      <CardHeader className="flex flex-row items-center justify-between pb-4 relative z-10">
        <CardTitle className="text-amber-950 text-xl font-bold tracking-tight flex items-center gap-2">
          <FileBadge className="w-6 h-6 text-amber-700" />
          Organizational Policies
        </CardTitle>
        <Button onClick={handleEnforcePolicy} className="bg-amber-600 hover:bg-amber-700 text-white shadow-md border-none flex gap-2">
          <Plus className="w-4 h-4" /> Enforce New Policy
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {items?.map(p => <PolicyItem key={p.id} policy={p} />)}
      </CardContent>
    </Card>
  );
}
