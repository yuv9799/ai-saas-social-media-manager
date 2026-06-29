"use client";

import { IconMessage, IconBrandInstagram, IconBrandLinkedin, IconBrandX, IconBrandTiktok, IconHeart, IconArrowBackUp } from "@tabler/icons-react";

const platformIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: IconBrandInstagram,
  linkedin: IconBrandLinkedin,
  x: IconBrandX,
  tiktok: IconBrandTiktok,
};

const messages = [
  { id: 1, platform: "instagram", user: "@jessica_creative", text: "Love this post! What font did you use?", time: "2m ago", likes: 12 },
  { id: 2, platform: "x", user: "@techreviewer", text: "Great thread on AI adoption. Would love to connect!", time: "15m ago", likes: 8 },
  { id: 3, platform: "linkedin", user: "Sarah Chen", text: "Impressive growth numbers! Would you be open to a collab?", time: "1h ago", likes: 24 },
  { id: 4, platform: "instagram", user: "@design_daily", text: "Your latest reel is fire 🔥 Keep it up!", time: "2h ago", likes: 45 },
  { id: 5, platform: "tiktok", user: "@creator_nick", text: "How do you edit your videos? The quality is amazing.", time: "3h ago", likes: 18 },
  { id: 6, platform: "x", user: "@buildspace", text: "We featured your product in our newsletter! Check it out.", time: "5h ago", likes: 33 },
];

export default function InboxPage() {
  return (
    <div>
      <h1 className="font-heading text-xl font-bold text-fg mb-6">Inbox</h1>

      <div className="space-y-2">
        {messages.map((msg) => {
          const PlatformIcon = platformIcons[msg.platform];
          return (
            <div
              key={msg.id}
              className="bg-card-custom border border-border2 rounded-xl p-4 hover:border-border-custom transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet/20 flex items-center justify-center shrink-0">
                  {PlatformIcon && <PlatformIcon size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-fg">{msg.user}</span>
                    <span className="text-[10px] text-fg3 bg-border2 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {msg.platform}
                    </span>
                  </div>
                  <p className="text-sm text-fg2 line-clamp-2">{msg.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-fg3">{msg.time}</span>
                    <span className="flex items-center gap-1 text-[11px] text-fg3">
                      <IconHeart size={12} />
                      {msg.likes}
                    </span>
                    <button className="flex items-center gap-1 text-[11px] text-violet hover:text-[#a78bfa] transition-colors">
                      <IconArrowBackUp size={12} className="text-violet" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-fg3">
          Showing mock data — real platform integration coming soon.
        </p>
      </div>
    </div>
  );
}