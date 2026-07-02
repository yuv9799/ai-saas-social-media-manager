"use client";

import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import {
  IconCalendarEvent,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandTiktok,
  IconBrandPinterest,
  IconList,
  IconCalendar,
  IconPlus,
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";

const platformIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  instagram: IconBrandInstagram,
  linkedin: IconBrandLinkedin,
  x: IconBrandX,
  tiktok: IconBrandTiktok,
  pinterest: IconBrandPinterest,
};

interface CalendarPost {
  id: string | number;
  content: string;
  platforms: string[];
  date: string;
  time: string;
  status: string;
}

export default function SchedulePage() {
  const { getToken } = useAuth();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  const fetchPosts = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/v1/posts`, {
        headers: {
          "Authorization": `Bearer ${token || "dummy_token"}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.posts.map((post: any) => {
          const datePart = post.scheduledAt 
            ? post.scheduledAt.split("T")[0] 
            : (post.publishedAt ? post.publishedAt.split("T")[0] : new Date().toISOString().split("T")[0]);
          const timePart = post.scheduledAt 
            ? post.scheduledAt.split("T")[1]?.slice(0, 5) 
            : (post.publishedAt ? post.publishedAt.split("T")[1]?.slice(0, 5) : "12:00");
          return {
            id: post.id,
            content: post.captions[0]?.generatedText || "",
            platforms: post.platforms.map((p: string) => p.toLowerCase()),
            date: datePart,
            time: timePart,
            status: post.status.toLowerCase()
          };
        });
        setPosts(mapped);
      }
    } catch (err) {
      console.error("Failed to load posts from API:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) => filterPlatform === "all" || post.platforms.includes(filterPlatform)
  );

  // Group list posts by date
  const grouped = filteredPosts.reduce<Record<string, CalendarPost[]>>((acc, post) => {
    if (!acc[post.date]) acc[post.date] = [];
    acc[post.date].push(post);
    return acc;
  }, {});

  const handleDelete = async (id: string | number) => {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/v1/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token || "dummy_token"}`
        }
      });
      if (res.ok) {
        fetchPosts();
      } else {
        alert("Failed to delete post from DB");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string | number) => {
    e.dataTransfer.setData("postId", id.toString());
  };

  const handleDrop = async (e: React.DragEvent, targetDate: string) => {
    const postId = e.dataTransfer.getData("postId");
    if (!postId) return;

    try {
      const token = await getToken();
      const originalPost = posts.find((p) => p.id.toString() === postId);
      if (!originalPost) return;

      const newScheduledAt = `${targetDate}T${originalPost.time}:00.000Z`;

      const res = await fetch(`${BACKEND_URL}/api/v1/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || "dummy_token"}`
        },
        body: JSON.stringify({
          scheduledAt: newScheduledAt
        })
      });

      if (res.ok) {
        fetchPosts();
      } else {
        alert("Failed to reschedule post in database");
      }
    } catch (err) {
      console.error("Reschedule Error:", err);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight">
            Content Planner
          </h1>
          <p className="text-xs text-fg3 font-medium">Schedule, organize, and monitor your social feeds</p>
        </div>
        <Link
          href="/dashboard/compose"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-violet text-white hover:bg-violet-dim shadow-[0_0_15px_var(--violet-glow)] transition-all self-start sm:self-auto cursor-pointer"
        >
          <IconPlus size={14} />
          Create Post
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-ink2 border border-border2 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-fg3 font-semibold uppercase tracking-wider px-2">Filter</span>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-card-custom border border-border2 text-fg outline-none focus:border-violet"
          >
            <option value="all">All Channels</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="x">X / Twitter</option>
            <option value="tiktok">TikTok</option>
            <option value="pinterest">Pinterest</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-border2 rounded-lg p-0.5 self-end sm:self-auto bg-card-custom">
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md cursor-pointer transition-all ${
              view === "list" ? "bg-violet text-white" : "text-fg3 hover:text-fg"
            }`}
          >
            <IconList size={16} />
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`p-1.5 rounded-md cursor-pointer transition-all ${
              view === "calendar" ? "bg-violet text-white" : "text-fg3 hover:text-fg"
            }`}
          >
            <IconCalendar size={16} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {view === "list" ? (
        <div className="space-y-6">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-12 bg-ink2 border border-dashed border-border2 rounded-2xl">
              <IconCalendarEvent size={32} className="mx-auto text-fg3 mb-3" />
              <p className="text-sm font-medium text-fg2">No posts scheduled</p>
              <p className="text-xs text-fg3 mt-1">Change filters or create a new post to get started.</p>
            </div>
          ) : (
            Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, posts]) => (
                <div key={date} className="space-y-3">
                  <h2 className="text-xs font-semibold text-fg2 flex items-center gap-1.5 uppercase tracking-wider">
                    <IconCalendarEvent size={14} className="text-violet" />
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h2>
                  <div className="grid gap-3">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="group bg-card-custom border border-border2 rounded-xl p-4 hover:border-border-custom hover:shadow-[0_0_20px_rgba(255,255,255,0.01)] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="flex-1 min-w-0 space-y-2">
                          <p className="text-sm text-fg2 line-clamp-2 leading-relaxed">{post.content}</p>
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                              {post.platforms.map((p) => {
                                const Icon = platformIcons[p];
                                return Icon ? (
                                  <span key={p} className="text-fg3 group-hover:text-fg2 transition-colors">
                                    <Icon size={14} />
                                  </span>
                                ) : null;
                              })}
                            </div>
                            <span className="text-[10px] text-fg3">·</span>
                            <span className="text-[10px] text-fg3 font-semibold uppercase">{post.time}</span>
                          </div>
                        </div>

                        {/* Status & Options */}
                        <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-3 self-stretch md:self-auto border-t border-border2 md:border-none pt-2.5 md:pt-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              post.status === "published"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                                : post.status === "failed"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                                : post.status === "draft"
                                ? "bg-gray-500/10 text-gray-400 border border-gray-500/10"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            }`}
                          >
                            {post.status}
                          </span>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-fg3 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                            title="Delete draft"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      ) : (
        /* Calendar Grid View */
        <div className="bg-ink2 border border-border2 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border2 bg-card-custom/50">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-fg">July 2026</span>
            </div>
            <div className="flex items-center gap-1 border border-border2 rounded-lg p-0.5 bg-ink2">
              <button className="p-1 text-fg3 hover:text-fg cursor-pointer"><IconChevronLeft size={16} /></button>
              <button className="p-1 text-fg3 hover:text-fg cursor-pointer"><IconChevronRight size={16} /></button>
            </div>
          </div>

          {/* Days labels */}
          <div className="grid grid-cols-7 border-b border-border2 bg-card-custom/20 text-center py-2 text-[10px] font-bold text-fg3 uppercase tracking-wider">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 auto-rows-[90px] text-xs">
            {/* Empty boxes for days of previous month */}
            <div className="border-r border-b border-border2/60 bg-white/[0.01]" />
            <div className="border-r border-b border-border2/60 bg-white/[0.01]" />
            <div className="border-r border-b border-border2/60 bg-white/[0.01]" />

            {/* Day Boxes (1-10 shown for simplicity) */}
            {Array.from({ length: 14 }).map((_, index) => {
              const dayNum = index + 1;
              const dateStr = `2026-07-${dayNum.toString().padStart(2, "0")}`;
              const dayPosts = posts.filter((p) => p.date === dateStr);

              return (
                <div
                  key={dayNum}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  className="border-r border-b border-border2/60 p-2 flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative"
                >
                  <span className="text-[10px] font-bold text-fg3">{dayNum}</span>
                  <div className="space-y-1">
                    {dayPosts.map((p) => (
                      <div
                        key={p.id}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, p.id)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-medium truncate cursor-grab hover:opacity-85 ${
                          p.status === "published"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : p.status === "failed"
                            ? "bg-rose-500/10 text-rose-300"
                            : "bg-violet/10 text-violet"
                        }`}
                        title={p.content}
                      >
                        {p.content}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}