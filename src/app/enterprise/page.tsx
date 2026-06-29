"use client";

import { useState } from "react";
import { IconShieldLock, IconHeadset, IconUsers, IconInfinity, IconCheck, IconSend, IconSparkles } from "@tabler/icons-react";

const perks = [
  { icon: IconShieldLock, title: "SSO & SAML", desc: "Enterprise-grade single sign-on with any identity provider." },
  { icon: IconHeadset, title: "99.99% SLA", desc: "Guaranteed uptime with dedicated support engineers." },
  { icon: IconUsers, title: "Dedicated CSM", desc: "A Customer Success Manager who knows your team." },
  { icon: IconInfinity, title: "Custom Limits", desc: "Unlimited captions, posts, team members — tailored to you." },
];

export default function EnterprisePage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/enterprise-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 border border-border-custom rounded-full px-3.5 py-1 text-xs font-medium text-[#a78bfa] tracking-wider bg-[rgba(124,58,237,0.1)] mb-6">
          <IconSparkles size={13} className="text-amber" />
          Enterprise
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,48px)] font-extrabold leading-tight tracking-tight text-fg mb-4">
          Built for scale.<br />Secured for enterprise.
        </h1>
        <p className="text-[15px] text-fg2 max-w-[580px] mx-auto leading-relaxed">
          From SSO to dedicated support, SocialPulse Enterprise gives your organization the controls, compliance, and capacity it needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {perks.map((p) => (
          <div key={p.title} className="bg-card-custom border border-border2 rounded-xl p-5 hover:border-border-custom transition-all">
            <div className="w-9 h-9 rounded-lg bg-violet/20 flex items-center justify-center mb-3">
              <p.icon size={18} className="text-violet" />
            </div>
            <h3 className="font-heading text-base font-bold text-fg mb-1">{p.title}</h3>
            <p className="text-xs text-fg2 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="font-heading text-2xl font-bold text-fg mb-4">Why choose Enterprise?</h2>
          <ul className="space-y-3">
            {[
              "Centralized billing and team management",
              "Custom integration with your tech stack",
              "Dedicated migration support",
              "Advanced compliance (SOC 2, GDPR ready)",
              "Custom AI model training on your brand voice",
              "Priority feature requests and roadmap input",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-fg2">
                <IconCheck size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-ink2 border border-border-custom rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <IconCheck size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-fg mb-2">Thanks, we'll be in touch!</h3>
              <p className="text-sm text-fg2">Your enquiry has been sent to our enterprise team.</p>
            </div>
          ) : (
            <>
              <h3 className="font-heading text-lg font-bold text-fg mb-4">Get enterprise pricing</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet placeholder:text-fg3 transition-all"
                />
                <input
                  type="email"
                  placeholder="Work email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet placeholder:text-fg3 transition-all"
                />
                <input
                  type="text"
                  placeholder="Company"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet placeholder:text-fg3 transition-all"
                />
                <textarea
                  placeholder="Tell us about your needs (optional)"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet placeholder:text-fg3 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-violet text-white font-semibold text-sm shadow-[0_0_20px_var(--violet-glow)] hover:bg-violet-dim transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? "Sending…" : (
                    <>
                      <IconSend size={14} />
                      Send enquiry
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}