"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, Save, X, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { branchesApi } from '@/services/api/branchesApi';

export default function EditBranchForm({ branch, onCancel, onSuccess }) {
  const [formData, setFormData] = useState(branch);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await branchesApi.editBranch(branch.id, formData);
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateAddr = (f, v) => setFormData({...formData, address: {...formData.address, [f]: v}});
  const updateCont = (f, v) => setFormData({...formData, contact: {...formData.contact, [f]: v}});

  return (
    <Card className="bg-white border-2 border-blue-200 shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-blue-50 bg-blue-600 text-white p-6">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Synchronize Campus Parameters
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-blue-700 font-bold"><X className="w-5 h-5" /></Button>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Campus Identity</label>
              <Input 
                className="h-12 border-blue-100 focus-visible:ring-blue-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-blue-600 uppercase tracking-widest">Visibility Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full h-12 rounded-md border border-blue-100 bg-blue-50/50 px-3 py-2 text-sm font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Operational (Active)</option>
                <option value="Inactive">Halted (Inactive)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <MapPin className="w-4 h-4" /> Update Geographic Logistics
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input className="h-11" placeholder="Street Address" value={formData.address.street} onChange={e => updateAddr('street', e.target.value)} />
                </div>
                <Input className="h-11" placeholder="City" value={formData.address.city} onChange={e => updateAddr('city', e.target.value)} />
                <Input className="h-11" placeholder="State" value={formData.address.state} onChange={e => updateAddr('state', e.target.value)} />
             </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-100">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Hub-ID: {branch.code}</p>
             <div className="flex gap-3">
               <Button variant="ghost" onClick={onCancel} type="button">Discard</Button>
               <Button disabled={saving} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-11 font-bold">
                 {saving ? "Commiting..." : <><CheckCircle2 className="w-4 h-4 mr-2" /> Commit Global Update</>}
               </Button>
             </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
