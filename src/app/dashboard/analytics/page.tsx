"use client";

import { useState } from "react";
import {
  IconEye,
  IconHeart,
  IconSend,
  IconTrendingUp,
  IconCalendar,
  IconChartPie,
} from "@tabler/icons-react";

const stats = [
  { label: "Total Reach", value: "284.2K", change: "+31.2%", icon: IconEye, color: "text-violet" },
  { label: "Avg Engagement", value: "19.3K", change: "+18.4%", icon: IconHeart, color: "text-amber" },
  { label: "Posts Delivered", value: "47", change: "+9.1%", icon: IconSend, color: "text-emerald-400" },
  { label: "Growth Rate", value: "+12.4%", change: "+4.2%", icon: IconTrendingUp, color: "text-violet" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeslots = ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];

// Best times to post matrix (density representing engagement rate)
const heatmapData = [
  [30, 40, 95, 40, 20], // Mon
  [50, 60, 90, 80, 40], // Tue
  [40, 50, 85, 75, 30], // Wed
  [60, 70, 99, 90, 50], // Thu (Optimal peak)
  [45, 55, 80, 65, 35], // Fri
  [15, 20, 25, 30, 20], // Sat
  [10, 15, 20, 25, 35], // Sun
];

export default function AnalyticsPage() {
  const [metricTab, setMetricTab] = useState<"reach" | "engagement">("reach");

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-fg tracking-tight">
          Analytics & Performance
        </h1>
        <p className="text-xs text-fg3 font-medium">Audit reach, track platform metrics, and optimize posting calendars</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card-custom border border-border2 rounded-2xl p-4 hover:border-border-custom transition-all">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className={s.color} />
              <span className="text-[10px] text-emerald-400 font-semibold">{s.change}</span>
            </div>
            <div className="font-heading text-2xl font-extrabold text-fg">{s.value}</div>
            <div className="text-xs text-fg3 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-ink2 border border-border-custom rounded-2xl p-5 space-y-4 shadow-[0_0_35px_rgba(124,58,237,0.03)]">
        <div className="flex items-center justify-between border-b border-border2 pb-3">
          <h2 className="font-heading text-sm font-bold text-fg flex items-center gap-1.5">
            <IconChartPie size={16} className="text-violet" />
            Performance Over Time
          </h2>
          <div className="flex bg-card-custom p-0.5 rounded-lg border border-border2">
            <button
              onClick={() => setMetricTab("reach")}
              className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                metricTab === "reach" ? "bg-violet text-white" : "text-fg3 hover:text-fg"
              }`}
            >
              Reach
            </button>
            <button
              onClick={() => setMetricTab("engagement")}
              className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                metricTab === "engagement" ? "bg-violet text-white" : "text-fg3 hover:text-fg"
              }`}
            >
              Engagement
            </button>
          </div>
        </div>

        {/* Vector SVG Line Chart */}
        <div className="relative pt-4">
          <svg viewBox="0 0 700 160" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(240, 237, 255, 0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="rgba(240, 237, 255, 0.05)" strokeDasharray="4 4" />
            <line x1="0" y1="130" x2="700" y2="130" stroke="rgba(240, 237, 255, 0.05)" strokeDasharray="4 4" />

            {metricTab === "reach" ? (
              <>
                {/* Area under curve */}
                <path
                  d="M0 130 C 50 120, 100 140, 150 110 C 200 80, 250 50, 300 40 C 350 30, 400 90, 450 70 C 500 50, 550 40, 600 30 C 650 20, 700 10, 700 10 L 700 160 L 0 160 Z"
                  fill="url(#chartGradient)"
                />
                {/* Graph Path line */}
                <path
                  d="M0 130 C 50 120, 100 140, 150 110 C 200 80, 250 50, 300 40 C 350 30, 400 90, 450 70 C 500 50, 550 40, 600 30 C 650 20, 700 10, 700 10"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                {/* Engagement curve */}
                <path
                  d="M0 140 C 50 135, 100 115, 150 125 C 200 135, 250 95, 300 80 C 350 65, 400 110, 450 100 C 500 90, 550 65, 600 50 C 650 35, 700 25, 700 25 L 700 160 L 0 160 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0 140 C 50 135, 100 115, 150 125 C 200 135, 250 95, 300 80 C 350 65, 400 110, 450 100 C 500 90, 550 65, 600 50 C 650 35, 700 25, 700 25"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>

          {/* X axis labels */}
          <div className="flex justify-between text-[9px] text-fg3 font-semibold uppercase tracking-wider pt-2 px-1">
            <span>Monday</span>
            <span>Tuesday</span>
            <span>Wednesday</span>
            <span>Thursday</span>
            <span>Friday</span>
            <span>Saturday</span>
            <span>Sunday</span>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-ink2 border border-border2 rounded-2xl p-5 space-y-4">
        <h2 className="font-heading text-sm font-bold text-fg flex items-center gap-1.5">
          <IconCalendar size={16} className="text-violet" />
          Optimal Posting Times (Audience Activity Heatmap)
        </h2>
        <p className="text-xs text-fg2 leading-relaxed">
          The chart below represents audience density and response rates. Plan your scheduled slots on peak blocks (<span className="text-[#a78bfa] font-semibold">darker purple</span>) to maximize initial reach.
        </p>

        <div className="overflow-x-auto pt-2">
          <div className="min-w-[550px] space-y-2">
            {/* Timeslots header */}
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-fg3 uppercase tracking-wider">
              <div className="text-left">Day</div>
              {timeslots.map((slot) => (
                <div key={slot}>{slot}</div>
              ))}
            </div>

            {/* Days grid */}
            {days.map((day, dIdx) => (
              <div key={day} className="grid grid-cols-6 gap-2 items-center">
                <div className="text-xs font-semibold text-fg2 text-left">{day}</div>
                {heatmapData[dIdx].map((value, vIdx) => {
                  // Select color opacity based on density value
                  const opacity = value / 100;
                  return (
                    <div
                      key={vIdx}
                      className="aspect-[4/2] rounded-lg border border-violet/10 flex items-center justify-center font-bold text-[9px] transition-all hover:scale-[1.03] cursor-pointer"
                      style={{
                        backgroundColor: `rgba(124, 58, 237, ${opacity * 0.7 + 0.05})`,
                        color: opacity > 0.6 ? "#fff" : "rgba(240, 237, 255, 0.7)",
                      }}
                      title={`${value}% Audience activity`}
                    >
                      {value}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}