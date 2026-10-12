"use client";
import React, { useEffect, useState } from 'react';
import { schoolProfileApi } from '@/services/api/schoolProfileApi';
import SchoolProfileCard from './SchoolProfileCard';
import ContactInfoPanel from './ContactInfoPanel';
import AddressPanel from './AddressPanel';
import LogoUploadSection from './LogoUploadSection';
import EditSchoolProfileForm from './EditSchoolProfileForm';
import ViewSchoolProfile from './ViewSchoolProfile';
import { Button } from '@/components/ui/button';
import { Edit3, Eye } from 'lucide-react';

export default function SchoolProfileDashboard() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await schoolProfileApi.fetchProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-primary animate-pulse font-medium">Synchronizing Institutional Identity...</div>;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Edit3 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold">School Profile Management</h2>
        </div>
        <Button 
          variant={isEditing ? "outline" : "default"} 
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          {isEditing ? <><Eye className="w-4 h-4" /> View Profile</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
        </Button>
      </div>

      {isEditing ? (
        <EditSchoolProfileForm profile={profile} onUpdate={fetchData} />
      ) : (
        <ViewSchoolProfile profile={profile} onUpdate={fetchData} />
      )}
    </div>
  );
}
