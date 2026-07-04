"use client";

import { useState } from "react";
import { X, ChevronRight, Share2, Sparkles } from "lucide-react";
import { WRAPPED_STATS } from "@/lib/mockData";

interface WrappedModalProps {
  onClose: () => void;
}

const slides = [
  {
    id: 0,
    bg: "from-[#0E0010] via-[#2D1060] to-[#0E0010]",
    accent: "#7C3AED",
    content: (stats: typeof WRAPPED_STATS) => (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-6">
        <div className="text-6xl animate-bounce">🎵</div>
        <div>
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-2">NETS Pulse</p>
          <h1 className="text-4xl font-black text-white leading-tight">
            Your {stats.year}<br />in Payments
          </h1>
          <p className="text-[#A78BFA] mt-3 text-lg">Steady lah 🔥</p>
        </div>
        <p className="text-gray-400 text-sm">{stats.totalTransactions} transactions this year</p>
      </div>
    ),
  },
  {
    id: 1,
    bg: "from-[#0a0a14] via-[#1a0a2e] to-[#0a0a14]",
    accent: "#7C3AED",
    content: (stats: typeof WRAPPED_STATS) => (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-6">
        <div className="text-7xl">🧋</div>
        <div>
          <p className="text-[#8B5CF6] text-sm font-semibold tracking-widest uppercase mb-2">Your #1 Spot</p>
          <h2 className="text-5xl font-black text-white">{stats.topMerchant}</h2>
          <p className="text-[#A78BFA] mt-2 text-xl">{stats.topMerchantVisits} visits</p>
        </div>
        <div className="glass rounded-2xl px-6 py-3 border border-[#7C3AED]/30">
          <p className="text-gray-300 text-sm">You&apos;re literally a regular. They probably know your order liao. ☕</p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    bg: "from-[#081a0e] via-[#0d2d18] to-[#081a0e]",
    accent: "#10B981",
    content: (stats: typeof WRAPPED_STATS) => (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-6">
        <div className="text-7xl">🍱</div>
        <div>
          <p className="text-[#10B981] text-sm font-semibold tracking-widest uppercase mb-2">Top Category</p>
          <h2 className="text-5xl font-black text-white">{stats.topCategory}</h2>
          <p className="text-[#6EE7B7] mt-2 text-2xl font-bold">${stats.topCategorySpend}</p>
        </div>
        <div className="glass rounded-2xl px-6 py-3 border border-[#10B981]/30">
          <p className="text-gray-300 text-sm">{stats.funFact}</p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    bg: "from-[#0a1020] via-[#0f1a40] to-[#0a1020]",
    accent: "#3B82F6",
    content: (stats: typeof WRAPPED_STATS) => (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-6">
        <div className="text-7xl">🌏</div>
        <div>
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">Globe Trotter</p>
          <h2 className="text-5xl font-black text-white">{stats.countriesVisited}<span className="text-3xl"> Countries</span></h2>
          <p className="text-blue-300 mt-2 text-lg">{stats.overseasTrips} overseas trips</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {["🇸🇬 SG", "🇹🇭 TH", "🇲🇾 MY", "🇯🇵 JP"].map((c) => (
            <span key={c} className="glass rounded-full px-4 py-2 text-sm text-white border border-blue-500/30">{c}</span>
          ))}
        </div>
        <p className="text-gray-400 text-sm">NETS QR accepted at every stop — shiok!</p>
      </div>
    ),
  },
  {
    id: 4,
    bg: "from-[#1a0a0a] via-[#2d1010] to-[#1a0a0a]",
    accent: "#F59E0B",
    content: (stats: typeof WRAPPED_STATS) => (
      <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-6">
        <div className="text-7xl animate-bounce">🏆</div>
        <div>
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">Your {stats.year} in Numbers</p>
          <h2 className="text-4xl font-black text-white mb-4">The Final Tally</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Transactions", val: stats.totalTransactions, icon: "⚡" },
              { label: "Countries",    val: stats.countriesVisited,  icon: "🌏" },
              { label: "Saved",        val: `$${stats.totalSaved}`,  icon: "💰" },
              { label: "Peak Day",     val: stats.peakDay,           icon: "🔥" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-3 border border-amber-500/20">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-white font-bold text-lg">{s.val}</div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#10B981] text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-violet-500/30 active:scale-95 transition-transform"
          onClick={() => alert("Screenshot shared! (Demo mode) 📸")}
        >
          <Share2 size={16} />
          Share My Recap
        </button>
      </div>
    ),
  },
];

export default function WrappedModal({ onClose }: WrappedModalProps) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) setCurrent((c) => c + 1);
  };
  const prev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const slide = slides[current];

  return (
    <div className="absolute inset-0 z-50 flex flex-col animate-fade-in" style={{ borderRadius: 40, overflow: "hidden" }}>
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.bg} transition-all duration-700`} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-12 right-5 z-10 p-2 glass rounded-full border border-white/10"
      >
        <X size={18} className="text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 6,
              background: i === current ? slide.accent : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* Slide content */}
      <div key={current} className="relative flex-1 animate-fade-scale">
        {slide.content(WRAPPED_STATS)}
      </div>

      {/* Navigation */}
      <div className="relative flex justify-between items-center px-6 pb-10 pt-4">
        <button
          onClick={prev}
          disabled={current === 0}
          className="px-5 py-2 glass rounded-full text-white text-sm disabled:opacity-30 border border-white/10"
        >
          ← Back
        </button>
        {current < slides.length - 1 ? (
          <button
            onClick={next}
            className="flex items-center gap-2 px-6 py-2 rounded-full text-white text-sm font-semibold"
            style={{ background: slide.accent }}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-violet-600 to-emerald-500"
          >
            <Sparkles size={14} /> Done
          </button>
        )}
      </div>
    </div>
  );
}
