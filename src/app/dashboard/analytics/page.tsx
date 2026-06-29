"use client";

import { IconEye, IconHeart, IconSend, IconTrendingUp, IconChartBar } from "@tabler/icons-react";

const stats = [
  { label: "Reach", value: "284K", change: "+31%", icon: IconEye },
  { label: "Engagements", value: "19.3K", change: "+18%", icon: IconHeart },
  { label: "Posts Sent", value: "47", change: "+9%", icon: IconSend },
  { label: "Growth Rate", value: "12.4%", change: "+4%", icon: IconTrendingUp },
];

const weeklyData = [
  { day: "Mon", reach: 42000, engagement: 3100 },
  { day: "Tue", reach: 38000, engagement: 2800 },
  { day: "Wed", reach: 51000, engagement: 4200 },
  { day: "Thu", reach: 46000, engagement: 3800 },
  { day: "Fri", reach: 54000, engagement: 4500 },
  { day: "Sat", reach: 29000, engagement: 2100 },
  { day: "Sun", reach: 24000, engagement: 1800 },
];

const maxReach = Math.max(...weeklyData.map((d) => d.reach));

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-fg mb-6">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card-custom border border-border2 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className="text-violet" />
              <span className="text-[11px] text-emerald-400 font-medium">{s.change}</span>
            </div>
            <div className="font-heading text-xl font-extrabold text-fg">{s.value}</div>
            <div className="text-xs text-fg3 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="bg-ink2 border border-border-custom rounded-xl p-5 mb-6">
        <h2 className="font-heading text-base font-bold text-fg mb-4">This Week</h2>
        <div className="flex items-end gap-2 h-32">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5">
                <div
                  className="w-full bg-violet/30 rounded-t-sm"
                  style={{ height: `${(d.reach / maxReach) * 100}%`, minHeight: 4 }}
                />
                <div
                  className="w-full bg-amber/30 rounded-t-sm"
                  style={{ height: `${(d.engagement / maxReach) * 80}%`, minHeight: 2 }}
                />
              </div>
              <span className="text-[10px] text-fg3">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[11px] text-fg3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-violet/60" /> Reach</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber/60" /> Engagement</span>
        </div>
      </div>

      {/* PostHog placeholder */}
      <div className="bg-card-custom border border-border2 rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm text-fg2">
          <IconChartBar size={18} className="text-violet" />
          <span>PostHog analytics will be embedded here — track page views, custom events, and conversion funnels.</span>
        </div>
      </div>
    </div>
  );
}