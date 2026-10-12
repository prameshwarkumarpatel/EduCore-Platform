"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import CommunicationLayout from "./layout/CommunicationLayout";
import CommunicationTopbar from "./layout/CommunicationTopbar";
import TypeFilter from "./filters/TypeFilter";
import DateFilter from "./filters/DateFilter";
import ParentFilter from "./filters/ParentFilter";
import MessageHistoryTable from "./messages/MessageHistoryTable";
import CallLogsTable from "./calls/CallLogsTable";
import NotificationHistoryList from "./notifications/NotificationHistoryList";
import SendMessagePanel from "./send/SendMessagePanel";
import BroadcastPanel from "./broadcast/BroadcastPanel";
import { communicationApi } from "@/services/api/communicationApi";
import { Button } from "@/components/ui/button";

export default function CommunicationDashboard({ initialParentId }) {
  const router = useRouter();

  const [parentId, setParentId] = useState(initialParentId || "");
  const [channelType, setChannelType] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [messages, setMessages] = useState([]);
  const [calls, setCalls] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Send form state (send to selected parent(s) from RecipientSelector)
  const [sendRecipients, setSendRecipients] = useState([]);
  const [sendChannel, setSendChannel] = useState("SMS");
  const [sendMessage, setSendMessage] = useState("");
  const [sendBusy, setSendBusy] = useState(false);

  // Broadcast form state
  const [broadcastRecipients, setBroadcastRecipients] = useState([]);
  const [broadcastChannel, setBroadcastChannel] = useState("SMS");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastBusy, setBroadcastBusy] = useState(false);

  const channelFilterForMessages = useMemo(() => {
    if (channelType === "SMS") return "SMS";
    if (channelType === "EMAIL") return "Email";
    if (channelType === "APP") return "Push";
    return undefined;
  }, [channelType]);

  // Keep the send recipients in sync with the currently selected parent.
  useEffect(() => {
    if (!parentId) {
      setSendRecipients([]);
      return;
    }
    setSendRecipients([parentId]);
    if (broadcastRecipients.length === 0) setBroadcastRecipients([parentId]);
  }, [parentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAll = async (targetParentId = parentId) => {
    if (!targetParentId) return;

    setLoading(true);
    setError("");
    try {
      const [m, c, n] = await Promise.all([
        communicationApi.fetchMessages(targetParentId, {
          channel: channelFilterForMessages,
          from: fromDate || undefined,
          to: toDate || undefined,
        }),
        communicationApi.fetchCalls(targetParentId, {
          from: fromDate || undefined,
          to: toDate || undefined,
        }),
        communicationApi.fetchNotifications(targetParentId, {
          from: fromDate || undefined,
          to: toDate || undefined,
        }),
      ]);
      setMessages(Array.isArray(m) ? m : []);
      setCalls(Array.isArray(c) ? c : []);
      setNotifications(Array.isArray(n) ? n : []);
    } catch (e) {
      setError(e?.message || "Failed to load communication records.");
      setMessages([]);
      setCalls([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!parentId) return;
    loadAll(parentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId, channelFilterForMessages, fromDate, toDate]);

  const refresh = async () => {
    if (!parentId) return;
    await loadAll(parentId);
  };

  const handleSend = async () => {
    const targetParentId = sendRecipients?.[0] || parentId;
    if (!targetParentId) return;
    if (!sendRecipients?.length) return;
    if (!sendMessage.trim()) {
      setError("Please type a message before sending.");
      return;
    }

    setSendBusy(true);
    setError("");
    try {
      // This endpoint sends to a single parent route; we take the first recipient as the “send” target.
      await communicationApi.sendMessage(targetParentId, {
        channel: sendChannel,
        message: sendMessage,
      });
      setSendMessage("");
      // If the user sends to another parent, switch context so the newly-sent message appears.
      if (targetParentId !== parentId) setParentId(targetParentId);
      await loadAll(targetParentId);
    } catch (e) {
      setError(e?.message || "Send failed.");
    } finally {
      setSendBusy(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastRecipients?.length) return;
    if (!broadcastMessage.trim()) {
      setError("Please type a broadcast message.");
      return;
    }

    setBroadcastBusy(true);
    setError("");
    try {
      await communicationApi.sendBroadcast({
        parentIds: broadcastRecipients,
        channel: broadcastChannel,
        message: broadcastMessage,
      });
      setBroadcastMessage("");
      await loadAll(parentId);
    } catch (e) {
      setError(e?.message || "Broadcast failed.");
    } finally {
      setBroadcastBusy(false);
    }
  };

  const logsReady = Boolean(parentId);

  return (
    <CommunicationLayout>
      <CommunicationTopbar
        parentId={parentId}
        onChangeParentId={(v) => setParentId(v)}
        onRefresh={refresh}
        loading={loading}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {!logsReady ? (
        <div className="rounded-2xl border border-dashed bg-background/30 p-10 text-center">
          <div className="text-muted-foreground">Select a parent to view communication logs.</div>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/parents/directory")}>
            Open Parent Directory
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <MessageHistoryTable items={messages} channelFilter={channelFilterForMessages} />
            <CallLogsTable items={calls} />
            <NotificationHistoryList items={notifications} />
          </div>

          <div className="xl:col-span-4 space-y-6">
            {/* Send */}
            <SendMessagePanel
              parentId={parentId}
              recipients={sendRecipients}
              onRecipientsChange={(next) => {
                setSendRecipients(next);
                const nextId = next?.[0] || "";
                if (nextId) setParentId(nextId);
              }}
              channel={sendChannel}
              onChannelChange={setSendChannel}
              message={sendMessage}
              onMessageChange={setSendMessage}
              onSend={handleSend}
              busy={sendBusy}
              disabled={loading || sendBusy || !parentId}
            />

            {/* Broadcast */}
            <BroadcastPanel
              parentId={parentId}
              recipients={broadcastRecipients}
              onRecipientsChange={(next) => setBroadcastRecipients(next)}
              channel={broadcastChannel}
              onChannelChange={setBroadcastChannel}
              message={broadcastMessage}
              onMessageChange={setBroadcastMessage}
              onBroadcast={handleBroadcast}
              busy={broadcastBusy}
              disabled={loading || broadcastBusy || !parentId}
            />

            {/* Filters */}
            <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 to-red-500/10 p-5 shadow-sm">
              <div className="text-xs font-black tracking-widest uppercase text-red-200/90">Filters</div>
              <div className="mt-3 space-y-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground">Communication type</div>
                  <TypeFilter value={channelType} onChange={setChannelType} />
                </div>
                <DateFilter from={fromDate} to={toDate} onChange={({ from, to }) => { setFromDate(from); setToDate(to); }} />
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-muted-foreground">Parent</div>
                  <ParentFilter valueIds={parentId ? [parentId] : []} onChange={(nextIds) => setParentId(nextIds?.[0] || "")} />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={refresh}
                  disabled={loading || !parentId}
                  className="w-full"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Apply / Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CommunicationLayout>
  );
}

