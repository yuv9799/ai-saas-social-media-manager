"use client";

import { useState } from "react";
import {
  IconSearch,
  IconPhoto,
  IconUpload,
  IconTag,
  IconDotsVertical,
  IconSparkles,
} from "@tabler/icons-react";

const initialMedia = [
  { id: 1, title: "Abstract gradient background", tag: "AI Generated", size: "1.2 MB", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=350&auto=format&fit=crop" },
  { id: 2, title: "Modern desk work space setup", tag: "Photography", size: "2.4 MB", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=350&auto=format&fit=crop" },
  { id: 3, title: "Minimalist mobile app mockup", tag: "UI Template", size: "900 KB", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=350&auto=format&fit=crop" },
  { id: 4, title: "Neon coding terminal interface", tag: "AI Generated", size: "1.8 MB", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=350&auto=format&fit=crop" },
  { id: 5, title: "Team collaboration brainstorm session", tag: "Photography", size: "3.1 MB", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=350&auto=format&fit=crop" },
  { id: 6, title: "Geometric dark web app dashboard layout", tag: "UI Template", size: "1.5 MB", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=350&auto=format&fit=crop" },
];

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === "all" || m.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const handleSimulatedUpload = () => {
    const prompt = window.prompt("Enter a title for your image:");
    if (!prompt) return;
    
    const newAsset = {
      id: Date.now(),
      title: prompt,
      tag: "Uploaded",
      size: "800 KB",
      url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=350&auto=format&fit=crop",
    };
    
    setMediaList((prev) => [newAsset, ...prev]);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight">
            Media Library
          </h1>
          <p className="text-xs text-fg3 font-medium">Store, search, and manage visual design assets for campaigns</p>
        </div>
        <button
          onClick={handleSimulatedUpload}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-violet text-white hover:bg-violet-dim shadow-[0_0_15px_var(--violet-glow)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <IconUpload size={14} />
          Upload Asset
        </button>
      </div>

      {/* Control panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-ink2 border border-border2 rounded-xl p-3">
        <div className="flex-1 max-w-[320px] relative">
          <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[rgba(255,255,255,0.03)] border border-border2 rounded-lg text-fg outline-none focus:border-violet"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "AI Generated", "Photography", "UI Template"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-violet/10 border-violet text-fg"
                  : "border-border2 text-fg2 hover:border-border-custom bg-card-custom"
              }`}
            >
              {tag === "all" ? "All Formats" : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 bg-ink2 border border-dashed border-border2 rounded-2xl">
          <IconPhoto size={36} className="mx-auto text-fg3 mb-3 opacity-60" />
          <p className="text-sm font-semibold text-fg2">No assets found</p>
          <p className="text-xs text-fg3 mt-1">Try resetting filters or uploading a new file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMedia.map((m) => (
            <div
              key={m.id}
              className="group bg-card-custom border border-border2 rounded-2xl overflow-hidden hover:border-border-custom hover:shadow-[0_0_20px_rgba(255,255,255,0.01)] transition-all flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full bg-[rgba(255,255,255,0.02)] border-b border-border2 relative overflow-hidden">
                <img
                  src={m.url}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-white border border-white/5 uppercase tracking-wide">
                  {m.tag}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-fg line-clamp-1 leading-snug">
                    {m.title}
                  </h3>
                  <button className="text-fg3 hover:text-fg cursor-pointer"><IconDotsVertical size={14} /></button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-fg3">
                  <span className="flex items-center gap-1">
                    <IconTag size={10} />
                    {m.size}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
