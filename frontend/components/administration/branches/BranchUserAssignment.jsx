"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, UserPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { branchesApi } from '@/services/api/branchesApi';

export default function BranchUserAssignment({ branch }) {
  const [loading, setLoading] = useState(false);

  const handleAssignMock = async () => {
    const role = prompt("Enter role to assign (Student/Teacher/Staff):");
    if (!['Student', 'Teacher', 'Staff'].includes(role)) return alert("Invalid role.");
    
    setLoading(true);
    try {
      await branchesApi.assignUsers({ branchId: branch.id, userId: 'user-123', role });
      alert("Role assigned successfully!");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-400 to-yellow-500 border-none shadow-xl text-white relative overflow-hidden h-full">
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-bold flex items-center gap-2 drop-shadow-md">
          <Users className="w-5 h-5 text-amber-100" />
          Personnel Logistics Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="bg-black/20 rounded-2xl p-6 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-100">Distribution Overview</h4>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-amber-50">Branch: {branch.name}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/10 rounded-xl border border-white/5">
              <p className="text-2xl font-black">124</p>
              <p className="text-[10px] uppercase font-bold text-amber-100/70 mt-1">Students</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/5">
              <p className="text-2xl font-black">12</p>
              <p className="text-[10px] uppercase font-bold text-amber-100/70 mt-1">Teachers</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/5">
              <p className="text-2xl font-black">08</p>
              <p className="text-[10px] uppercase font-bold text-amber-100/70 mt-1">Support</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
           <Button 
            disabled={loading}
            onClick={handleAssignMock}
            className="w-full h-12 bg-white text-amber-700 hover:bg-amber-50 font-black tracking-tight"
           >
             <UserPlus className="w-4 h-4 mr-2" /> Assign Personnel to Hub
           </Button>
           <p className="text-[10px] text-center text-amber-50/70 italic flex items-center justify-center gap-1.5">
             <CheckCircle2 className="w-3 h-3 text-emerald-300" /> All Personnel are currently synchronized.
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
