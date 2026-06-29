"use client";

import { useState } from "react";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandTiktok,
  IconBrandPinterest,
  IconSparkles,
  IconCalendarDue,
} from "@tabler/icons-react";

const platforms = [
  { id: "instagram", label: "Instagram", icon: IconBrandInstagram },
  { id: "linkedin", label: "LinkedIn", icon: IconBrandLinkedin },
  { id: "x", label: "X", icon: IconBrandX },
  { id: "tiktok", label: "TikTok", icon: IconBrandTiktok },
  { id: "pinterest", label: "Pinterest", icon: IconBrandPinterest },
];

export default function ComposePage() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), platform: selectedPlatforms[0] || "general" }),
      });
      const data = await res.json();
      setCaption(data.caption || "Failed to generate");
      setContent((prev) => prev + (prev ? "\n\n" : "") + data.caption);
    } catch {
      setCaption("Error generating caption");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-fg mb-6">Compose Post</h1>

      <div className="max-w-2xl space-y-5">
        {/* Platform selector */}
        <div>
          <label className="text-xs text-fg3 font-medium uppercase tracking-wider mb-2 block">
            Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => {
              const selected = selectedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    selected
                      ? "bg-violet/15 border-violet text-violet"
                      : "border-border2 text-fg2 hover:border-border-custom hover:text-fg bg-card-custom"
                  }`}
                >
                  <p.icon size={14} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI generation */}
        <div className="bg-ink2 border border-border-custom rounded-xl p-4">
          <label className="text-xs text-fg3 font-medium uppercase tracking-wider mb-2 block">
            AI Caption Generator
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe your post…"
              className="flex-1 px-3 py-2 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet placeholder:text-fg3"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-violet text-white hover:bg-violet-dim transition-all disabled:opacity-60 flex items-center gap-1.5"
            >
              <IconSparkles size={14} />
              {loading ? "Writing…" : "Generate"}
            </button>
          </div>
          {caption && (
            <div className="text-xs text-fg2 bg-card-custom border border-border2 rounded-lg p-3">
              {caption}
            </div>
          )}
        </div>

        {/* Content textarea */}
        <div>
          <label className="text-xs text-fg3 font-medium uppercase tracking-wider mb-2 block">
            Post Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Write your post content here or use AI to generate…"
            className="w-full px-4 py-3 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-xl text-fg outline-none focus:border-violet placeholder:text-fg3 resize-none"
          />
        </div>

        {/* Schedule picker */}
        <div>
          <label className="text-xs text-fg3 font-medium uppercase tracking-wider mb-2 block">
            Schedule (optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-card-custom border border-border2 text-fg2 hover:border-border-custom hover:text-fg transition-all">
            Save as Draft
          </button>
          <button
            disabled={!content.trim() || selectedPlatforms.length === 0}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-violet text-white hover:bg-violet-dim transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_var(--violet-glow)] flex items-center gap-1.5"
          >
            <IconCalendarDue size={14} />
            {scheduledAt ? "Schedule Post" : "Post Now"}
          </button>
        </div>
      </div>
    </div>
  );
}