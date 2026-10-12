"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddStaffLayout from "./layout/AddStaffLayout";
import AddStaffTopbar from "./layout/AddStaffTopbar";
import AddStaffSidebar from "./layout/AddStaffSidebar";
import StaffForm from "./form/StaffForm";
import SaveStaffButton from "./actions/SaveStaffButton";
import UpdateStaffButton from "./actions/UpdateStaffButton";
import CancelButton from "./actions/CancelButton";
import ErrorMessage from "./validation/ErrorMessage";
import { validateStaffForm } from "./validation/FormValidation";
import { addStaffApi } from "@/services/api/addStaffApi";

const EMPTY = {
  id: "",
  name: "",
  dob: "",
  gender: "",
  role: "Teacher",
  department: "",
  joiningDate: "",
  employeeId: "",
  email: "",
  phone: "",
  status: "Active",
  photoUrl: "",
};

export default function AddStaffDashboard() {
  const router = useRouter();
  const [draft, setDraft] = useState(EMPTY);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    addStaffApi.fetchDepartments().then((d) => setDepartments(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const save = async () => {
    const e = validateStaffForm(draft);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setBanner("");
    try {
      const created = await addStaffApi.createStaff(draft);
      if (draft.photoUrl && created?.id) {
        await addStaffApi.uploadProfilePhoto(created.id, draft.photoUrl).catch(() => {});
      }
      setDraft({ ...EMPTY, id: created?.id || "" });
      setBanner("Staff record created successfully.");
    } catch (err) {
      setBanner(err?.message || "Create failed.");
    } finally {
      setBusy(false);
    }
  };

  const update = async () => {
    if (!draft?.id) {
      setBanner("Load or create a staff record first.");
      return;
    }
    const e = validateStaffForm(draft);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setBanner("");
    try {
      const updated = await addStaffApi.updateStaff(draft.id, draft);
      if (draft.photoUrl) {
        await addStaffApi.uploadProfilePhoto(draft.id, draft.photoUrl).catch(() => {});
      }
      setDraft({ ...draft, ...updated });
      setBanner("Staff record updated successfully.");
    } catch (err) {
      setBanner(err?.message || "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    setDraft(EMPTY);
    setErrors({});
    setBanner("");
  };

  return (
    <AddStaffLayout>
      <AddStaffTopbar />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-4">
          <StaffForm value={draft} onChange={setDraft} errors={errors} departments={departments} />
          <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 to-red-500/10 p-4 shadow-sm">
            <div className="text-xs font-black tracking-widest uppercase text-rose-100/80">Actions</div>
            <div className="mt-3 flex gap-2">
              <SaveStaffButton onClick={save} disabled={busy} />
              <UpdateStaffButton onClick={update} disabled={busy || !draft?.id} />
              <CancelButton onClick={cancel} disabled={busy} />
            </div>
          </div>
          <ErrorMessage message={banner} />
        </div>
        <div className="xl:col-span-4 space-y-4">
          <AddStaffSidebar />
          <div className="rounded-2xl border bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-4 shadow-sm">
            <div className="text-xs font-black tracking-widest uppercase text-teal-100/80">Validation</div>
            <ul className="mt-2 text-xs text-muted-foreground space-y-1">
              <li>Name is required</li>
              <li>Role is required</li>
              <li>Department is required</li>
              <li>Joining date is required</li>
            </ul>
          </div>
          <button onClick={() => router.push("/staff/directory")} className="text-xs text-primary hover:underline">Go to Staff Directory</button>
        </div>
      </div>
    </AddStaffLayout>
  );
}

