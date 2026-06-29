"use client";

import { useState } from "react";
import Link from "next/link";
import { IconCheck, IconSparkles } from "@tabler/icons-react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annually: 0 },
    desc: "Perfect for getting started",
    captionLimit: "25 captions/mo",
    features: [
      "AI caption generation",
      "Single platform scheduling",
      "Basic analytics",
      "7-day post history",
    ],
    cta: "Start free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Growth",
    price: { monthly: 19, annually: 15 },
    desc: "For growing brands",
    captionLimit: "200 captions/mo",
    features: [
      "Everything in Free",
      "5 platform scheduling",
      "Advanced analytics",
      "30-day post history",
      "Team collaboration (3 seats)",
      "Priority support",
    ],
    cta: "Start growth",
    href: "/sign-up",
    highlighted: true,
  },
  {
    name: "Pro",
    price: { monthly: 49, annually: 39 },
    desc: "For serious content teams",
    captionLimit: "Unlimited captions",
    features: [
      "Everything in Growth",
      "Unlimited scheduling",
      "Real-time analytics",
      "Full post history",
      "Team collaboration (10 seats)",
      "API access",
      "Custom branding",
      "Dedicated support",
    ],
    cta: "Go Pro",
    href: "/sign-up",
    highlighted: false,
  },
];

const allFeatures = [
  "AI caption generation",
  "Multi-platform scheduling",
  "Analytics dashboard",
  "Post history",
  "Team collaboration",
  "API access",
  "Custom branding",
  "Priority support",
  "Unified inbox",
];

const featureMap: Record<string, { free: boolean; growth: boolean; pro: boolean }> = {
  "AI caption generation": { free: true, growth: true, pro: true },
  "Multi-platform scheduling": { free: false, growth: true, pro: true },
  "Analytics dashboard": { free: true, growth: true, pro: true },
  "Post history": { free: false, growth: true, pro: true },
  "Team collaboration": { free: false, growth: true, pro: true },
  "API access": { free: false, growth: false, pro: true },
  "Custom branding": { free: false, growth: false, pro: true },
  "Priority support": { free: false, growth: true, pro: true },
  "Unified inbox": { free: false, growth: false, pro: true },
};

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 border border-border-custom rounded-full px-3.5 py-1 text-xs font-medium text-[#a78bfa] tracking-wider bg-[rgba(124,58,237,0.1)] mb-6">
          <IconSparkles size={13} className="text-amber" />
          Simple pricing
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,48px)] font-extrabold leading-tight tracking-tight text-fg mb-4">
          Choose the plan that fits
        </h1>
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className={`text-sm ${!annual ? "text-fg" : "text-fg2"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`w-12 h-6 rounded-full transition-colors ${
              annual ? "bg-violet" : "bg-border2"
            } relative`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                annual ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-fg" : "text-fg2"}`}>
            Annual{" "}
            <span className="text-amber font-semibold">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-20">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 border transition-all ${
              plan.highlighted
                ? "bg-violet/10 border-violet shadow-[0_0_30px_rgba(124,58,237,0.2)]"
                : "bg-card-custom border-border2 hover:border-border-custom"
            }`}
          >
            {plan.highlighted && (
              <div className="text-[10px] font-bold text-amber uppercase tracking-widest mb-2">
                Most popular
              </div>
            )}
            <h3 className="font-heading text-xl font-bold text-fg mb-1">
              {plan.name}
            </h3>
            <p className="text-xs text-fg3 mb-4">{plan.desc}</p>
            <div className="mb-4">
              <span className="font-heading text-4xl font-extrabold text-fg">
                ${annual ? plan.price.annually : plan.price.monthly}
              </span>
              {plan.price.monthly > 0 && (
                <span className="text-fg3 text-sm ml-1">/mo</span>
              )}
            </div>
            <div className="text-xs text-fg3 mb-4">{plan.captionLimit}</div>
            <Link
              href={plan.href}
              className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all ${
                plan.highlighted
                  ? "bg-violet text-white shadow-[0_0_20px_var(--violet-glow)] hover:bg-violet-dim"
                  : "bg-card-custom border border-border2 text-fg2 hover:border-border-custom hover:text-fg"
              }`}
            >
              {plan.cta}
            </Link>
            <ul className="mt-6 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-fg2">
                  <IconCheck size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <h2 className="font-heading text-2xl font-bold text-fg text-center mb-8">
        Full feature comparison
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border2">
              <th className="text-left py-3 px-4 text-fg2 font-medium">Feature</th>
              <th className="text-center py-3 px-4 text-fg font-semibold">Free</th>
              <th className="text-center py-3 px-4 text-violet font-semibold">Growth</th>
              <th className="text-center py-3 px-4 text-fg font-semibold">Pro</th>
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((f) => {
              const m = featureMap[f];
              return (
                <tr key={f} className="border-b border-border2">
                  <td className="py-3 px-4 text-fg2">{f}</td>
                  <td className="text-center py-3 px-4">
                    {m.free ? (
                      <IconCheck size={16} className="text-emerald-400 inline" />
                    ) : (
                      <span className="text-fg3">—</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {m.growth ? (
                      <IconCheck size={16} className="text-emerald-400 inline" />
                    ) : (
                      <span className="text-fg3">—</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {m.pro ? (
                      <IconCheck size={16} className="text-emerald-400 inline" />
                    ) : (
                      <span className="text-fg3">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}