"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Upload, Palette, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schoolProfileApi } from '@/services/api/schoolProfileApi';
import { useSchoolProfile } from '@/context/SchoolProfileContext';

export default function LogoUploadSection({ profile, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const { refreshProfile } = useSchoolProfile();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await schoolProfileApi.uploadLogo(reader.result);
        window.dispatchEvent(new Event("school-profile-updated"));
        await refreshProfile().catch(() => {});
        onUpdate();
      } catch (err) {
        console.error(err);
        alert("Upload failed.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-700 to-indigo-800 border-none shadow-xl text-white h-full relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-200" />
          Institutional Branding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="bg-black/30 rounded-3xl border-2 border-dashed border-purple-400/30 p-8 flex flex-col items-center justify-center gap-4 text-center hover:bg-black/40 transition-all group">
          <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden">
            {profile?.logo_url ? (
              <img src={profile.logo_url} alt="Logo Preview" className="w-full h-full object-contain p-2" />
            ) : (
              <ImageIcon className="w-10 h-10 text-purple-200" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">Identity Signature</h3>
            <p className="text-xs text-purple-200/70 max-w-[200px] mx-auto">Upload a high-resolution vectorial logo for global consistency.</p>
          </div>
          <Button 
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-purple-500 hover:bg-purple-400 text-white border-none shadow-lg shadow-purple-900/40 font-bold"
          >
            {uploading ? 'Processing Identity...' : <><Upload className="w-4 h-4 mr-2" /> Upload New Logo</>}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">Theme Configurations</h4>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-2 min-w-0">
               <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm shrink-0" />
               <span className="text-[10px] font-bold truncate">PRIMARY CORE</span>
             </div>
             <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-2 min-w-0">
               <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm shrink-0" />
               <span className="text-[10px] font-bold truncate">ACCENT CORE</span>
             </div>
          </div>
          <div className="flex items-center gap-2 text-purple-200 text-[10px] font-medium bg-purple-900/40 p-2 rounded-lg border border-purple-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Global branding is currently synchronized.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
