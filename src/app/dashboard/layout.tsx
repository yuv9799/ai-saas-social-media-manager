"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconEdit,
  IconCalendarEvent,
  IconChartBar,
  IconInbox,
  IconLogout,
  IconSparkles,
  IconSettings,
  IconMessageCircle,
  IconPhoto,
  IconTemplate,
  IconShield,
} from "@tabler/icons-react";

const sidebarLinks = [
  { label: "Overview", href: "/dashboard", icon: IconLayoutDashboard },
  { label: "Compose", href: "/dashboard/compose", icon: IconEdit },
  { label: "AI Carousel", href: "/dashboard/carousel", icon: IconTemplate },
  { label: "Schedule", href: "/dashboard/schedule", icon: IconCalendarEvent },
  { label: "AI Chat", href: "/dashboard/chat", icon: IconMessageCircle },
  { label: "Media Library", href: "/dashboard/media", icon: IconPhoto },
  { label: "Analytics", href: "/dashboard/analytics", icon: IconChartBar },
  { label: "Inbox", href: "/dashboard/inbox", icon: IconInbox },
  { label: "Settings", href: "/dashboard/settings", icon: IconSettings },
  { label: "Admin Panel", href: "/dashboard/admin", icon: IconShield },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-58px-42px)]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border2 bg-ink2/50 hidden md:flex flex-col">
        <div className="p-4 border-b border-border2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet flex items-center justify-center">
              <IconSparkles size={14} className="text-white" />
            </div>
            <span className="font-heading text-sm font-extrabold text-fg">
              Social<span className="text-violet">Pulse</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-violet/15 text-violet font-medium"
                    : "text-fg2 hover:text-fg hover:bg-card-custom"
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border2">
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-fg2 hover:text-fg hover:bg-card-custom transition-all w-full">
            <IconLogout size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden w-full border-b border-border2 bg-ink2/50 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                isActive
                  ? "bg-violet/15 text-violet font-medium"
                  : "text-fg2 hover:text-fg"
              }`}
            >
              <link.icon size={14} />
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}