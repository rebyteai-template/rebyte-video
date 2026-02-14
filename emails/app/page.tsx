"use client";

import { useState, useEffect, useCallback } from "react";

interface Campaign {
  name: string;
  channel: "email" | "sms";
  description: string;
  subject?: string;
  message?: string;
}

interface Group {
  id: number;
  name: string;
  type: "static" | "dynamic";
  channel: "email" | "sms";
  preset: string | null;
  last_synced_at: string | null;
  member_count: number;
}

interface Member {
  id: number;
  email: string;
  phone: string;
  name: string;
}

interface ClerkPreset {
  id: string;
  label: string;
  description: string;
}

type Tab = "preview" | "send";
type SidebarView = "campaign" | "group";

function ChannelBadge({
  channel,
  inverted,
}: {
  channel: "email" | "sms";
  inverted?: boolean;
}) {
  if (channel === "sms") {
    return (
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
          inverted
            ? "bg-gray-700 text-green-300"
            : "bg-green-100 text-green-700"
        }`}
      >
        sms
      </span>
    );
  }
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
        inverted
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      email
    </span>
  );
}

export default function Console() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [sidebarView, setSidebarView] = useState<SidebarView>("campaign");
  const [tab, setTab] = useState<Tab>("preview");
  const [previewHtml, setPreviewHtml] = useState("");
  const [fromAddress, setFromAddress] = useState("hello@rebyte.ai");
  const [subject, setSubject] = useState("Hello from Rebyte");
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendTo, setSendTo] = useState<"group" | "single">("group");
  const [singleEmail, setSingleEmail] = useState("");
  const [singlePhone, setSinglePhone] = useState("");
  const [sendGroupId, setSendGroupId] = useState<number | "">("");

  // Group management state
  const [members, setMembers] = useState<Member[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupChannel, setNewGroupChannel] = useState<"email" | "sms">(
    "email"
  );
  const [groupStatus, setGroupStatus] = useState<string | null>(null);

  // Dynamic group state
  const [clerkPresets, setClerkPresets] = useState<ClerkPreset[]>([]);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const selectedCampaign = campaigns.find((c) => c.name === selected) ?? null;
  const isSmsGroup = selectedGroup?.channel === "sms";
  const isSmsCampaign = selectedCampaign?.channel === "sms";

  const loadGroups = useCallback(async () => {
    const res = await fetch("/api/groups");
    const data = await res.json();
    setGroups(data);
  }, []);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then(setCampaigns);
    loadGroups();
    fetch("/api/clerk-presets")
      .then((r) => r.json())
      .then(setClerkPresets);
  }, [loadGroups]);

  const loadPreview = useCallback(async (name: string) => {
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign: name }),
    });
    const { html } = await res.json();
    setPreviewHtml(html);
  }, []);

  const selectCampaign = useCallback(
    (name: string) => {
      setSidebarView("campaign");
      setSelected(name);
      setSelectedGroup(null);
      setSendResult(null);
      setTab("preview");
      setSendGroupId("");
      const campaign = campaigns.find((c) => c.name === name);
      if (campaign?.channel === "email" && campaign.subject) {
        setSubject(campaign.subject);
        loadPreview(name);
      }
    },
    [campaigns, loadPreview]
  );

  const loadMembers = useCallback(async (groupId: number) => {
    const res = await fetch(`/api/groups/${groupId}/members`);
    const data = await res.json();
    setMembers(data);
  }, []);

  const selectGroup = useCallback(
    (group: Group) => {
      setSidebarView("group");
      setSelectedGroup(group);
      setSelected(null);
      setGroupStatus(null);
      loadMembers(group.id);
    },
    [loadMembers]
  );

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newGroupName.trim(),
        channel: newGroupChannel,
      }),
    });
    if (res.ok) {
      setNewGroupName("");
      loadGroups();
    } else {
      const data = await res.json();
      setGroupStatus(`Error: ${data.error}`);
    }
  };

  const handleCreateDynamicGroup = async (presetId: string) => {
    const preset = clerkPresets.find((p) => p.id === presetId);
    if (!preset) return;
    setShowPresetPicker(false);
    setSyncing(true);
    setGroupStatus(null);
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: preset.label, preset: presetId }),
    });
    setSyncing(false);
    if (res.ok) {
      const group = await res.json();
      await loadGroups();
      selectGroup({
        id: group.id,
        name: group.name,
        type: "dynamic",
        channel: group.channel || "email",
        preset: presetId,
        last_synced_at: group.last_synced_at,
        member_count: 0,
      });
    } else {
      const data = await res.json();
      setGroupStatus(`Error: ${data.error}`);
    }
  };

  const handleSyncGroup = async () => {
    if (!selectedGroup || selectedGroup.type !== "dynamic") return;
    setSyncing(true);
    setGroupStatus(null);
    const res = await fetch(`/api/groups/${selectedGroup.id}/sync`, {
      method: "POST",
    });
    setSyncing(false);
    if (res.ok) {
      const data = await res.json();
      setGroupStatus(
        `Synced ${data.member_count} members from Clerk`
      );
      setSelectedGroup({
        ...selectedGroup,
        last_synced_at: data.last_synced_at,
        member_count: data.member_count,
      });
      loadMembers(selectedGroup.id);
      loadGroups();
    } else {
      const data = await res.json();
      setGroupStatus(`Error: ${data.error}`);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm("Delete this group and all its members?")) return;
    await fetch(`/api/groups/${groupId}`, { method: "DELETE" });
    setSelectedGroup(null);
    setMembers([]);
    loadGroups();
  };

  const handleAddMember = async () => {
    if (!selectedGroup) return;
    if (isSmsGroup) {
      if (!newPhone.trim()) return;
      const res = await fetch(`/api/groups/${selectedGroup.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newPhone, name: newName }),
      });
      if (res.ok) {
        setNewPhone("");
        setNewName("");
        loadMembers(selectedGroup.id);
        loadGroups();
      } else {
        const data = await res.json();
        setGroupStatus(`Error: ${data.error}`);
      }
    } else {
      if (!newEmail.includes("@")) return;
      const res = await fetch(`/api/groups/${selectedGroup.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName }),
      });
      if (res.ok) {
        setNewEmail("");
        setNewName("");
        loadMembers(selectedGroup.id);
        loadGroups();
      } else {
        const data = await res.json();
        setGroupStatus(`Error: ${data.error}`);
      }
    }
  };

  const handleRemoveMember = async (member: Member) => {
    if (!selectedGroup) return;
    const body = isSmsGroup ? { phone: member.phone } : { email: member.email };
    await fetch(`/api/groups/${selectedGroup.id}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    loadMembers(selectedGroup.id);
    loadGroups();
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !selectedGroup) return;
    setGroupStatus(null);
    const form = new FormData();
    form.append("file", e.target.files[0]);
    const res = await fetch(`/api/groups/${selectedGroup.id}/members`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (res.ok) {
      setGroupStatus(`Imported ${data.added} members (${data.skipped} skipped)`);
      loadMembers(selectedGroup.id);
      loadGroups();
    } else {
      setGroupStatus(`Error: ${data.error}`);
    }
    e.target.value = "";
  };

  const handleSend = async (dryRun: boolean) => {
    if (!selected || !selectedCampaign) return;
    const isSingle = sendTo === "single";
    const group = groups.find((g) => g.id === sendGroupId);
    const targetCount = isSingle ? 1 : group?.member_count || 0;

    if (
      !dryRun &&
      !window.confirm(
        isSingle
          ? isSmsCampaign
            ? `Send SMS to ${singlePhone}? This cannot be undone.`
            : `Send to ${singleEmail}? This cannot be undone.`
          : `Send to ${targetCount} recipients in "${group?.name}"? This cannot be undone.`
      )
    )
      return;

    setLoading(true);
    setSendResult(null);
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaign: selected,
        from: fromAddress,
        subject,
        dryRun,
        ...(isSingle
          ? isSmsCampaign
            ? { phone: singlePhone }
            : { email: singleEmail }
          : { groupId: sendGroupId }),
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setSendResult(`Error: ${data.error}`);
    } else if (dryRun) {
      if (isSmsCampaign) {
        setSendResult(
          `Dry run: ${data.total} SMS would be sent.\n\nPreview recipients:\n${(data.previews || []).map((p: { phone: string; message: string }) => `  ${p.phone}: "${p.message}"`).join("\n")}`
        );
      } else {
        setSendResult(
          `Dry run: ${data.total} emails would be sent.\n\nPreview recipients:\n${(data.previews || []).map((p: { email: string }) => `  ${p.email}`).join("\n")}`
        );
      }
    } else {
      setSendResult(`Sent: ${data.sent}, Failed: ${data.failed}`);
    }
  };

  // Filter groups to match campaign channel in send tab
  const matchingGroups = selectedCampaign
    ? groups.filter((g) => g.channel === selectedCampaign.channel)
    : groups;

  const tabs: { id: Tab; label: string }[] = [
    { id: "preview", label: "Preview" },
    { id: "send", label: "Send" },
  ];

  const isDynamic = selectedGroup?.type === "dynamic";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col overflow-auto">
        <h1 className="text-lg font-semibold mb-4">Campaigns</h1>
        <div className="space-y-1 mb-6">
          {campaigns.map((c) => (
            <button
              key={c.name}
              onClick={() => selectCampaign(c.name)}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                selected === c.name
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium flex items-center gap-1.5">
                {c.name}
                <ChannelBadge
                  channel={c.channel}
                  inverted={selected === c.name}
                />
              </div>
              <div
                className={`text-xs ${selected === c.name ? "text-gray-300" : "text-gray-500"}`}
              >
                {c.description}
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold mb-3">Groups</h2>
          <div className="space-y-1 mb-3">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => selectGroup(g)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  selectedGroup?.id === g.id
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium flex items-center gap-1.5">
                  {g.name}
                  <ChannelBadge
                    channel={g.channel}
                    inverted={selectedGroup?.id === g.id}
                  />
                  {g.type === "dynamic" && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                        selectedGroup?.id === g.id
                          ? "bg-gray-700 text-gray-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      sync
                    </span>
                  )}
                </div>
                <div
                  className={`text-xs ${selectedGroup?.id === g.id ? "text-gray-300" : "text-gray-500"}`}
                >
                  {g.member_count} members
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-1 mb-1">
            <input
              type="text"
              placeholder="New group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
              className="flex-1 min-w-0 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}
              className="px-2 py-1 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 shrink-0"
            >
              +
            </button>
          </div>
          <div className="flex gap-2 mb-2 px-1">
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <input
                type="radio"
                name="newGroupChannel"
                checked={newGroupChannel === "email"}
                onChange={() => setNewGroupChannel("email")}
                className="w-3 h-3"
              />
              email
            </label>
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <input
                type="radio"
                name="newGroupChannel"
                checked={newGroupChannel === "sms"}
                onChange={() => setNewGroupChannel("sms")}
                className="w-3 h-3"
              />
              sms
            </label>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowPresetPicker(!showPresetPicker)}
              disabled={syncing}
              className="w-full px-2 py-1 text-sm text-blue-700 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "+ Dynamic group from Clerk"}
            </button>
            {showPresetPicker && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10">
                {clerkPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleCreateDynamicGroup(p.id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-gray-500">{p.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {sidebarView === "campaign" && selected && selectedCampaign ? (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white px-6">
              <div className="flex gap-6">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`py-3 text-sm font-medium border-b-2 ${
                      tab === t.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-6">
              {tab === "preview" && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {isSmsCampaign ? (
                    <div className="p-6">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                        SMS Message Preview
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {selectedCampaign.message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-[700px] border-0"
                      title="Email preview"
                      sandbox=""
                    />
                  )}
                </div>
              )}

              {tab === "send" && (
                <div className="max-w-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Send to
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="sendTo"
                          checked={sendTo === "group"}
                          onChange={() => setSendTo("group")}
                        />
                        Group
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="sendTo"
                          checked={sendTo === "single"}
                          onChange={() => setSendTo("single")}
                        />
                        {isSmsCampaign ? "Single phone" : "Single email"}
                      </label>
                    </div>
                    {sendTo === "group" && (
                      <select
                        value={sendGroupId}
                        onChange={(e) =>
                          setSendGroupId(
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select a group...</option>
                        {matchingGroups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.member_count} members)
                          </option>
                        ))}
                      </select>
                    )}
                    {sendTo === "single" && isSmsCampaign && (
                      <input
                        type="tel"
                        placeholder="+1234567890"
                        value={singlePhone}
                        onChange={(e) => setSinglePhone(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    )}
                    {sendTo === "single" && !isSmsCampaign && (
                      <input
                        type="email"
                        placeholder="recipient@example.com"
                        value={singleEmail}
                        onChange={(e) => setSingleEmail(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    )}
                  </div>
                  {!isSmsCampaign && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From
                        </label>
                        <input
                          type="email"
                          value={fromAddress}
                          onChange={(e) => setFromAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleSend(true)}
                      disabled={
                        loading ||
                        (sendTo === "group" && !sendGroupId) ||
                        (sendTo === "single" &&
                          !isSmsCampaign &&
                          !singleEmail.includes("@")) ||
                        (sendTo === "single" &&
                          isSmsCampaign &&
                          !singlePhone.trim())
                      }
                      className="px-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                    >
                      {loading ? "Running..." : "Dry Run"}
                    </button>
                    <button
                      onClick={() => handleSend(false)}
                      disabled={
                        loading ||
                        (sendTo === "group" && !sendGroupId) ||
                        (sendTo === "single" &&
                          !isSmsCampaign &&
                          !singleEmail.includes("@")) ||
                        (sendTo === "single" &&
                          isSmsCampaign &&
                          !singlePhone.trim())
                      }
                      className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </div>
                  {sendResult && (
                    <pre className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-sm whitespace-pre-wrap">
                      {sendResult}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </>
        ) : sidebarView === "group" && selectedGroup ? (
          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                <ChannelBadge channel={selectedGroup.channel} />
                {isDynamic && (
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    dynamic
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isDynamic && (
                  <button
                    onClick={handleSyncGroup}
                    disabled={syncing}
                    className="px-3 py-1.5 text-sm text-blue-700 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
                  >
                    {syncing ? "Syncing..." : "Refresh from Clerk"}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteGroup(selectedGroup.id)}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                >
                  Delete Group
                </button>
              </div>
            </div>

            {isDynamic && selectedGroup.last_synced_at && (
              <div className="mb-4 text-xs text-gray-500">
                Last synced: {new Date(selectedGroup.last_synced_at + "Z").toLocaleString()}
              </div>
            )}

            {groupStatus && (
              <div className="mb-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                {groupStatus}
              </div>
            )}

            {/* Add member row — only for static groups */}
            {!isDynamic && (
              <div className="flex gap-2 mb-4">
                {isSmsGroup ? (
                  <input
                    type="tel"
                    placeholder="+1234567890"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                ) : (
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                )}
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                  className="w-48 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleAddMember}
                  disabled={
                    isSmsGroup ? !newPhone.trim() : !newEmail.includes("@")
                  }
                  className="px-4 py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  Add
                </button>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium cursor-pointer hover:bg-gray-50">
                  Import CSV
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleCsvImport}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Members table */}
            {members.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">
                        #
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">
                        {isSmsGroup ? "Phone" : "Email"}
                      </th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">
                        Name
                      </th>
                      {!isDynamic && <th className="w-10"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, i) => (
                      <tr
                        key={m.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-2">
                          {isSmsGroup ? m.phone : m.email}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {m.name || "\u2014"}
                        </td>
                        {!isDynamic && (
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleRemoveMember(m)}
                              className="text-gray-400 hover:text-red-500 text-sm"
                            >
                              {"\u00d7"}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
                  {members.length} members
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {isDynamic
                  ? "No members. Click \"Refresh from Clerk\" to sync."
                  : isSmsGroup
                    ? "No members yet. Add phone numbers manually or import a CSV."
                    : "No members yet. Add emails manually or import a CSV."}
              </p>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a campaign or group to get started
          </div>
        )}
      </div>
    </div>
  );
}
