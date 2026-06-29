"use client";

import { IconEye, IconHeart, IconSend, IconTrendingUp } from "@tabler/icons-react";

const stats = [
  { icon: IconEye, label: "Total Reach", value: "284,000", change: "+31%", color: "text-violet" },
  { icon: IconHeart, label: "Engagements", value: "19,300", change: "+18%", color: "text-amber" },
  { icon: IconSend, label: "Posts Sent", value: "47", change: "+9%", color: "text-emerald-400" },
  { icon: IconTrendingUp, label: "Followers Gained", value: "+1,240", change: "+12%", color: "text-violet" },
];

const upcomingPosts = [
  { platform: "Instagram", time: "Today, 3:00 PM", preview: "Summer vibes incoming…" },
  { platform: "LinkedIn", time: "Tomorrow, 9:00 AM", preview: "Our Q3 results are in…" },
  { platform: "X", time: "Wed, 10:30 AM", preview: "Thread: 5 lessons learned…" },
];

export default function DashboardOverview() {
  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-fg mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card-custom border border-border2 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className={s.color} />
              <span className="text-[11px] text-emerald-400 font-medium">{s.change}</span>
            </div>
            <div className="font-heading text-2xl font-extrabold text-fg">{s.value}</div>
            <div className="text-xs text-fg3 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-ink2 border border-border-custom rounded-xl p-5">
        <h2 className="font-heading text-base font-bold text-fg mb-4">Upcoming Posts</h2>
        <div className="space-y-3">
          {upcomingPosts.map((post) => (
            <div key={post.time} className="flex items-center justify-between border border-border2 rounded-lg p-3 bg-card-custom">
              <div>
                <div className="text-sm font-medium text-fg">{post.platform}</div>
                <div className="text-xs text-fg3 mt-0.5">{post.preview}</div>
              </div>
              <div className="text-xs text-fg2">{post.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}