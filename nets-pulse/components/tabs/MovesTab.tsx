"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronRight } from "lucide-react";
import { SPENDING_BREAKDOWN, ALL_TRANSACTIONS } from "@/lib/mockData";
import TimeCapsuleModal from "@/components/modals/TimeCapsuleModal";

const CATEGORIES = ["All", "Food", "Shopping", "Transport", "Music", "Coffee"];

export default function MovesTab() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCapsule, setShowCapsule] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const total = SPENDING_BREAKDOWN.reduce((s, c) => s + c.amount, 0);
  const filtered = ALL_TRANSACTIONS.filter((tx) => {
    const matchCat = activeCategory === "All" ||
      tx.sub.toLowerCase().includes(activeCategory.toLowerCase()) ||
      tx.name.toLowerCase().includes(activeCategory.toLowerCase());
    const matchSearch = searchQuery === "" ||
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Donut segments
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = SPENDING_BREAKDOWN.map((cat) => {
    const pct = cat.amount / total;
    const dash = pct * circumference;
    const seg = { ...cat, dash, offset };
    offset += dash;
    return seg;
  });

  const grouped = filtered.reduce<Record<string, typeof ALL_TRANSACTIONS>>((acc, tx) => {
    (acc[tx.date] ||= []).push(tx);
    return acc;
  }, {});

  return (
    <>
      {showCapsule && <TimeCapsuleModal onClose={() => setShowCapsule(false)} />}
      <div className="flex flex-col gap-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-gray-400 text-sm">July 2026</p>
            <h1 className="text-white font-black text-2xl">Your Moves</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setSearchOpen((o) => !o); setSearchQuery(""); }}
              className="w-9 h-9 glass rounded-full border border-white/10 flex items-center justify-center transition-all"
              style={{ background: searchOpen ? "#E4002B" : undefined }}
            >
              <Search size={16} className="text-white" />
            </button>
            <button className="w-9 h-9 glass rounded-full border border-white/10 flex items-center justify-center">
              <SlidersHorizontal size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5 animate-slide-down"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-500 text-xs font-bold">✕</button>
            )}
          </div>
        )}

        {/* Time Capsule Banner */}
        <button
          onClick={() => setShowCapsule(true)}
          className="w-full rounded-2xl p-4 text-left active:scale-95 transition-transform relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(228,0,43,0.15) 0%, rgba(16,185,129,0.08) 100%)",
            border: "1px solid rgba(228,0,43,0.25)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🗺️</div>
            <div className="flex-1">
              <p className="text-[#F78DA7] text-xs font-bold uppercase tracking-widest mb-0.5">Time Capsule</p>
              <p className="text-white font-bold text-sm">Bangkok Graduation Trip 2026</p>
              <p className="text-gray-400 text-xs">22–26 Jun · $312.50 SGD</p>
            </div>
            <ChevronRight size={16} className="text-[#E4002B]" />
          </div>
        </button>

        {/* Spending Breakdown */}
        <div className="glass rounded-3xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Spending Breakdown</h3>
            <p className="text-gray-400 text-xs">${total} total</p>
          </div>
          <div className="flex gap-4">
            {/* Donut */}
            <div className="relative flex-shrink-0" style={{ width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" width={100} height={100}>
                {segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                    strokeDashoffset={-seg.offset}
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dasharray 0.6s ease" }}
                  />
                ))}
                <text x="50" y="53" textAnchor="middle" fill="white" fontSize="11" fontWeight="800">${total}</text>
              </svg>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-1 flex-1 justify-center">
              {SPENDING_BREAKDOWN.map((cat) => (
                <div key={cat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="text-gray-400 text-xs">{cat.label}</span>
                  </div>
                  <span className="text-white text-xs font-bold">${cat.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-90"
              style={{
                background: activeCategory === cat ? "#E4002B" : "rgba(255,255,255,0.07)",
                color: activeCategory === cat ? "#fff" : "#999",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">{date}</p>
                <p className="text-gray-500 text-xs">−${txs.reduce((s, t) => s + Math.abs(t.amount), 0).toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-2">
                {txs.map((tx) => (
                  <div key={tx.id} className="glass flex items-center gap-3 p-3 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                      {tx.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{tx.name}</p>
                      <p className="text-gray-500 text-xs">{tx.sub}</p>
                    </div>
                    <p className="text-[#EF4444] text-sm font-bold">{tx.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Empty state */}
        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-3xl">🔍</p>
            <p className="text-white font-bold text-sm">No transactions found</p>
            <p className="text-gray-500 text-xs">Try a different search or category</p>
          </div>
        )}
      </div>
    </>
  );
}
