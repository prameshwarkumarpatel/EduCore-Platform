"use client";
import React, { useMemo, useState } from "react";
import FormNavigation from "./FormNavigation";
import PersonalDetailsForm from "./PersonalDetailsForm";
import AcademicDetailsForm from "./AcademicDetailsForm";
import ContactDetailsForm from "./ContactDetailsForm";
import ProfilePhotoUpload from "../upload/ProfilePhotoUpload";
import ErrorMessages from "../validation/ErrorMessages";
import { validateStudent } from "../validation/FormValidation";

export default function StudentForm({
  value,
  onChange,
  classes,
  errors,
  step,
  onStepChange,
  uploadingPhoto,
  onPhotoChange,
}) {
  const steps = useMemo(
    () => [
      { key: "personal", label: "Personal", hint: "Name, DOB, gender, status" },
      { key: "academic", label: "Academic", hint: "Class and section assignment" },
      { key: "contact", label: "Contact", hint: "Email, phone, address, guardian" },
      { key: "photo", label: "Photo", hint: "Upload and preview profile image" },
    ],
    []
  );

  const current = Math.max(0, Math.min(step ?? 0, steps.length - 1));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-3">
        <FormNavigation steps={steps} current={current} onChange={onStepChange} />
      </div>
      <div className="xl:col-span-9 space-y-4">
        <ErrorMessages errors={errors} />

        {current === 0 ? <PersonalDetailsForm value={value} onChange={onChange} /> : null}
        {current === 1 ? <AcademicDetailsForm value={value} onChange={onChange} classes={classes} /> : null}
        {current === 2 ? <ContactDetailsForm value={value} onChange={onChange} /> : null}
        {current === 3 ? (
          <ProfilePhotoUpload value={value?.photoUrl} onChange={onPhotoChange} uploading={uploadingPhoto} />
        ) : null}
      </div>
    </div>
  );
}

