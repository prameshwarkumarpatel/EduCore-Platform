"use client";
import React from 'react';
import SchoolProfileCard from './SchoolProfileCard';
import ContactInfoPanel from './ContactInfoPanel';
import AddressPanel from './AddressPanel';
import LogoUploadSection from './LogoUploadSection';

export default function ViewSchoolProfile({ profile, onUpdate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left duration-700">
        <SchoolProfileCard profile={profile} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ContactInfoPanel contact={profile} />
          <AddressPanel address={profile?.address} />
        </div>
      </div>
      <div className="lg:col-span-1 animate-in fade-in slide-in-from-right duration-700">
        <LogoUploadSection profile={profile} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
