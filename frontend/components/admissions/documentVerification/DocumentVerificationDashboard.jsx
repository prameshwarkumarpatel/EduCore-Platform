"use client";
import React, { useEffect, useMemo, useState } from "react";
import TrackingLayout from "../applicationTracking/layout/TrackingLayout";
import { documentVerificationApi } from "@/services/api/documentVerificationApi";
import SearchDocuments from "./filters/SearchDocuments";
import StatusFilter from "./filters/StatusFilter";
import DocumentTypeFilter from "./filters/DocumentTypeFilter";
import DocumentListTable from "./list/DocumentListTable";
import DocumentViewer from "./viewer/DocumentViewer";
import PendingDocumentsPanel from "./alerts/PendingDocumentsPanel";
import ApproveDocumentButton from "./actions/ApproveDocumentButton";
import RejectDocumentButton from "./actions/RejectDocumentButton";
import VerificationStatusToggle from "./actions/VerificationStatusToggle";
import RemarksInput from "./actions/RemarksInput";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function DocumentVerificationDashboard() {
  const [documents, setDocuments] = useState([]);
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [zoom, setZoom] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [statusDraft, setStatusDraft] = useState("Pending");

  const typeOptions = useMemo(() => {
    const set = new Set(documents.map((d) => d.type));
    return Array.from(set);
  }, [documents]);

  const loadAll = async (params = {}) => {
    setError("");
    setLoading(true);
    try {
      const [docs, alerts] = await Promise.all([
        documentVerificationApi.fetchDocuments(params),
        documentVerificationApi.fetchPendingAlerts(),
      ]);
      setDocuments(Array.isArray(docs) ? docs : []);
      setPending(Array.isArray(alerts) ? alerts : []);
      if (!selected && docs && docs.length) {
        setSelected(docs[0]);
      }
    } catch (e) {
      setError(e?.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    loadAll({ search, status, type }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type]);

  const selectDoc = async (doc) => {
    setSelected(doc);
    setZoom(1);
    try {
      const details = await documentVerificationApi.fetchDocumentDetails(doc.id);
      setSelected(details);
      setRemarks(details.remarks || "");
      setStatusDraft(details.verificationStatus || "Pending");
    } catch {
      setRemarks(doc.remarks || "");
      setStatusDraft(doc.verificationStatus || "Pending");
    }
  };

  const refresh = async () => {
    await loadAll({ search, status, type });
    if (selected?.id) {
      const details = await documentVerificationApi.fetchDocumentDetails(selected.id).catch(() => null);
      if (details) {
        setSelected(details);
        setRemarks(details.remarks || "");
        setStatusDraft(details.verificationStatus || "Pending");
      }
    }
  };

  const approve = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await documentVerificationApi.approveDocument(selected.id, remarks);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to approve document.");
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await documentVerificationApi.rejectDocument(selected.id, remarks);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to reject document.");
    } finally {
      setBusy(false);
    }
  };

  const saveStatus = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await documentVerificationApi.updateVerificationStatus(selected.id, statusDraft, remarks);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to update verification status.");
    } finally {
      setBusy(false);
    }
  };

  const saveRemarks = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await documentVerificationApi.addVerificationRemarks(selected.id, remarks);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to save remarks.");
    } finally {
      setBusy(false);
    }
  };

  if (loading && !documents.length) {
    return (
      <TrackingLayout>
        <div className="p-10 text-center animate-pulse text-primary">Loading document verification...</div>
      </TrackingLayout>
    );
  }

  return (
    <TrackingLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Document Verification</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Review uploaded documents, add remarks, and approve or reject to ensure accurate admission records.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
        <div className="rounded-2xl border bg-gradient-to-r from-teal-500/10 to-cyan-500/10 p-4 shadow-sm">
          <div className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">
            Filters & Search
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-6">
              <SearchDocuments value={search} onChange={setSearch} />
            </div>
            <div className="md:col-span-3">
              <StatusFilter value={status} onChange={setStatus} />
            </div>
            <div className="md:col-span-3">
              <DocumentTypeFilter value={type} onChange={setType} options={typeOptions} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              onClick={() => loadAll({ search, status, type }).catch(() => {})}
              disabled={busy}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-4">
            <DocumentListTable documents={documents} selectedId={selected?.id} onSelect={selectDoc} />
          </div>

          <div className="xl:col-span-5 space-y-4">
            <DocumentViewer doc={selected} zoom={zoom} onZoom={setZoom} />

            <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-4 shadow-sm space-y-3">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">
                Verification Actions
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <ApproveDocumentButton onClick={approve} disabled={!selected || busy} />
                <RejectDocumentButton onClick={reject} disabled={!selected || busy} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <VerificationStatusToggle
                  value={statusDraft}
                  onChange={setStatusDraft}
                  disabled={!selected || busy}
                />
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={saveStatus}
                  disabled={!selected || busy}
                >
                  <Save className="h-4 w-4" />
                  Save status
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-gradient-to-br from-amber-400/10 to-yellow-500/10 p-4 shadow-sm space-y-3">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Remarks</div>
              <RemarksInput value={remarks} onChange={setRemarks} />
              <div className="flex justify-end">
                <Button variant="outline" className="gap-2" onClick={saveRemarks} disabled={!selected || busy}>
                  <Save className="h-4 w-4" />
                  Save remarks
                </Button>
              </div>
            </div>

            <PendingDocumentsPanel pending={pending} onSelect={selectDoc} />
          </div>
        </div>
      </div>
    </TrackingLayout>
  );
}

