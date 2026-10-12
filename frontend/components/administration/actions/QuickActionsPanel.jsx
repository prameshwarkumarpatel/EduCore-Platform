"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Shield, Building, Megaphone } from 'lucide-react';

const ActionButton = ({ title, icon: Icon, onClick }) => (
  <Button 
    onClick={onClick}
    className="w-full justify-start gap-3 bg-white/20 hover:bg-white/30 text-amber-950 border-none shadow-none text-left h-auto py-3 font-semibold transition-colors"
  >
    <div className="bg-amber-100 p-1.5 rounded text-amber-700">
      <Icon className="w-4 h-4" />
    </div>
    {title}
  </Button>
);

export default function QuickActionsPanel() {
  const handleAction = (action) => alert(`Action Trigged: ${action}`);

  return (
    <Card className="bg-gradient-to-br from-yellow-300 to-amber-400 border-none shadow-lg h-full relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="text-amber-950 text-xl font-extrabold tracking-tight">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 relative z-10">
        <ActionButton title="Add User" icon={UserPlus} onClick={() => handleAction("Add User")} />
        <ActionButton title="Create Role" icon={Shield} onClick={() => handleAction("Add Role")} />
        <ActionButton title="Add Branch" icon={Building} onClick={() => handleAction("Add Branch")} />
        <ActionButton title="Send Announcement" icon={Megaphone} onClick={() => handleAction("Announcement")} />
      </CardContent>
    </Card>
  );
}
