"use client";

export function AnnounceBanner() {
  return (
    <div className="announce relative z-10 flex items-center justify-center gap-2.5 px-5 py-2 text-xs text-fg2 bg-[rgba(124,58,237,0.12)] border-b border-border-custom">
      <span className="bg-amber text-black text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
        NEW
      </span>
      TikTok & Pinterest scheduling just launched — multi-platform in one click.
      <span className="text-violet font-medium cursor-pointer hover:text-[#a78bfa]">
        See what's new →
      </span>
    </div>
  );
}