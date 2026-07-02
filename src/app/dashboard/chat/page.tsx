"use client";

import { useState } from "react";
import { BACKEND_URL } from "@/lib/api";
import {
  IconSparkles,
  IconSend,
  IconCopy,
  IconPlus,
  IconBrain,
  IconFlame,
  IconTarget,
} from "@tabler/icons-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const initialPrompts = [
  { text: "Brainstorm 5 content ideas for a SaaS launch", icon: IconBrain },
  { text: "Write a viral hooks thread for Twitter", icon: IconFlame },
  { text: "Generate Instagram caption for summer clothing line", icon: IconTarget },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hello! I am your AI Social Media Strategist. Ask me to brainstorm topics, write hooks, outline threads, or draft captions!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInput("");
    
    // Add User Message
    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Call Centralized Express Backend
      const res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer dummy_token"
        },
        body: JSON.stringify({
          topic: text,
          platform: "general"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", text: data.caption }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I had trouble processing that request. Please try again." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", text: "Unable to connect to the backend AI service. Please make sure the backend server is running." }]);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-[800px] mx-auto flex flex-col h-[calc(100vh-140px)] border border-border2 bg-ink2 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-card-custom/50 border-b border-border2 px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <IconSparkles className="text-amber" size={20} />
          <div>
            <h1 className="text-sm font-bold text-fg">AI Strategist Hub</h1>
            <p className="text-[10px] text-fg3 font-semibold">Gemini 2.0 Flash Active</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-violet text-white rounded-tr-none shadow-[0_0_15px_var(--violet-glow)]"
                  : "bg-card-custom/40 border border-border2 text-fg2 rounded-tl-none"
              }`}
            >
              <div>{msg.text}</div>
              {msg.role === "assistant" && idx > 0 && (
                <div className="mt-3 pt-2.5 border-t border-border2 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(msg.text)}
                    className="flex items-center gap-1 text-[10px] text-fg3 hover:text-fg transition-all"
                  >
                    <IconCopy size={12} />
                    Copy text
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card-custom/40 border border-border2 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-xs text-fg3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "300ms" }} />
              AI is writing...
            </div>
          </div>
        )}
      </div>

      {/* Inputs Footer */}
      <div className="bg-card-custom/20 border-t border-border2 p-4 shrink-0 space-y-4">
        {/* Quick prompt suggestions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {initialPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold border border-border2 text-fg2 hover:border-border-custom hover:text-fg bg-card-custom transition-all cursor-pointer"
              >
                <p.icon size={13} className="text-violet" />
                {p.text}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="flex-1 px-4 py-3 text-xs bg-[rgba(255,255,255,0.03)] border border-border2 rounded-xl text-fg outline-none focus:border-violet"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-violet hover:bg-violet-dim text-white disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_var(--violet-glow)]"
          >
            <IconSend size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
