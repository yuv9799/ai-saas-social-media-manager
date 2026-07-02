"use client";

import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/api";
import {
  IconEye,
  IconHeart,
  IconSend,
  IconTrendingUp,
  IconCalendarEvent,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/posts`, {
          headers: {
            "Authorization": "Bearer dummy_token",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard posts:", err);
      }
      setLoading(false);
    }
    loadPosts();
  }, []);

  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;
  const scheduledPosts = posts.filter((p) => p.status === "SCHEDULED");
  const scheduledCount = scheduledPosts.length;
  const draftCount = posts.filter((p) => p.status === "DRAFT").length;
  const failedCount = posts.filter((p) => p.status === "FAILED").length;

  const stats = [
    { icon: IconSend, label: "Published Posts", value: publishedCount, change: "+12% this week", color: "text-emerald-400" },
    { icon: IconCalendarEvent, label: "Queued Posts", value: scheduledCount, change: "Active queue", color: "text-violet" },
    { icon: IconHeart, label: "Drafts Saved", value: draftCount, change: "In progress", color: "text-amber" },
    { icon: IconTrendingUp, label: "Failed Operations", value: failedCount, change: "Needs attention", color: "text-rose-400" },
  ];

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-fg3 font-medium">Welcome back! Here is a summary of your workspace metrics.</p>
        </div>
        <Link
          href="/dashboard/compose"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-violet text-white hover:bg-violet-dim shadow-[0_0_15px_var(--violet-glow)] transition-all self-start sm:self-auto cursor-pointer"
        >
          <IconPlus size={14} />
          Create Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card-custom border border-border2 rounded-2xl p-4 hover:border-border-custom transition-all">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className={s.color} />
              <span className="text-[10px] text-fg3 font-medium">{s.change}</span>
            </div>
            <div className="font-heading text-2xl font-extrabold text-fg">{s.value}</div>
            <div className="text-xs text-fg3 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Queue & Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheduled posts list */}
        <div className="bg-ink2 border border-border-custom rounded-2xl p-5 space-y-4">
          <h2 className="font-heading text-sm font-bold text-fg border-b border-border2 pb-2 flex items-center gap-1.5">
            <IconCalendarEvent size={16} className="text-violet" />
            Upcoming Scheduled Posts
          </h2>

          {loading ? (
            <div className="py-8 text-center text-xs text-fg3">Loading queue...</div>
          ) : scheduledPosts.length === 0 ? (
            <div className="py-8 text-center text-xs text-fg3 italic">
              No upcoming scheduled posts. Create a post in the Content Studio to fill your queue!
            </div>
          ) : (
            <div className="space-y-2.5">
              {scheduledPosts.slice(0, 4).map((post) => {
                const platformsStr = post.platforms.join(", ");
                const dateStr = post.scheduledAt
                  ? new Date(post.scheduledAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not set";

                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between border border-border2 rounded-xl p-3 bg-card-custom/20 hover:border-border-custom transition-all"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="text-xs font-semibold text-fg truncate">
                        {platformsStr}
                      </div>
                      <div className="text-[11px] text-fg3 mt-0.5 truncate">
                        {post.captions?.[0]?.generatedText || "No caption content"}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-violet uppercase block">
                        {dateStr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Workspace Quick Tips */}
        <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
          <h2 className="font-heading text-sm font-bold text-fg border-b border-border2 pb-2">
            AI Marketing Quick Tips
          </h2>
          <div className="space-y-3 text-xs text-fg2 leading-relaxed">
            <div className="p-3 bg-card-custom/20 border border-border2 rounded-xl">
              💡 <strong className="text-fg">Optimal Times</strong>: Based on our metrics, posting to LinkedIn on Tuesdays & Thursdays at 9:00 AM generates 25% higher reach.
            </div>
            <div className="p-3 bg-card-custom/20 border border-border2 rounded-xl">
              ✍️ <strong className="text-fg">Brand Voice</strong>: Consistency builds trust. Head to Settings to connected your accounts and set workspace roles.
            </div>
            <div className="p-3 bg-card-custom/20 border border-border2 rounded-xl">
              🤖 <strong className="text-fg">AI Generation</strong>: You have used <span className="font-semibold text-violet">12 of your 25</span> monthly free AI generation credits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}