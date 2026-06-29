import { IconChartBar, IconEye, IconUsers, IconTrendingUp, IconBrain, IconDeviceAnalytics, IconSparkles } from "@tabler/icons-react";

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 border border-border-custom rounded-full px-3.5 py-1 text-xs font-medium text-[#a78bfa] tracking-wider bg-[rgba(124,58,237,0.1)] mb-6">
          <IconSparkles size={13} className="text-amber" />
          Analytics
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,48px)] font-extrabold leading-tight tracking-tight text-fg mb-4">
          Know what works.<br />Double down on it.
        </h1>
        <p className="text-[15px] text-fg2 max-w-[580px] mx-auto leading-relaxed">
          SocialPulse Analytics gives you real-time visibility into every post, platform, and campaign — powered by PostHog and beautiful custom charts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-16">
        {[
          { icon: IconEye, title: "Reach Tracking", desc: "See exactly how many eyes land on your content. Track impressions, unique views, and audience growth across all platforms." },
          { icon: IconUsers, title: "Engagement Metrics", desc: "Likes, comments, shares, saves — drill into every engagement type and identify your most resonant content." },
          { icon: IconTrendingUp, title: "Performance Trends", desc: "Compare week-over-week and month-over-month performance. Spot winning content formats before they peak." },
          { icon: IconBrain, title: "AI Insights", desc: "Let AI analyze your top-performing posts and suggest content strategies, optimal posting times, and hashtag clusters." },
        ].map((item) => (
          <div key={item.title} className="bg-card-custom border border-border2 rounded-xl p-6 hover:border-border-custom transition-all">
            <div className="w-10 h-10 rounded-lg bg-violet/20 flex items-center justify-center mb-4">
              <item.icon size={20} className="text-violet" />
            </div>
            <h3 className="font-heading text-lg font-bold text-fg mb-2">{item.title}</h3>
            <p className="text-sm text-fg2 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="relative bg-ink2 border border-border-custom rounded-2xl p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet/5 rounded-full blur-3xl" />
        <div className="relative z-1">
          <h2 className="font-heading text-2xl font-bold text-fg mb-4">Understand your audience deeply</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Best time to post", value: "3:00 PM EST" },
              { label: "Top platform", value: "Instagram" },
              { label: "Avg. engagement rate", value: "4.2%" },
            ].map((stat) => (
              <div key={stat.label} className="border border-border2 rounded-xl p-4 bg-card-custom">
                <div className="text-[11px] text-fg3 font-medium uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="font-heading text-xl font-bold text-fg">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="font-heading text-lg font-bold text-fg mb-3">Real-time dashboard</div>
            <div className="flex items-center gap-3 text-sm text-fg2 bg-card-custom border border-border2 rounded-xl p-4">
              <IconDeviceAnalytics size={20} className="text-violet shrink-0" />
              <span>Track page views, custom events, and conversion funnels with PostHog-powered analytics. Export reports in one click.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}