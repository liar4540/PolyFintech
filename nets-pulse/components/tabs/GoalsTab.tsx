"use client";

import { useState, useRef } from "react";
import { Plus, ChevronRight, MoreHorizontal, Zap, X, Calendar } from "lucide-react";
import { GOALS, BADGES } from "@/lib/mockData";

export default function GoalsTab() {
  const [activeTab, setActiveTab] = useState<"goals" | "badges">("goals");
  const [streakCount, setStreakCount] = useState(7);
  const [confetti, setConfetti] = useState(false);
  const [checked, setChecked] = useState(false);
  const [goals, setGoals] = useState(GOALS);
  const [boostedGoal, setBoostedGoal] = useState<string | null>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  // Add Goal Form States
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [newIcon, setNewIcon] = useState("✈️");
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newSaved, setNewSaved] = useState("");
  const [newDue, setNewDue] = useState("Dec 2026");
  const [newColor, setNewColor] = useState("#EA0029");

  // Boost Save States
  const [activeBoostGoalId, setActiveBoostGoalId] = useState<string | null>(null);
  const [boostOpen, setBoostOpen] = useState(false);
  const [boostAmountInput, setBoostAmountInput] = useState("50");
  const [lastBoostedAmount, setLastBoostedAmount] = useState(50);

  const handleCreateGoal = () => {
    const targetVal = parseFloat(newTarget) || 100;
    const savedVal = parseFloat(newSaved) || 0;
    const id = newName.toLowerCase().replace(/\s+/g, "-") || "custom-goal";

    const newGoal = {
      id,
      icon: newIcon,
      name: newName,
      due: newDue,
      saved: Math.min(savedVal, targetVal),
      target: targetVal,
      streak: 1,
      color: newColor,
    };

    setGoals([...goals, newGoal]);
    setAddGoalOpen(false);
    
    // Confetti effect
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2000);

    // Reset fields
    setNewIcon("✈️");
    setNewName("");
    setNewTarget("");
    setNewSaved("");
    setNewDue("Dec 2026");
    setNewColor("#EA0029");
  };

  const totalSaved  = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalPct    = Math.round((totalSaved / totalTarget) * 100);

  const handleBoostSubmit = () => {
    if (!activeBoostGoalId) return;
    const amountVal = parseFloat(boostAmountInput) || 50;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === activeBoostGoalId ? { ...g, saved: Math.min(g.saved + amountVal, g.target) } : g
      )
    );
    setLastBoostedAmount(amountVal);
    setBoostedGoal(activeBoostGoalId);
    setBoostOpen(false);

    // Confetti effect
    setConfetti(true);
    setTimeout(() => setConfetti(false), 1500);
    setTimeout(() => setBoostedGoal(null), 2500);
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
        <button 
          onClick={() => setAddGoalOpen(true)}
          className="w-10 h-10 rounded-2xl flex items-center justify-center active:scale-90 transition-transform" 
          style={{ background: "#EA0029" }}
        >
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
                    onClick={() => {
                      setActiveBoostGoalId(g.id);
                      setBoostAmountInput("50");
                      setBoostOpen(true);
                    }}
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
                      +${lastBoostedAmount} Boosted! 🚀
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

      {/* Add Goal Modal */}
      {addGoalOpen && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col justify-end animate-fade-in" style={{ borderRadius: 40 }}>
          <div
            className="w-full rounded-t-[32px] p-6 animate-slide-up"
            style={{ background: "#07101F", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-black text-xl">Create Saving Goal</h2>
              <button
                onClick={() => setAddGoalOpen(false)}
                className="p-2 rounded-full border border-white/10 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto no-scrollbar pb-4">
              {/* Icon Selector */}
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">🎯 Goal Icon</p>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {["✈️", "💻", "🛍️", "🚗", "🏠", "🎮", "🎓", "👟", "🔋", "🧸"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewIcon(emoji)}
                      className="w-10 h-10 rounded-xl text-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                      style={{
                        background: newIcon === emoji ? "rgba(234,0,41,0.2)" : "rgba(255,255,255,0.04)",
                        border: newIcon === emoji ? "2px solid #EA0029" : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Name */}
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">📝 Goal Name</p>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600 focus:border-[#EA0029]/50"
                  placeholder="e.g. New iPhone 18 Pro"
                />
              </div>

              {/* Target Amount & Saved Amount in Row */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">💰 Target ($)</p>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600 focus:border-[#EA0029]/50"
                    placeholder="e.g. 1500"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">✨ Saved ($)</p>
                  <input
                    type="number"
                    value={newSaved}
                    onChange={(e) => setNewSaved(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600 focus:border-[#EA0029]/50"
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">📅 Target Date</p>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <Calendar size={14} className="text-gray-500" />
                  <input
                    type="text"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
                    placeholder="e.g. Dec 2026"
                  />
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">🎨 Theme Color</p>
                <div className="flex gap-3.5">
                  {colors.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative transition-all active:scale-90"
                      style={{ background: color }}
                    >
                      {newColor === color && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save CTA */}
            <button
              onClick={handleCreateGoal}
              disabled={!newName.trim() || !newTarget}
              className="w-full py-4 mt-3 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #EA0029, #001489)",
                boxShadow: "0 4px 20px rgba(234,0,41,0.3)"
              }}
            >
              <Plus size={16} /> Create Saving Goal
            </button>
          </div>
        </div>
      )}

      {/* Boost Amount Modal */}
      {boostOpen && activeBoostGoalId && (() => {
        const goalObj = goals.find((g) => g.id === activeBoostGoalId);
        if (!goalObj) return null;
        return (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col justify-end animate-fade-in" style={{ borderRadius: 40 }}>
            <div
              className="w-full rounded-t-[32px] p-6 animate-slide-up text-left"
              style={{ background: "#07101F", borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{goalObj.icon}</span>
                  <h2 className="text-white font-black text-lg">Boost {goalObj.name}</h2>
                </div>
                <button
                  onClick={() => setBoostOpen(false)}
                  className="p-2 rounded-full border border-white/10 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              <p className="text-gray-400 text-xs mb-4">
                Current progress: ${goalObj.saved} / ${goalObj.target} (${Math.round((goalObj.saved / goalObj.target) * 100)}%)
              </p>

              {/* Quick Select Buttons */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">⚡ Quick Select</p>
                <div className="flex gap-2">
                  {["10", "50", "100", "250", "500"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBoostAmountInput(amt)}
                      className="flex-grow py-2 rounded-xl text-xs font-bold transition-all active:scale-90"
                      style={{
                        background: boostAmountInput === amt ? goalObj.color : "rgba(255,255,255,0.04)",
                        color: "#fff",
                        border: boostAmountInput === amt ? "none" : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      +${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="mb-5">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">✍️ Enter Custom Amount</p>
                <input
                  type="number"
                  value={boostAmountInput}
                  onChange={(e) => setBoostAmountInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none placeholder-gray-600 focus:border-[#EA0029]/50"
                  placeholder="Enter amount..."
                />
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleBoostSubmit}
                disabled={!boostAmountInput || parseFloat(boostAmountInput) <= 0}
                className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
                style={{
                  background: goalObj.color,
                  boxShadow: `0 4px 20px ${goalObj.color}55`
                }}
              >
                <Zap size={16} /> Boost Savings by ${parseFloat(boostAmountInput) || 0}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
