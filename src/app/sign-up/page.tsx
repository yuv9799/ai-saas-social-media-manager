import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-8 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-fg mb-2">
            Create your account
          </h1>
          <p className="text-sm text-fg2">
            Start scheduling content with AI in minutes
          </p>
        </div>
        <div className="bg-ink2 border border-border-custom rounded-2xl p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-[rgba(255,255,255,0.05)] border border-border2 text-fg hover:bg-card-custom",
                formFieldInput:
                  "w-full px-4 py-2.5 text-sm bg-[rgba(255,255,255,0.05)] border border-border2 rounded-lg text-fg outline-none focus:border-violet placeholder:text-fg3",
                formButtonPrimary:
                  "w-full py-2.5 rounded-lg bg-violet text-white font-semibold text-sm shadow-[0_0_20px_var(--violet-glow)] hover:bg-violet-dim transition-all",
                footerActionLink: "text-violet hover:text-[#a78bfa]",
                dividerLine: "bg-border2",
                dividerText: "text-fg3",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}