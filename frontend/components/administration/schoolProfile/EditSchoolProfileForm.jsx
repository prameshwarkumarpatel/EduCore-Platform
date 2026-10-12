"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, AlertCircle, Building2, Globe, Phone, Mail } from 'lucide-react';
import { schoolProfileApi } from '@/services/api/schoolProfileApi';
import { useSchoolProfile } from '@/context/SchoolProfileContext';

export default function EditSchoolProfileForm({ profile, onUpdate }) {
  const [formData, setFormData] = useState(profile || {});
  const [saving, setSaving] = useState(false);
  const { refreshProfile, setProfileOptimistic } = useSchoolProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await schoolProfileApi.updateProfile(formData);
      const updated = res?.data || res;
      setProfileOptimistic(updated);
      window.dispatchEvent(new Event("school-profile-updated"));
      await refreshProfile().catch(() => {});
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Synchronization protocol failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddrChange = (field, value) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [field]: value }
    });
  };

  return (
    <Card className="bg-gradient-to-br from-orange-400 to-rose-500 border-none shadow-2xl text-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
      <CardHeader>
        <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
          <Building2 className="w-7 h-7" />
          Identity Management Console
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 relative z-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* General */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Core Metadata
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold opacity-80">INSTRUCTION NAME</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-11"
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-bold opacity-80">ESTABLISHED YEAR</label>
                  <Input 
                    type="number"
                    className="bg-white/10 border-white/20 text-white h-11"
                    value={formData.established_year || ''} 
                    onChange={e => setFormData({...formData, established_year: e.target.value})} 
                  />
               </div>
               <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold opacity-80">GLOBAL MOTTO / SLOGAN</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white h-11"
                    value={formData.motto || ''} 
                    onChange={e => setFormData({...formData, motto: e.target.value})} 
                  />
               </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-100">Connectivity</h3>
             <div className="space-y-3">
               <div className="relative group">
                 <Phone className="absolute left-3 top-3.5 w-4 h-4 text-orange-200" />
                 <Input 
                    className="pl-10 bg-white/10 border-white/20 text-white h-11"
                    value={formData.phone || ''}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
               </div>
               <div className="relative group">
                 <Mail className="absolute left-3 top-3.5 w-4 h-4 text-orange-200" />
                 <Input 
                    className="pl-10 bg-white/10 border-white/20 text-white h-11"
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
               </div>
               <div className="relative group">
                 <Globe className="absolute left-3 top-3.5 w-4 h-4 text-orange-200" />
                 <Input 
                    className="pl-10 bg-white/10 border-white/20 text-white h-11"
                    value={formData.website || ''}
                    onChange={e => setFormData({...formData, website: e.target.value})}
                  />
               </div>
             </div>
          </div>

          {/* Address */}
          <div className="space-y-4 lg:col-span-3 pt-6 border-t border-white/10 mt-2">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-100">Geographic Logistics</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="text-[10px] font-bold opacity-80">STREET ADDRESS</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white h-11"
                    value={formData.address?.street || ''}
                    onChange={e => handleAddrChange('street', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-80">CITY / LOCALITY</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white h-11"
                    value={formData.address?.city || ''}
                    onChange={e => handleAddrChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold opacity-80">STATE / REGION</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white h-11"
                    value={formData.address?.state || ''}
                    onChange={e => handleAddrChange('state', e.target.value)}
                  />
                </div>
             </div>
          </div>

          <div className="lg:col-span-3 flex justify-end pt-8">
             <Button 
                disabled={saving}
                type="submit"
                className="bg-white text-rose-600 hover:bg-rose-50 px-12 h-14 text-lg font-black tracking-tighter shadow-xl shadow-rose-900/30"
             >
                {saving ? 'Synchronizing State...' : <><Save className="w-5 h-5 mr-3" /> Commit Global Updates</>}
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
