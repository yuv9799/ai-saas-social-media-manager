"use client";

import { IconCalendarEvent, IconBrandInstagram, IconBrandLinkedin, IconBrandX, IconBrandTiktok, IconBrandPinterest } from "@tabler/icons-react";

const platformIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: IconBrandInstagram,
  linkedin: IconBrandLinkedin,
  x: IconBrandX,
  tiktok: IconBrandTiktok,
  pinterest: IconBrandPinterest,
};

const scheduledPosts = [
  { id: 1, content: "Summer sale is here! 30% off everything — this weekend only. 🌞", platforms: ["instagram", "x"], date: "2026-06-29", time: "3:00 PM", status: "scheduled" },
  { id: 2, content: "Our Q3 results are in — and we're thrilled to share the numbers.", platforms: ["linkedin"], date: "2026-06-30", time: "9:00 AM", status: "scheduled" },
  { id: 3, content: "Thread: 5 lessons we learned building an AI startup in 2026.", platforms: ["x"], date: "2026-07-01", time: "10:30 AM", status: "scheduled" },
  { id: 4, content: "Behind the scenes of our latest product photoshoot 📸", platforms: ["instagram", "tiktok"], date: "2026-07-01", time: "2:00 PM", status: "scheduled" },
  { id: 5, content: "New Pinterest board: Design inspiration for Q3 🎨", platforms: ["pinterest"], date: "2026-07-02", time: "11:00 AM", status: "scheduled" },
];

// Group posts by date
const grouped = scheduledPosts.reduce<Record<string, typeof scheduledPosts>>((acc, post) => {
  if (!acc[post.date]) acc[post.date] = [];
  acc[post.date].push(post);
  return acc;
}, {});

export default function SchedulePage() {
  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-fg mb-6">Schedule</h1>

      {Object.entries(grouped).map(([date, posts]) => (
        <div key={date} className="mb-8">
          <h2 className="text-sm font-semibold text-fg2 mb-3">
            <IconCalendarEvent size={14} className="inline mr-1.5 text-violet" />
            {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-card-custom border border-border2 rounded-xl p-4 hover:border-border-custom transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-fg2 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {post.platforms.map((p) => {
                        const Icon = platformIcons[p];
                        return Icon ? (
                          <span key={p} className="text-fg3">
                            <Icon size={14} />
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-fg font-medium">{post.time}</div>
                    <span className="text-[10px] text-amber font-medium uppercase tracking-wider">
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}