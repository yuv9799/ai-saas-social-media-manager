import {
  IconSparkles,
  IconCalendarTime,
  IconChartBar,
  IconMessage,
  IconUsersGroup,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconSparkles,
    title: "AI Caption Generation",
    desc: "Write scroll-stopping captions in seconds. Powered by Gemini AI — just describe your post and let the AI craft the perfect copy with hashtags.",
  },
  {
    icon: IconCalendarTime,
    title: "Multi-Platform Scheduling",
    desc: "Schedule across Instagram, LinkedIn, X, TikTok, and Pinterest from one dashboard. Visual calendar view lets you plan your content month ahead.",
  },
  {
    icon: IconChartBar,
    title: "Analytics Dashboard",
    desc: "Track reach, engagement, and post performance with beautiful charts. See what's working and double down on your best content.",
  },
  {
    icon: IconMessage,
    title: "Unified Inbox",
    desc: "Manage comments and DMs from every platform in one place. Never miss a mention or message again.",
  },
  {
    icon: IconUsersGroup,
    title: "Team Collaboration",
    desc: "Invite team members, assign roles, and collaborate on content. Workflows and approval gates keep your publishing pipeline smooth.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 border border-border-custom rounded-full px-3.5 py-1 text-xs font-medium text-[#a78bfa] tracking-wider bg-[rgba(124,58,237,0.1)] mb-6">
          <IconSparkles size={13} className="text-amber" />
          Everything you need
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,48px)] font-extrabold leading-tight tracking-tight text-fg mb-4">
          One platform to rule<br />all your social channels
        </h1>
        <p className="text-[15px] text-fg2 max-w-[580px] mx-auto leading-relaxed">
          From AI-powered copywriting to cross-platform scheduling and deep analytics — SocialPulse gives you everything your brand needs to grow.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card-custom border border-border2 rounded-xl p-6 hover:border-border-custom transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-violet/20 flex items-center justify-center mb-4">
              <f.icon size={20} className="text-violet" />
            </div>
            <h3 className="font-heading text-lg font-bold text-fg mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-fg2 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}