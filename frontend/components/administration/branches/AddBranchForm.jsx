"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, Save, X, Phone, Mail, MapPin } from 'lucide-react';
import { branchesApi } from '@/services/api/branchesApi';

export default function AddBranchForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    status: 'Active',
    address: { street: '', city: '', state: '', zip: '' },
    contact: { phone: '', email: '' }
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await branchesApi.addBranch(formData);
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("Registration failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateAddr = (f, v) => setFormData({...formData, address: {...formData.address, [f]: v}});
  const updateCont = (f, v) => setFormData({...formData, contact: {...formData.contact, [f]: v}});

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 shadow-xl animate-in zoom-in-95 duration-300">
      <CardHeader className="flex flex-row items-center justify-between border-b border-emerald-100 bg-emerald-500 text-white rounded-t-xl">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Register New Campus Asset
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-emerald-600"><X className="w-5 h-5" /></Button>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Campus Identity</label>
              <Input 
                placeholder="e.g. West Coast Regional Wing" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Institutional Code</label>
              <Input 
                placeholder="CAMP-XXXX" 
                required
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
               <MapPin className="w-4 h-4" /> Geographic Logistics
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <Input placeholder="Street Address" value={formData.address.street} onChange={e => updateAddr('street', e.target.value)} />
                </div>
                <Input placeholder="City" value={formData.address.city} onChange={e => updateAddr('city', e.target.value)} />
                <Input placeholder="State/ZIP" value={formData.address.state} onChange={e => updateAddr('state', e.target.value)} />
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
               <Phone className="w-4 h-4" /> Point of Contact
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-emerald-500" />
                  <Input className="pl-10" placeholder="Branch Phone" value={formData.contact.phone} onChange={e => updateCont('phone', e.target.value)} />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-emerald-500" />
                  <Input className="pl-10" placeholder="Branch Email" value={formData.contact.email} onChange={e => updateCont('email', e.target.value)} />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
             <Button variant="outline" onClick={onCancel} type="button">Discard</Button>
             <Button disabled={saving} type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
               {saving ? "Registering..." : <><Save className="w-4 h-4 mr-2" /> Initialize Campus</>}
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
