"use client";

import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import {
  IconShield,
  IconClock,
  IconUser,
  IconActivity,
  IconDatabase,
} from "@tabler/icons-react";

export default function AdminPage() {
  const { getToken } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/api/v1/admin/audit-logs`, {
          headers: {
            "Authorization": `Bearer ${token || "dummy_token"}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      }
      setLoading(false);
    }
    loadLogs();
  }, []);

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border2 pb-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight flex items-center gap-2">
            <IconShield className="text-violet" />
            Security & Audit Panel
          </h1>
          <p className="text-xs text-fg3 font-medium">Audit logs, workspace events, and credential modifications</p>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-card-custom border border-border2 rounded-xl p-4 flex items-center gap-3">
          <IconActivity className="text-violet" size={24} />
          <div>
            <div className="text-[10px] text-fg3 font-bold uppercase">System Status</div>
            <div className="text-sm font-semibold text-fg">Active & Secure</div>
          </div>
        </div>
        <div className="bg-card-custom border border-border2 rounded-xl p-4 flex items-center gap-3">
          <IconDatabase className="text-emerald-400" size={24} />
          <div>
            <div className="text-[10px] text-fg3 font-bold uppercase">Database Connection</div>
            <div className="text-sm font-semibold text-fg">Online (PostgreSQL)</div>
          </div>
        </div>
        <div className="bg-card-custom border border-border2 rounded-xl p-4 flex items-center gap-3">
          <IconClock className="text-amber" size={24} />
          <div>
            <div className="text-[10px] text-fg3 font-bold uppercase">Background Queue</div>
            <div className="text-sm font-semibold text-fg">Active (BullMQ/Redis)</div>
          </div>
        </div>
      </div>

      {/* Audit Logs Feed */}
      <div className="bg-ink2 border border-border-custom rounded-2xl p-5 space-y-4">
        <h2 className="font-heading text-sm font-bold text-fg">Workspace Audit Trail</h2>
        
        {loading ? (
          <div className="text-center py-10 text-xs text-fg3">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-xs text-fg3 italic">No system audit logs found.</div>
        ) : (
          <div className="divide-y divide-border2">
            {logs.map((log) => {
              const dateStr = new Date(log.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              });

              return (
                <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-violet/10 text-violet border border-violet/10 text-[9px] font-bold uppercase tracking-wider">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-fg3 font-medium flex items-center gap-1">
                        <IconUser size={10} />
                        {log.user?.email || "System"}
                      </span>
                    </div>
                    <p className="text-xs text-fg2 font-medium">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-fg3 whitespace-nowrap">{dateStr}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
