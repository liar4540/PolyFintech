"use client";

import { X, MapPin, TrendingUp } from "lucide-react";
import { TIME_CAPSULE } from "@/lib/mockData";

interface TimeCapsuleModalProps {
  onClose: () => void;
}

export default function TimeCapsuleModal({ onClose }: TimeCapsuleModalProps) {
  const tc = TIME_CAPSULE;

  return (
    <div className="absolute inset-0 z-50 bg-[#0a0a10] animate-slide-up overflow-y-auto no-scrollbar" style={{ borderRadius: 40 }}>
      {/* Header */}
      <div
        className="relative px-5 pt-14 pb-8"
        style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0a0a10 100%)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-12 right-5 p-2 glass rounded-full border border-white/10"
        >
          <X size={18} className="text-white" />
        </button>

        <div className="text-4xl mb-3">{tc.emoji}</div>
        <h1 className="text-white font-black text-2xl leading-tight mb-1">{tc.title}</h1>
        <p className="text-[#A78BFA] text-sm">{tc.date}</p>

        {/* Stat chips */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            { icon: "💸", label: `$${tc.totalSpent} ${tc.currency}` },
            { icon: "🏪", label: `${tc.visits} visits to ${tc.topMerchant.split(" ")[0]}` },
            { icon: "🌏", label: `${tc.countries.length} countries` },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-white/10 text-xs text-white">
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini map visual */}
      <div className="mx-5 mb-4">
        <div
          className="w-full rounded-3xl overflow-hidden relative"
          style={{ height: 140, background: "linear-gradient(135deg, #0d1f0d 0%, #112211 100%)" }}
        >
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`h${i}`}
              className="absolute left-0 right-0"
              style={{ top: `${20 + i * 20}%`, height: 1, background: "rgba(16,185,129,0.1)" }}
            />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 bottom-0"
              style={{ left: `${i * 16}%`, width: 1, background: "rgba(16,185,129,0.1)" }}
            />
          ))}
          {/* Pins */}
          {[
            { x: "25%", y: "40%", label: "Chagee" },
            { x: "55%", y: "60%", label: "Jeh O" },
            { x: "70%", y: "30%", label: "MBK" },
            { x: "40%", y: "70%", label: "After You" },
          ].map((pin) => (
            <div key={pin.label} className="absolute flex flex-col items-center" style={{ left: pin.x, top: pin.y }}>
              <div className="w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-violet-500/50">
                <MapPin size={10} className="text-white" />
              </div>
              <span className="text-[8px] text-[#A78BFA] mt-0.5 font-semibold whitespace-nowrap">{pin.label}</span>
            </div>
          ))}
          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points="25,40 55,60 70,30 40,70"
              fill="none"
              stroke="rgba(124,58,237,0.5)"
              strokeWidth="0.5"
              strokeDasharray="2,1"
            />
          </svg>
          <div className="absolute bottom-2 left-3 text-[10px] text-[#10B981] font-semibold flex items-center gap-1">
            <TrendingUp size={10} />
            5 spots · 4 days
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5 pb-10">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Your Journey</p>
        <div className="flex flex-col gap-2">
          {tc.transactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center gap-3 glass rounded-2xl p-3 border border-white/5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "rgba(124,58,237,0.15)" }}>
                {tx.icon}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{tx.name}</p>
                <p className="text-gray-500 text-xs">{tx.date}</p>
              </div>
              <p className="text-[#EF4444] text-sm font-bold">{tx.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Countries */}
        <div className="mt-6">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Countries Unlocked</p>
          <div className="flex gap-3">
            {tc.countries.map((c) => (
              <div key={c} className="glass rounded-2xl px-4 py-3 border border-white/10 text-white text-sm font-semibold">
                {c}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 rounded-2xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #7C3AED, #10B981)" }}
        >
          Close Capsule
        </button>
      </div>
    </div>
  );
}
