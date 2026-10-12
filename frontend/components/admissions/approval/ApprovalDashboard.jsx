"use client";
import React, { useEffect, useState } from "react";
import TrackingLayout from "../applicationTracking/layout/TrackingLayout";
import { approvalApi } from "@/services/api/approvalApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ApprovalQueueTable from "./list/ApprovalQueueTable";
import ApplicationReviewPanel from "./details/ApplicationReviewPanel";
import ClassSectionAssignment from "./actions/ClassSectionAssignment";
import ApproveApplicationButton from "./actions/ApproveApplicationButton";
import RejectApplicationButton from "./actions/RejectApplicationButton";
import ConfirmationGenerator from "./actions/ConfirmationGenerator";
import NotificationSender from "./notifications/NotificationSender";
import ApprovalHistoryPanel from "./history/ApprovalHistoryPanel";

export default function ApprovalDashboard() {
  const [queue, setQueue] = useState([]);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState(null);
  const [classes, setClasses] = useState([]);
  const [history, setHistory] = useState([]);
  const [confirmation, setConfirmation] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [remarks, setRemarks] = useState("");

  const loadQueue = async (q) => {
    const list = await approvalApi.fetchApprovalQueue({ search: q ?? search, status: statusFilter || undefined });
    setQueue(Array.isArray(list) ? list : []);
    if (!selected && list && list.length) setSelected(list[0]);
  };

  const loadReview = async (id) => {
    const data = await approvalApi.fetchApplicationReview(id);
    setReview(data);
    setRemarks("");
    setConfirmation(null);
    const hist = await approvalApi.fetchApprovalHistory(id);
    setHistory(Array.isArray(hist) ? hist : []);
  };

  const loadAll = async () => {
    setError("");
    setLoading(true);
    try {
      const [cls] = await Promise.all([approvalApi.fetchClasses()]);
      setClasses(Array.isArray(cls) ? cls : []);
      await loadQueue("");
    } catch (e) {
      setError(e?.message || "Failed to load approval module.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    loadQueue(search).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (!selected?.id) return;
    loadReview(selected.id).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const selectApp = (app) => setSelected(app);

  const refresh = async () => {
    await loadQueue(search);
    if (selected?.id) {
      await loadReview(selected.id);
    }
  };

  const assign = async (payload) => {
    if (!selected?.id) return;
    setBusy(true);
    setError("");
    try {
      await approvalApi.assignClassSection(selected.id, payload);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to assign class/section.");
    } finally {
      setBusy(false);
    }
  };

  const approve = async () => {
    if (!selected?.id) return;
    setBusy(true);
    setError("");
    try {
      await approvalApi.approveApplication(selected.id, remarks);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to approve application.");
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    if (!selected?.id) return;
    setBusy(true);
    setError("");
    try {
      await approvalApi.rejectApplication(selected.id, remarks);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to reject application.");
    } finally {
      setBusy(false);
    }
  };

  const generate = async () => {
    if (!selected?.id) return;
    setBusy(true);
    setError("");
    try {
      const res = await approvalApi.generateConfirmation(selected.id);
      setConfirmation(res?.data || res);
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to generate confirmation.");
    } finally {
      setBusy(false);
    }
  };

  const sendNotification = async ({ channel, message }) => {
    if (!selected?.id) return;
    setBusy(true);
    setError("");
    try {
      await approvalApi.sendNotification(selected.id, { channel, message });
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to send notification.");
    } finally {
      setBusy(false);
    }
  };

  if (loading && !queue.length) {
    return (
      <TrackingLayout>
        <div className="p-10 text-center animate-pulse text-primary">Loading approval workflow...</div>
      </TrackingLayout>
    );
  }

  const canApprove = review?.status === "Pending";
  const assignedOk = Boolean(review?.assignedClass && review?.assignedSection);

  return (
    <TrackingLayout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Final Approval</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Review, assign, approve or reject applications and generate confirmations with audit history.
          </p>
        </div>
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queue..."
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:w-44"
        >
          <option value="">All status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <Button
          variant="outline"
          onClick={() => loadQueue(search).catch(() => {})}
          disabled={busy}
        >
          Apply
        </Button>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-4">
            <ApprovalQueueTable applications={queue} selectedId={selected?.id} onSelect={selectApp} />
          </div>
          <div className="xl:col-span-7 space-y-4">
            <ApplicationReviewPanel app={review} />

            <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-lime-500/10 p-4 shadow-sm space-y-3">
              <div className="text-xs font-black tracking-widest uppercase text-muted-foreground">Approval Actions</div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Remarks (optional)</div>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Add a note for approval/rejection..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <ApproveApplicationButton onClick={approve} disabled={!review || busy || !canApprove || !assignedOk} />
                <RejectApplicationButton onClick={reject} disabled={!review || busy || review?.status !== "Pending"} />
              </div>
              {!assignedOk && canApprove ? (
                <div className="text-[11px] text-muted-foreground">
                  Assign class and section before approving.
                </div>
              ) : null}
            </div>

            <ClassSectionAssignment
              classes={classes}
              value={review}
              onAssign={assign}
              disabled={!review || busy}
            />

            <ConfirmationGenerator
              confirmation={confirmation || (review?.confirmationCode ? { confirmationCode: review.confirmationCode, assignedClass: review.assignedClass, assignedSection: review.assignedSection, issuedAt: new Date().toISOString() } : null)}
              onGenerate={generate}
              disabled={!review || busy || review?.status !== "Approved"}
            />

            <NotificationSender
              app={review}
              confirmation={confirmation}
              onSend={sendNotification}
              disabled={!review || busy}
            />

            <ApprovalHistoryPanel history={history} />
          </div>
        </div>
      </div>
    </TrackingLayout>
  );
}

