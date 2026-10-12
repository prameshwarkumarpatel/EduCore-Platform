"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { organizationApi } from '@/services/api/organizationApi';

export default function OrganizationDetailsForm({ defaults, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaults || {});

  // Sync defaults on load if they arrive later
  React.useEffect(() => {
    if (defaults) setFormData(defaults);
  }, [defaults]);

  const handleUpdate = async () => {
    try {
      const res = await organizationApi.updateDetails(formData);
      const updated = res?.data || res;
      setFormData(updated);
      onUpdated?.(updated);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 border-none shadow-xl text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-2xl font-black font-sans tracking-tight drop-shadow-sm">System Identity Details</CardTitle>
        <Button 
          variant="outline" 
          className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-blue-900 transition-colors"
          onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
        >
          {isEditing ? <><Save className="w-4 h-4 mr-2" /> Save Form</> : 'Update Details'}
        </Button>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-4">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-white/10 border border-white/20 p-2 rounded text-white" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Org Name" />
            <input className="bg-white/10 border border-white/20 p-2 rounded text-white" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Contact Email" />
            <input className="bg-white/10 border border-white/20 p-2 rounded text-white" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Phone Numbers" />
            <input className="bg-white/10 border border-white/20 p-2 rounded text-white" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Campus Address" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm shrink-0 shadow-inner group-hover:bg-white/20 transition-colors">
              <Building2 className="w-16 h-16 text-blue-100 drop-shadow-md" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">{formData.name || 'EduPro Global Enterprise'}</h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-blue-100/90 font-medium">
                <div className="flex items-center gap-2 bg-blue-900/40 px-3 py-1.5 rounded-full"><MapPin className="w-4 h-4 text-blue-300" /> {formData.address}</div>
                <div className="flex items-center gap-2 bg-blue-900/40 px-3 py-1.5 rounded-full"><Phone className="w-4 h-4 text-blue-300" /> {formData.phone}</div>
                <div className="flex items-center gap-2 bg-blue-900/40 px-3 py-1.5 rounded-full"><Mail className="w-4 h-4 text-blue-300" /> {formData.email}</div>
              </div>
              <p className="text-xs text-blue-200 uppercase tracking-widest mt-2">Registration ID: {formData.registration_number || defaults?.registration_number}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
