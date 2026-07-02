"use client";

import { useState } from "react";
import { BACKEND_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandTiktok,
  IconBrandPinterest,
  IconSparkles,
  IconCalendarDue,
  IconReload,
  IconPhoto,
  IconUser,
  IconHeart,
  IconMessageCircle,
  IconSend,
  IconBookmark,
} from "@tabler/icons-react";

const platforms = [
  { id: "linkedin", label: "LinkedIn", icon: IconBrandLinkedin, color: "text-[#0a66c2]" },
  { id: "instagram", label: "Instagram", icon: IconBrandInstagram, color: "text-[#d62976]" },
  { id: "x", label: "X / Twitter", icon: IconBrandX, color: "text-white" },
  { id: "tiktok", label: "TikTok", icon: IconBrandTiktok, color: "text-[#ff0050]" },
  { id: "pinterest", label: "Pinterest", icon: IconBrandPinterest, color: "text-[#bd081c]" },
];

const tones = [
  { id: "professional", label: "👔 Professional" },
  { id: "casual", label: "☕ Casual" },
  { id: "witty", label: "⚡ Witty" },
  { id: "persuasive", label: "📈 Persuasive" },
  { id: "excited", label: "🎉 Excited" },
];

export default function ComposePage() {
  const { getToken } = useAuth();
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin"]);
  const [previewPlatform, setPreviewPlatform] = useState<string>("linkedin");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    if (!selectedPlatforms.includes(id)) {
      setPreviewPlatform(id);
    }
  };

  const handleGenerateText = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || "dummy_token"}`
        },
        body: JSON.stringify({
          topic: topic.trim(),
          platform: selectedPlatforms[0] || "general",
        }),
      });
      const data = await res.json();
      if (data.caption) {
        setContent(data.caption);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    setGeneratingImage(true);
    // Simulate generation latency
    setTimeout(() => {
      setImageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop");
      setGeneratingImage(false);
    }, 2500);
  };

  const handleRewrite = () => {
    if (!content.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setContent((prev) => prev + `\n\n[Optimized in ${tone} tone] ✨`);
      setLoading(false);
    }, 1200);
  };

  const handleSubmitPost = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/v1/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || "dummy_token"}`
        },
        body: JSON.stringify({
          content: content.trim(),
          platforms: selectedPlatforms,
          scheduledAt: scheduledAt || null,
          topic: topic || null,
          imageUrl: imageUrl || null,
          imagePrompt: imagePrompt || null,
        }),
      });
      if (res.ok) {
        alert("Post successfully created!");
        setContent("");
        setScheduledAt("");
        setImageUrl("");
        setImagePrompt("");
        setTopic("");
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "Failed to create post"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the backend server. Make sure it's running on port 3001!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-1">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: Editor & AI Suite */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight">
              AI Content Studio
            </h1>
            <span className="text-xs text-fg3 font-medium">Create and refine with Gemini</span>
          </div>

          {/* Platform Selector */}
          <div className="bg-ink2 border border-border2 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="text-[11px] text-fg3 font-semibold uppercase tracking-wider">
              1. Target Platforms
            </div>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-violet/10 border-violet text-fg shadow-[0_0_12px_rgba(124,58,237,0.15)]"
                        : "border-border2 text-fg2 hover:border-border-custom hover:text-fg bg-card-custom"
                    }`}
                  >
                    <p.icon size={15} className={p.color} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Helper Panel */}
          <div className="bg-ink2 border border-border-custom rounded-2xl p-5 space-y-4 shadow-[0_0_30px_rgba(124,58,237,0.04)]">
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-amber font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <IconSparkles size={14} />
                Gemini Creative Assistant
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What is this post about? E.g., launching an AI tool, summer sale..."
                className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet placeholder:text-fg3 transition-all"
              />
              <button
                onClick={handleGenerateText}
                disabled={loading || !topic.trim()}
                className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap rounded-xl bg-violet text-white hover:bg-violet-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Writing..." : "Write Draft"}
              </button>
            </div>

            {content && (
              <div className="border-t border-border2 pt-4 space-y-3">
                <div className="text-[11px] text-fg3 font-semibold uppercase tracking-wider">
                  Quick AI Actions
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-card-custom border border-border2 text-fg outline-none focus:border-violet"
                  >
                    {tones.map((t) => (
                      <option key={t.id} value={t.id} className="bg-ink2">
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRewrite}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border-custom bg-violet/5 text-[#a78bfa] hover:bg-violet/10 transition-all cursor-pointer"
                  >
                    <IconReload size={13} />
                    Rewrite & Optimize
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Inputs */}
          <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-fg3 font-semibold uppercase tracking-wider">
                2. Post Editor
              </label>
              <span className="text-[10px] text-fg3 font-medium">
                {content.length} characters
              </span>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Write your post here or generate using the AI Creative Assistant above..."
              className="w-full px-4 py-3 text-sm bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet placeholder:text-fg3 resize-none transition-all"
            />

            {/* Media Upload / Generation */}
            <div className="space-y-3">
              <div className="text-[11px] text-fg3 font-semibold uppercase tracking-wider">
                Post Image (Optional)
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe image to generate..."
                  className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet placeholder:text-fg3 transition-all"
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !imagePrompt.trim()}
                  className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap rounded-xl bg-card-custom border border-border2 text-fg hover:border-violet transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {generatingImage ? "Generating..." : "Gen Image"}
                </button>
              </div>

              {imageUrl && (
                <div className="relative group rounded-xl overflow-hidden border border-border2 max-w-[280px]">
                  <img src={imageUrl} alt="Generated Preview" className="w-full h-auto object-cover" />
                  <button
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 text-xs cursor-pointer transition-all"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Configuration */}
          <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
            <div className="text-[11px] text-fg3 font-semibold uppercase tracking-wider">
              3. Scheduling
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-fg2 mb-1.5 block">Release Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-card-custom border border-border2 text-fg2 hover:border-border-custom hover:text-fg transition-all cursor-pointer">
              Save Draft
            </button>
            <button
              onClick={handleSubmitPost}
              disabled={!content.trim() || selectedPlatforms.length === 0}
              className="flex-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-violet text-white hover:bg-violet-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_var(--violet-glow)] cursor-pointer"
            >
              <IconCalendarDue size={16} />
              {scheduledAt ? "Schedule Post" : "Post Now"}
            </button>
          </div>
        </div>

        {/* Right Side: Focus Mode Live Mockup Preview */}
        <div className="w-full lg:w-2/5 lg:sticky lg:top-[88px] space-y-4">
          <div className="text-[11px] text-fg3 font-semibold uppercase tracking-wider px-1">
            Live Preview Mockup
          </div>

          {/* Preview Tabs */}
          <div className="flex border-b border-border2">
            {platforms
              .filter((p) => selectedPlatforms.includes(p.id))
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreviewPlatform(p.id)}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    previewPlatform === p.id
                      ? "border-violet text-fg"
                      : "border-transparent text-fg3 hover:text-fg2"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            {selectedPlatforms.length === 0 && (
              <span className="px-4 py-2 text-xs text-fg3 italic">
                Select platform to preview
              </span>
            )}
          </div>

          {/* Live Mobile Device frame */}
          <div className="border border-border2 bg-ink2 rounded-[32px] p-5 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
            {/* Top Speaker/Camera Bar */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-black/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black/60 mr-2" />
              <div className="w-8 h-1 rounded-full bg-black/60" />
            </div>

            <div className="mt-4 flex-1">
              {previewPlatform === "linkedin" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-violet/20 flex items-center justify-center text-violet border border-violet/10 font-bold text-sm">
                      YO
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-fg">Your Organization</div>
                      <div className="text-[10px] text-fg3">Enterprise Account · 1s</div>
                    </div>
                  </div>
                  <p className="text-xs text-fg2 whitespace-pre-wrap leading-relaxed">
                    {content || "Start typing in the editor to see your post live preview..."}
                  </p>
                  {imageUrl && (
                    <img src={imageUrl} className="w-full h-44 object-cover rounded-xl mt-2 border border-border2" alt="LinkedIn preview" />
                  )}
                  <div className="border-t border-border2 pt-2 flex items-center justify-between text-[11px] text-fg3 font-semibold">
                    <span>👍 42 Likes</span>
                    <span>💬 12 Comments</span>
                  </div>
                </div>
              )}

              {previewPlatform === "x" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-fg2/20 flex items-center justify-center font-bold text-sm text-fg">
                      U
                    </div>
                    <div>
                      <div className="text-xs font-bold text-fg flex items-center gap-1">
                        You <span className="text-[10px] font-normal text-fg3">@you</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-fg2 whitespace-pre-wrap leading-relaxed font-sans">
                    {content || "Start typing in the editor to see your post live preview..."}
                  </p>
                  {imageUrl && (
                    <img src={imageUrl} className="w-full h-44 object-cover rounded-xl mt-2 border border-border2" alt="Twitter preview" />
                  )}
                  <div className="flex items-center justify-between text-fg3 text-xs pt-2">
                    <span>💬 12</span>
                    <span>🔁 5</span>
                    <span>❤️ 89</span>
                    <span>📤</span>
                  </div>
                </div>
              )}

              {previewPlatform === "instagram" && (
                <div className="space-y-3 bg-black/10 rounded-xl p-3 border border-border2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-violet-600 p-[1.5px]">
                      <div className="w-full h-full rounded-full bg-ink2 flex items-center justify-center text-[10px] font-bold text-fg">
                        U
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-fg">your_username</span>
                  </div>
                  <div className="aspect-square w-full rounded-lg bg-[rgba(255,255,255,0.03)] border border-border2 flex items-center justify-center relative overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} className="w-full h-full object-cover" alt="Instagram preview" />
                    ) : (
                      <div className="text-center text-fg3 p-4">
                        <IconPhoto size={36} className="mx-auto mb-2 opacity-55" />
                        <span className="text-xs">Visual post content</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-fg text-sm">
                    <div className="flex items-center gap-3">
                      <IconHeart size={18} />
                      <IconMessageCircle size={18} />
                      <IconSend size={18} />
                    </div>
                    <IconBookmark size={18} />
                  </div>
                  <p className="text-xs text-fg2 leading-relaxed">
                    <span className="font-semibold text-fg mr-1.5">your_username</span>
                    {content || "Post description goes here..."}
                  </p>
                </div>
              )}

              {previewPlatform === "tiktok" && (
                <div className="space-y-3 bg-black rounded-2xl p-4 min-h-[380px] flex flex-col justify-end text-white relative overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="TikTok preview" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80" />
                  )}
                  <div className="relative z-1 space-y-2">
                    <span className="text-xs font-bold">@your_handle</span>
                    <p className="text-xs text-gray-200">
                      {content || "TikTok caption and hashtags here..."}
                    </p>
                    <span className="text-[10px] text-gray-400 block">🎵 Original Sound - you</span>
                  </div>
                  {/* Right side floating icons */}
                  <div className="absolute right-3 bottom-14 flex flex-col gap-4 text-white items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">U</div>
                    <div className="flex flex-col items-center"><IconHeart size={20} /> <span className="text-[9px]">4.1K</span></div>
                    <div className="flex flex-col items-center"><IconMessageCircle size={20} /> <span className="text-[9px]">128</span></div>
                    <div className="flex flex-col items-center"><IconBookmark size={20} /> <span className="text-[9px]">56</span></div>
                  </div>
                </div>
              )}

              {previewPlatform === "pinterest" && (
                <div className="bg-card-custom border border-border2 rounded-2xl overflow-hidden max-w-[280px] mx-auto">
                  <div className="aspect-[2/3] w-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center relative overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} className="w-full h-full object-cover" alt="Pinterest preview" />
                    ) : (
                      <div className="text-center text-fg3 p-4">
                        <IconPhoto size={36} className="mx-auto mb-2 opacity-55" />
                        <span className="text-xs">Pin Visual Content</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="text-xs font-bold text-fg line-clamp-1">
                      {topic || "Pin Title"}
                    </div>
                    <p className="text-[10px] text-fg2 line-clamp-2">
                      {content || "Pin description goes here..."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Swipe Indicator */}
            <div className="w-24 h-1 rounded-full bg-fg3/50 mx-auto mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}