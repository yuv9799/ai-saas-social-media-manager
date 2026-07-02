"use client";

import { useState } from "react";
import { BACKEND_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import {
  IconSparkles,
  IconChevronLeft,
  IconChevronRight,
  IconTemplate,
  IconCopy,
  IconCalendarDue,
} from "@tabler/icons-react";

interface CarouselSlide {
  title: string;
  body: string;
  cta?: string;
}

const themes = [
  { id: "tech", label: "🪐 Tech Dark", bg: "bg-[#0B0F19]", text: "text-[#F0EDFF]", accent: "border-[#7C3AED] text-[#a78bfa]" },
  { id: "neon", label: "⚡ Neon Cyber", bg: "bg-[#090514]", text: "text-white", accent: "border-[#00f2fe] text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.15)]" },
  { id: "minimal", label: "☕ Clean Haze", bg: "bg-[#1E293B]", text: "text-[#F1F5F9]", accent: "border-amber text-amber" },
];

export default function CarouselPage() {
  const { getToken } = useAuth();
  const [topic, setTopic] = useState("");
  const [numSlides, setNumSlides] = useState(5);
  const [theme, setTheme] = useState("tech");
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/v1/carousel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || "dummy_token"}`
        },
        body: JSON.stringify({
          topic: topic.trim(),
          numSlides
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSlides(data.slides || []);
        setCurrentIndex(0);
      } else {
        alert("Failed to generate carousel slides");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the backend server. Make sure it's running on port 3001!");
    }
    setLoading(false);
  };

  const handleExportPost = async () => {
    if (slides.length === 0) return;
    setLoading(true);
    try {
      const token = await getToken();
      const carouselContent = slides.map((s, i) => `[Slide ${i+1}: ${s.title}]\n${s.body}\n${s.cta ? `👉 ${s.cta}` : ""}`).join("\n\n");
      
      const res = await fetch(`${BACKEND_URL}/api/v1/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || "dummy_token"}`
        },
        body: JSON.stringify({
          content: carouselContent,
          platforms: ["linkedin"],
          topic: `Carousel: ${topic}`
        })
      });

      if (res.ok) {
        alert("Carousel text draft exported to queue successfully!");
      } else {
        alert("Failed to export draft");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const selectedTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight">
          AI Carousel Generator
        </h1>
        <p className="text-xs text-fg3 font-medium">Create engaging multi-slide graphics and copy decks for LinkedIn & Instagram</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Control Panel */}
        <div className="w-full lg:w-2/5 bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
          <div className="text-[11px] text-amber font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <IconSparkles size={14} />
            Carousel Settings
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-fg2 mb-1.5 block">What is this carousel about?</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., 5 growth hacks for SaaS founders"
                className="w-full px-4 py-2.5 text-xs bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet"
              />
            </div>

            <div>
              <label className="text-xs text-fg2 mb-1.5 block">Number of Slides</label>
              <select
                value={numSlides}
                onChange={(e) => setNumSlides(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 text-xs bg-card-custom border border-border2 rounded-xl text-fg outline-none focus:border-violet"
              >
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n} className="bg-ink2">
                    {n} Slides
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-fg2 mb-1.5 block">Visual Theme</label>
              <div className="flex flex-col gap-1.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                      theme === t.id
                        ? "bg-violet/10 border-violet text-fg"
                        : "border-border2 text-fg2 bg-card-custom hover:border-border-custom"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-violet hover:bg-violet-dim text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_var(--violet-glow)] cursor-pointer"
            >
              {loading ? "Generating slides..." : "Generate Carousel"}
            </button>
          </div>
        </div>

        {/* Right Preview Canvas */}
        <div className="w-full lg:w-3/5 space-y-4">
          <div className="text-[11px] text-fg3 font-semibold uppercase tracking-wider px-1">
            Slide Deck Canvas
          </div>

          {slides.length === 0 ? (
            <div className="aspect-[4/3] w-full border border-dashed border-border2 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-ink2/30">
              <IconTemplate size={42} className="text-fg3 mb-3 opacity-60" />
              <p className="text-sm font-semibold text-fg2">No slides generated yet</p>
              <p className="text-xs text-fg3 mt-1">Configure options on the left and click generate to view your deck.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Slide Card Container */}
              <div className={`aspect-[4/3] w-full border border-border2 rounded-3xl p-8 flex flex-col justify-between transition-all ${selectedTheme.bg} ${selectedTheme.text}`}>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${selectedTheme.accent}`}>
                    Slide {currentIndex + 1} of {slides.length}
                  </span>
                  <span className="text-[10px] text-fg3 font-semibold">SocialPulse OS</span>
                </div>

                {/* Body Content */}
                <div className="space-y-4 my-auto">
                  <h2 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                    {slides[currentIndex].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-fg2 leading-relaxed whitespace-pre-wrap">
                    {slides[currentIndex].body}
                  </p>
                </div>

                {/* Footer / CTA */}
                <div className="flex items-center justify-between border-t border-border2 pt-4">
                  <span className="text-[10px] text-fg3">@{topic.toLowerCase().replace(/[^a-z0-9]/g, "")}</span>
                  {slides[currentIndex].cta && (
                    <span className="text-[10px] font-bold text-violet animate-pulse">
                      {slides[currentIndex].cta} ➔
                    </span>
                  )}
                </div>
              </div>

              {/* Slide controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="p-2 border border-border2 rounded-xl text-fg3 hover:text-fg hover:bg-card-custom transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <IconChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentIndex === slides.length - 1}
                    className="p-2 border border-border2 rounded-xl text-fg3 hover:text-fg hover:bg-card-custom transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <IconChevronRight size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allText = slides.map((s, i) => `Slide ${i+1}: ${s.title}\n${s.body}`).join("\n\n");
                      navigator.clipboard.writeText(allText);
                      alert("Slides text copied!");
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 border border-border2 rounded-xl text-xs font-semibold text-fg2 hover:text-fg hover:bg-card-custom transition-all cursor-pointer"
                  >
                    <IconCopy size={14} />
                    Copy Text
                  </button>
                  <button
                    onClick={handleExportPost}
                    className="flex items-center gap-1.5 px-3 py-2 bg-violet hover:bg-violet-dim text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                  >
                    <IconCalendarDue size={14} />
                    Export Draft
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
