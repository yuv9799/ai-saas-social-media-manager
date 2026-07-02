"use client";

import { useState } from "react";
import {
  IconBuilding,
  IconUsers,
  IconCreditCard,
  IconCheck,
  IconUserPlus,
  IconBrandLinkedin,
  IconBrandInstagram,
  IconBrandX,
  IconBrandTiktok,
  IconBrandPinterest,
} from "@tabler/icons-react";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("Personal Workspace");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [saving, setSaving] = useState(false);

  const team = [
    { email: "owner@company.com", role: "OWNER", joined: "July 2026" },
    { email: "editor@company.com", role: "EDITOR", joined: "July 2026" },
    { email: "viewer@company.com", role: "VIEWER", joined: "July 2026" },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    alert(`Invited ${inviteEmail} as ${inviteRole}!`);
    setInviteEmail("");
  };

  const handleSaveWorkspace = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Workspace settings saved!");
    }, 800);
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-fg3 font-medium">Manage workspaces, team permissions, and billing plans</p>
      </div>

      {/* Workspace Settings */}
      <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border2 pb-3">
          <IconBuilding size={18} className="text-violet" />
          <h2 className="text-sm font-bold text-fg">Workspace Profile</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-fg2 mb-1.5 block">Workspace Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full max-w-[400px] px-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet"
            />
          </div>
          <button
            onClick={handleSaveWorkspace}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-violet text-white hover:bg-violet-dim transition-all cursor-pointer"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Team Member Invitations */}
      <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border2 pb-3">
          <IconUsers size={18} className="text-violet" />
          <h2 className="text-sm font-bold text-fg">Team & Collaborators</h2>
        </div>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2 max-w-[600px]">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 px-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet"
            required
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-3 py-2 text-xs bg-card-custom border border-border2 rounded-xl text-fg outline-none"
          >
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-violet text-white hover:bg-violet-dim transition-all cursor-pointer"
          >
            <IconUserPlus size={14} />
            Invite
          </button>
        </form>

        <div className="border border-border2 rounded-xl overflow-hidden bg-card-custom/20">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border2 bg-card-custom/50 text-fg3 font-semibold">
                <th className="p-3">Email Address</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member.email} className="border-b border-border2/60 last:border-0 hover:bg-white/[0.01]">
                  <td className="p-3 text-fg2 font-medium">{member.email}</td>
                  <td className="p-3 text-fg3">{member.role}</td>
                  <td className="p-3 text-fg3">{member.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border2 pb-3">
          <IconCheck size={18} className="text-violet" />
          <h2 className="text-sm font-bold text-fg">Connected Accounts</h2>
        </div>
        <div className="grid gap-3">
          {[
            { id: "linkedin", name: "LinkedIn Page", icon: IconBrandLinkedin, color: "text-[#0a66c2]", connected: true },
            { id: "x", name: "X (Twitter) Profile", icon: IconBrandX, color: "text-white", connected: true },
            { id: "instagram", name: "Instagram Business", icon: IconBrandInstagram, color: "text-[#d62976]", connected: false },
            { id: "pinterest", name: "Pinterest Board", icon: IconBrandPinterest, color: "text-[#bd081c]", connected: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between border border-border2 rounded-xl p-4 bg-card-custom/20 hover:border-border-custom transition-all">
              <div className="flex items-center gap-3">
                <item.icon size={20} className={item.color} />
                <span className="text-xs font-semibold text-fg">{item.name}</span>
              </div>
              <button
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  item.connected
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-border2 bg-card-custom hover:border-violet text-fg2"
                }`}
              >
                {item.connected ? "Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Plan & Billing */}
      <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border2 pb-3">
          <IconCreditCard size={18} className="text-violet" />
          <h2 className="text-sm font-bold text-fg">Plan & Quotas</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-custom/40 border border-border2 rounded-xl p-4">
          <div>
            <span className="px-2 py-0.5 rounded bg-violet/15 text-violet border border-violet/10 text-[9px] font-bold uppercase">
              Free Plan
            </span>
            <div className="font-heading text-lg font-bold text-fg mt-2">Personal Workspace</div>
            <div className="text-xs text-fg3 mt-0.5">Renews automatically on August 1, 2026</div>
          </div>
          <button className="px-4 py-2 text-xs font-semibold rounded-xl bg-violet text-white hover:bg-violet-dim transition-all cursor-pointer">
            Upgrade to Pro
          </button>
        </div>

        {/* Quota Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border2 rounded-xl p-4 bg-card-custom/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-fg2 font-medium">AI Generation Credits</span>
              <span className="text-fg">12 / 25</span>
            </div>
            <div className="w-full h-1.5 bg-border2 rounded-full overflow-hidden">
              <div className="bg-violet h-full rounded-full" style={{ width: "48%" }} />
            </div>
          </div>

          <div className="border border-border2 rounded-xl p-4 bg-card-custom/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-fg2 font-medium">Monthly Scheduled Posts</span>
              <span className="text-fg">5 / 10</span>
            </div>
            <div className="w-full h-1.5 bg-border2 rounded-full overflow-hidden">
              <div className="bg-violet h-full rounded-full" style={{ width: "50%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
