"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandTiktok,
  IconBrandPinterest,
  IconSparkles,
  IconTrendingUp,
  IconClock,
  IconWorld,
  IconStar,
} from "@tabler/icons-react";

const phrases = [
  "converts.",
  "goes viral.",
  "builds trust.",
  "drives traffic.",
  "stands out.",
];

const platforms = [
  { label: "Instagram", icon: IconBrandInstagram },
  { label: "LinkedIn", icon: IconBrandLinkedin },
  { label: "X / Twitter", icon: IconBrandX },
  { label: "TikTok", icon: IconBrandTiktok },
  { label: "Pinterest", icon: IconBrandPinterest },
];

export default function HomePage() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % phrases.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  // Count-up animation
  useEffect(() => {
    const animateCount = (
      id: string,
      target: number,
      suffix: string,
      duration: number
    ) => {
      const el = document.getElementById(id);
      if (!el) return;
      let c = 0;
      const step = target / 60;
      const t = setInterval(() => {
        c += step;
        if (c >= target) {
          c = target;
          clearInterval(t);
        }
        el.textContent = Math.round(c).toLocaleString() + suffix;
      }, duration / 60);
    };

    const timeout = setTimeout(() => {
      animateCount("s1", 284000, "", 1400);
      animateCount("s2", 19300, "", 1200);
      animateCount("s3", 47, "", 900);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setCaption("Crafting your caption…");
    setShowCopy(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), platform: "general" }),
      });
      const data = await res.json();
      if (data.caption) {
        setCaption(data.caption);
        setShowCopy(true);
      } else {
        setCaption(data.error || "Could not generate — try again.");
      }
    } catch {
      setCaption("Connection error \u2014 please try again.");
    }
    setLoading(false);
  }, [topic]);

  const copyCaption = useCallback(() => {
    navigator.clipboard.writeText(caption).then(() => {
      const btn = document.getElementById("copy-btn");
      if (btn) {
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy caption"), 1800);
      }
    });
  }, [caption]);

  return (
    <div className="hero relative z-1 max-w-[960px] mx-auto px-8 pt-[68px] pb-14 flex flex-col items-center gap-12">
      <div className="stage w-full max-w-[680px] flex flex-col items-center gap-7 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 border border-border-custom rounded-full px-3.5 py-1 text-xs font-medium text-[#a78bfa] tracking-wider bg-[rgba(124,58,237,0.1)]">
          <IconSparkles size={13} className="text-amber" />
          AI-powered social media
        </div>

        {/* Headline */}
        <h1 className="font-heading text-[clamp(36px,6vw,60px)] font-extrabold leading-[1.06] tracking-tight text-fg">
          Post content that
          <br />
          actually{" "}
          <em className="not-italic text-violet">
            <span className="inline-block min-w-[180px] text-left">
              <span
                className="border-r-[3px] border-violet pr-1 animate-blink transition-opacity duration-[180ms]"
                style={{ opacity: 1 }}
              >
                {phrases[phraseIdx]}
              </span>
            </span>
          </em>
        </h1>

        <p className="text-[15px] text-fg2 leading-relaxed max-w-[460px]">
          Drop your idea below — SocialPulse writes the caption, picks the
          hashtags, and schedules it across every platform. Try it now.
        </p>

        {/* Generator box */}
        <div className="w-full bg-ink2 border border-border-custom rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
          <div className="p-5 pb-4 flex flex-col gap-3">
            <div className="text-[11px] text-fg3 font-medium tracking-[0.06em] uppercase text-left">
              What's your post about?
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="e.g. summer sale, new product drop, team spotlight…"
                className="flex-1 min-w-0 px-4 py-3 text-sm font-sans bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] placeholder:text-fg3 transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-[22px] text-[13px] font-semibold whitespace-nowrap border-none rounded-lg bg-violet text-white font-sans shadow-[0_0_20px_var(--violet-glow)] hover:bg-violet-dim transition-all disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden animate-pulse-ring"
              >
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 border-2 border-white/25 border-t-white rounded-full animate-spin-custom" />
                    Writing…
                  </span>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-border2 p-4 min-h-[90px] flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber uppercase tracking-widest">
              <IconSparkles size={12} />
              AI caption
            </div>
            <div
              id="ai-out"
              className={`text-[13.5px] leading-relaxed whitespace-pre-wrap min-h-[52px] ${
                !caption || caption.startsWith("Crafting")
                  ? "text-fg3 italic"
                  : "text-fg2"
              }`}
            >
              {caption ||
                "Your caption will appear here — takes about 4 seconds."}
            </div>
            <button
              id="copy-btn"
              onClick={copyCaption}
              className={`self-end bg-none border border-border2 rounded-md px-3 py-1 text-[11px] font-medium text-fg3 hover:border-border-custom hover:text-fg transition-all font-sans ${
                showCopy ? "block" : "hidden"
              }`}
            >
              Copy caption
            </button>
          </div>

          <div className="text-[11px] text-fg3 px-5 pb-3.5">
            No card required &nbsp;·&nbsp; 25 free captions/month &nbsp;·&nbsp;
            Cancel anytime
          </div>
        </div>

        {/* Platform chips */}
        <div className="flex justify-center gap-2 flex-wrap">
          {platforms.map((p) => (
            <div
              key={p.label}
              className="inline-flex items-center gap-1.5 border border-border2 rounded-lg px-3 py-1.5 text-xs text-fg2 bg-card-custom hover:border-border-custom hover:text-fg transition-all"
            >
              <p.icon size={14} />
              {p.label}
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-card-custom border border-border2">
          <div className="flex">
            {["JL", "SR", "AM", "KP", "TW"].map((initials, i) => (
              <div
                key={initials}
                className="w-[30px] h-[30px] rounded-full border-2 border-ink2 text-[10px] font-bold flex items-center justify-center text-white -ml-[9px] first:ml-0"
                style={{
                  background: [
                    "#7C3AED",
                    "#0891b2",
                    "#059669",
                    "#d97706",
                    "#be185d",
                  ][i],
                }}
              >
                {initials}
              </div>
            ))}
          </div>
          <div className="w-px h-7 bg-border2" />
          <div className="flex flex-col gap-0.5">
            <div className="text-[13px] font-semibold text-fg">
              28,400+ brands
            </div>
            <div className="text-[11px] text-fg3">trust SocialPulse</div>
          </div>
          <div className="w-px h-7 bg-border2" />
          <div className="flex flex-col gap-0.5">
            <div className="text-[13px] font-semibold text-fg">4.8 / 5 ★</div>
            <div className="text-[11px] text-fg3">3,100+ reviews</div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="w-full grid grid-cols-3 gap-3">
        {[
          { id: "s1", label: "Total reach delivered", change: "↑ 31% this week" },
          { id: "s2", label: "Engagements tracked", change: "↑ 18% this week" },
          { id: "s3", label: "Posts sent today", change: "↑ 9% this week" },
        ].map((stat) => (
          <div
            key={stat.id}
            className="bg-card-custom border border-border2 rounded-xl p-[18px] flex flex-col gap-1 hover:border-border-custom transition-all"
          >
            <div
              id={stat.id}
              className="font-heading text-[26px] font-extrabold text-fg tracking-tight"
            >
              0
            </div>
            <div className="text-xs text-emerald-400 font-medium">
              {stat.change}
            </div>
            <div className="text-xs text-fg3 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ticker */}
      <div className="flex items-center justify-center flex-wrap gap-0 px-7 h-[42px] bg-[rgba(255,255,255,0.03)] border-t border-border2 overflow-hidden w-full">
        <TickerItem icon={IconTrendingUp} iconColor="text-violet" text="5.8M" label="posts scheduled today" />
        <TickerSep />
        <TickerItem icon={IconClock} iconColor="text-amber" text="4.2s" label="to generate" />
        <TickerSep />
        <TickerItem icon={IconWorld} iconColor="text-violet" text="30 languages" label="supported" />
        <TickerSep />
        <TickerItem icon={IconStar} iconColor="text-amber" text="4.8 / 5" label="average rating" />
      </div>
    </div>
  );
}

function TickerItem({
  icon: Icon,
  iconColor,
  text,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  text: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-fg2 whitespace-nowrap">
      <Icon size={14} className={iconColor} />
      <strong className="text-fg font-semibold">{text}</strong>&nbsp;{label}
    </div>
  );
}

function TickerSep() {
  return <span className="mx-[18px] text-border-custom text-sm">·</span>;
}