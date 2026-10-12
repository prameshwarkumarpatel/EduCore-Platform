"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sliders, ToggleLeft, ToggleRight } from 'lucide-react';

const SettingItem = ({ setting }) => {
  const [active, setActive] = useState(setting.value === true);

  return (
    <div className="flex items-center justify-between p-4 bg-emerald-900/40 border border-emerald-500/20 rounded-xl hover:bg-emerald-800/50 transition-colors cursor-pointer group">
      <div>
        <p className="font-semibold text-emerald-50 tracking-tight">{setting.title}</p>
        <p className="text-xs text-emerald-200/70 mt-1 uppercase tracking-widest">{setting.category}</p>
      </div>
      <div onClick={() => setActive(!active)}>
        {typeof setting.value === 'boolean' ? (
          active ? <ToggleRight className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> : <ToggleLeft className="w-8 h-8 text-emerald-700" />
        ) : (
          <span className="text-sm font-black bg-emerald-500/20 px-3 py-1 rounded text-emerald-200 border border-emerald-500/30">
            {setting.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default function SystemSettingsPanel({ settings }) {
  return (
    <Card className="bg-gradient-to-bl from-teal-700 to-emerald-800 border-none shadow-xl text-white">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 font-bold tracking-tight">
          <Sliders className="w-5 h-5 text-emerald-300" />
          Global System Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {settings?.map(s => <SettingItem key={s.id} setting={s} />)}
      </CardContent>
    </Card>
  );
}
