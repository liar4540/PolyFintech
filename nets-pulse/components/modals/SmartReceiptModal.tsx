"use client";

import { X, Share2, Download, Sparkles } from "lucide-react";

interface SmartReceiptModalProps {
  merchantName: string;
  location?: string;
  onClose: () => void;
}

export default function SmartReceiptModal({ merchantName, location = "Bangkok, Thailand", onClose }: SmartReceiptModalProps) {
  const cityName = location.split(",")[0].trim();
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-5">
      <div className="w-full max-w-xs animate-fade-scale">
        <div
          className="relative rounded-3xl overflow-hidden p-6 text-center"
          style={{
            background: "linear-gradient(135deg, #0f0010 0%, #011835 40%, #001a08 100%)",
            border: "1px solid rgba(234,0,41,0.4)",
            boxShadow: "0 0 40px rgba(234,0,41,0.25), 0 0 80px rgba(16,185,129,0.12)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {["10%", "30%", "60%", "80%", "50%"].map((l, i) => (
              <div key={i} className="absolute text-xl animate-pulse" style={{ left: l, top: `${15 + i * 15}%`, animationDelay: `${i * 0.3}s` }}>
                ✨
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs text-white/80 font-semibold tracking-widest uppercase">NETS Pulse</span>
            </div>

            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-white font-black text-xl leading-tight mb-1">Achievement Unlocked!</h2>
            <p className="text-[#F78DA7] text-sm mb-4">via NETS QR</p>

            <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-gray-300 text-xs uppercase tracking-widest mb-1">You just unlocked</p>
              <p className="text-white font-bold text-lg">{cityName}&apos;s #1 Trending</p>
              <p className="text-[#10B981] font-black text-xl">Hidden Café</p>
              <div className="mt-2 text-xs text-gray-400">📍 {merchantName}</div>
            </div>

            <div className="flex justify-around mb-4">
              {[
                { icon: "🌏", label: "Cross-Border", val: "NETS QR" },
                { icon: "🔥", label: "Trending",     val: "#1 Spot" },
                { icon: "⚡", label: "Streak",       val: "7 Days" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl">{s.icon}</div>
                  <div className="text-white text-xs font-bold">{s.val}</div>
                  <div className="text-gray-500 text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="text-[#EA0029] text-xs font-semibold">#NETSPulse #SGPayAnywhere</div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => alert("Saved! Screenshot your receipt lah 📱")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl glass border border-white/10 text-white text-sm font-semibold active:scale-95 transition-transform"
          >
            <Download size={16} /> Save
          </button>
          <button
            onClick={() => alert("Shared to your story! Flex max 💪")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #EA0029, #10B981)" }}
          >
            <Share2 size={16} /> Share
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-3 py-3 text-gray-400 text-sm flex items-center justify-center gap-2">
          <X size={14} /> Close
        </button>
      </div>
    </div>
  );
}
