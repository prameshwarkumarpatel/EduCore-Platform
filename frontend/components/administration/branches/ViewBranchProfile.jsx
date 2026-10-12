import React from 'react';

export default function ViewBranchProfile({ branch }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 shadow-sm">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900">{branch.name}</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Institutional Signature: {branch.code}</p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl">
           <p className="text-2xl font-black">100%</p>
           <p className="text-[10px] font-bold uppercase">Uptime</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
           <p className="font-bold text-lg">{branch.status}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Personnel</p>
           <p className="font-bold text-lg">148 Active</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Entity Type</p>
           <p className="font-bold text-lg">Regional Wing</p>
        </div>
      </div>
    </div>
  );
}
