"use client";

import { useState, useRef } from "react";
import { Plus, ChevronRight, MoreHorizontal, Zap } from "lucide-react";
import { GOALS, BADGES } from "@/lib/mockData";

const BOOST_AMOUNT = 50;

export default function GoalsTab() {
  const [activeTab, setActiveTab] = useState<"goals" | "badges">("goals");
  const [streakCount, setStreakCount] = useState(7);
  const [confetti, setConfetti] = useState(false);
  const [checked, setChecked] = useState(false);
  const [goals, setGoals] = useState(GOALS);
  const [boostedGoal, setBoostedGoal] = useState<string | null>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  const totalSaved  = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalPct    = Math.round((totalSaved / totalTarget) * 100);

  const handleBoost = (id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, saved: Math.min(g.saved + BOOST_AMOUNT, g.target) } : g
      )
    );
    setBoostedGoal(id);
    setTimeout(() => setBoostedGoal(null), 1500);
  };

  const handleCheckIn = () => {
    if (checked) return;
    setStreakCount((c) => c + 1);
    setChecked(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 900);
  };

  const colors = ["#EA0029", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#F78DA7", "#FF6B6B", "#14B8A6"];

  return (
    <div className="flex flex-col gap-4 pb-6 relative">
      {/* Confetti */}
      {confetti && (
        <div ref={confettiRef} className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-50">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece absolute"
              style={{
                left: `${Math.random() * 80 - 40}px`,
                background: colors[i % colors.length],
                animationDelay: `${Math.random() * 0.3}s`,
                animationDuration: `${0.6 + Math.random() * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-gray-400 text-sm">Your journey</p>
          <h1 className="text-white font-black text-2xl">Goals & Badges</h1>
        </div>
        <button className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#EA0029" }}>
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Total Savings Progress */}
      <div
        className="rounded-3xl p-5"
        style={{
          background: "linear-gradient(135deg, #1a0510 0%, #011835 100%)",
          border: "1px solid rgba(234,0,41,0.2)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#EA0029]/20 flex items-center justify-center text-xl">🎯</div>
          <div>
            <p className="text-white font-bold text-sm">Total Savings Progress</p>
            <p className="text-gray-400 text-xs">Across {GOALS.length} active goals</p>
          </div>
        </div>
        <div className="flex items-baseline gap-3 mb-1">
          <p className="text-gray-400 text-xs">Total saved</p>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <p className="text-white font-black text-3xl">${totalSaved.toLocaleString()}</p>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}>{totalPct}% done</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${totalPct}%`, background: "linear-gradient(90deg, #EA0029, #10B981)" }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">${(totalTarget - totalSaved).toLocaleString()} left to reach all goals</p>
      </div>

      {/* Streak Check-In */}
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
      >
        <div className="text-2xl animate-fire">🔥</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{streakCount}-Day Streak Active</p>
          <p className="text-amber-400 text-xs">{checked ? "Checked in today! Come back tomorrow 🙌" : "Tap to check in today"}</p>
        </div>
        <button
          onClick={handleCheckIn}
          disabled={checked}
          className="px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90"
          style={{
            background: checked ? "rgba(255,255,255,0.08)" : "#F59E0B",
            color: checked ? "#666" : "#000",
          }}
        >
          {checked ? "✓ Done" : "Check In"}
        </button>
      </div>

      {/* Goals / Badges Toggle */}
      <div className="flex rounded-2xl p-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {(["goals", "badges"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="flex-1 py-2 rounded-xl text-sm font-bold transition-all capitalize"
            style={{
              background: activeTab === t ? "#EA0029" : "transparent",
              color: activeTab === t ? "#fff" : "#666",
            }}
          >
            {t === "goals" ? "🎯 Goals" : "🏆 Badges"}
          </button>
        ))}
      </div>

      {/* Goals */}
      {activeTab === "goals" && (
        <div className="flex flex-col gap-3">
          {goals.map((g) => {
            const pct = Math.round((g.saved / g.target) * 100);
            return (
              <div
                key={g.id}
                className="rounded-3xl p-4"
                style={{
                  background: `linear-gradient(135deg, ${g.color}22 0%, rgba(10,10,16,0.9) 100%)`,
                  border: `1px solid ${g.color}33`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{g.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm">{g.name}</p>
                      <span className="text-[10px] font-semibold" style={{ color: g.color }}>⚡ {g.streak}d streak</span>
                    </div>
                    <p className="text-gray-400 text-xs">Due {g.due}</p>
                  </div>
                  <button><MoreHorizontal size={16} className="text-gray-500" /></button>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-white font-black text-2xl">{pct}%</p>
                  <p className="text-gray-400 text-sm">${g.saved.toLocaleString()} / ${g.target.toLocaleString()}</p>
                </div>
                <div className="w-full h-2 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}88)` }}
                  />
                </div>
                <div className="flex gap-2 relative">
                  <button
                    onClick={() => handleBoost(g.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-bold active:scale-95 transition-transform"
                    style={{ background: g.color }}
                  >
                    <Zap size={14} /> Boost Save
                  </button>
                  {boostedGoal === g.id && (
                    <div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black text-white animate-fade-in whitespace-nowrap"
                      style={{ background: "#10B981", boxShadow: "0 4px 12px rgba(16,185,129,0.4)" }}
                    >
                      +${BOOST_AMOUNT} Boosted! 🚀
                    </div>
                  )}
                  <button className="w-10 h-10 flex-shrink-0 rounded-2xl flex items-center justify-center glass border border-white/10">
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Badges */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl p-4 text-center flex flex-col items-center gap-2"
              style={{
                background: b.unlocked ? "rgba(234,0,41,0.1)" : "rgba(255,255,255,0.03)",
                border: b.unlocked ? "1px solid rgba(234,0,41,0.3)" : "1px solid rgba(255,255,255,0.05)",
                opacity: b.unlocked ? 1 : 0.5,
              }}
            >
              <div className="text-3xl" style={{ filter: b.unlocked ? "none" : "grayscale(1)" }}>{b.icon}</div>
              <p className="text-xs font-bold" style={{ color: b.unlocked ? "#fff" : "#555" }}>{b.label}</p>
              {b.unlocked && <div className="w-full h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, #EA0029, #10B981)" }} />}
              {!b.unlocked && <p className="text-[10px] text-gray-600">🔒 Locked</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
