"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { Building2, MapPin, ChevronRight } from 'lucide-react';
import BranchStatusBadge from './BranchStatusBadge';

const BranchCard = ({ branch, isSelected, onClick }) => (
  <div 
    onClick={() => onClick(branch)}
    className={cn(
      "p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group mb-4",
      isSelected 
        ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10" 
        : "border-transparent bg-white hover:border-blue-200 hover:shadow-md"
    )}
  >
    <div className="flex gap-4 items-start relative z-10">
      <div className={cn(
        "p-3 rounded-xl shrink-0 transition-colors",
        isSelected ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
      )}>
        <Building2 className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 truncate pr-2">{branch.name}</h3>
          <BranchStatusBadge status={branch.status} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium italic">
          <MapPin className="w-3 h-3 text-blue-400" />
          <span className="truncate">{branch.address.city}, {branch.address.state}</span>
        </div>
        <p className="text-[10px] font-black text-blue-600 mt-2 tracking-widest">{branch.code}</p>
      </div>
      <ChevronRight className={cn("w-5 h-5 mt-1 transition-transform", isSelected ? "text-blue-500 translate-x-1" : "text-gray-300 group-hover:text-blue-400")} />
    </div>
    {isSelected && <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />}
  </div>
);

export default function BranchListPanel({ branches, selectedId, onSelect }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Institutional Hubs</span>
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{branches.length} TOTAL</span>
      </div>
      {branches.length === 0 ? (
        <div className="text-center py-10 grayscale opacity-50 space-y-2">
          <Building2 className="w-12 h-12 mx-auto" />
          <p className="text-sm font-medium">No campuses found.</p>
        </div>
      ) : (
        branches.map(b => (
          <BranchCard 
            key={b.id} 
            branch={b} 
            isSelected={selectedId === b.id} 
            onClick={onSelect} 
          />
        ))
      )}
    </div>
  );
}
