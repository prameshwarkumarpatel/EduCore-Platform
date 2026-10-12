"use client";
import React from "react";
import PersonalDetailsForm from "./PersonalDetailsForm";
import RoleSelector from "./RoleSelector";
import DepartmentSelector from "./DepartmentSelector";
import JoiningDetailsForm from "./JoiningDetailsForm";
import ProfilePhotoUpload from "../upload/ProfilePhotoUpload";

export default function StaffForm({ value, onChange, errors, departments }) {
  return (
    <div className="space-y-4">
      <PersonalDetailsForm value={value} onChange={onChange} errors={errors} />
      <RoleSelector value={value?.role} onChange={(role) => onChange({ ...value, role })} error={errors?.role} />
      <DepartmentSelector departments={departments} value={value?.department} onChange={(department) => onChange({ ...value, department })} error={errors?.department} />
      <ProfilePhotoUpload photoUrl={value?.photoUrl} onChange={(photoUrl) => onChange({ ...value, photoUrl })} />
      <JoiningDetailsForm value={value} onChange={onChange} errors={errors} />
    </div>
  );
}

