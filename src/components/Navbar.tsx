"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { IconSparkles } from "@tabler/icons-react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Analytics", href: "/analytics" },
  { label: "Enterprise", href: "/enterprise" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <nav className="relative z-10 flex items-center justify-between px-8 h-[58px] border-b border-border2">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-[30px] h-[30px] rounded-lg bg-violet flex items-center justify-center shadow-[0_0_16px_var(--violet-glow)]">
          <IconSparkles size={16} className="text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <div className="font-heading text-[15px] font-extrabold tracking-tight text-fg">
            Social<span className="text-violet">Pulse</span>
          </div>
          <div className="font-sans text-[9px] font-semibold tracking-[0.18em] uppercase text-fg3 mt-0.5">
            AI Platform
          </div>
        </div>
      </Link>

      {!isDashboard && (
        <div className="hidden md:flex items-center gap-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-[15px] h-[58px] flex items-center text-[13px] text-fg2 hover:text-fg transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-7 h-7",
              },
            }}
          />
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="h-[34px] px-4 text-[13px] border border-border2 rounded-lg bg-transparent text-fg2 hover:border-border-custom hover:text-fg hover:bg-card-custom transition-all flex items-center font-sans cursor-pointer">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="h-[34px] px-[18px] text-[13px] font-semibold border-none rounded-lg bg-violet text-white font-sans shadow-[0_0_20px_var(--violet-glow)] hover:bg-violet-dim transition-all flex items-center cursor-pointer">
                Start free
              </button>
            </SignUpButton>
          </>
        )}
      </div>
    </nav>
  );
}