import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border2 py-8 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="font-heading text-sm font-extrabold text-fg">
            Social<span className="text-violet">Pulse</span>
          </div>
          <span className="text-fg3 text-[11px]">
            &copy; {new Date().getFullYear()} — AI-powered social media
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-fg3">
          <Link href="/features" className="hover:text-fg transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-fg transition-colors">
            Pricing
          </Link>
          <Link href="/analytics" className="hover:text-fg transition-colors">
            Analytics
          </Link>
          <Link href="/enterprise" className="hover:text-fg transition-colors">
            Enterprise
          </Link>
        </div>
      </div>
    </footer>
  );
}