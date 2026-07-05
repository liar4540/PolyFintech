"use client";

import { useState } from "react";
import { Sparkles, ChevronRight, Lock } from "lucide-react";
import { USER, VOUCHERS } from "@/lib/mockData";
import TitleEquipModal from "@/components/modals/TitleEquipModal";
import WrappedModal from "@/components/modals/WrappedModal";
import VoucherClaimModal from "@/components/modals/VoucherClaimModal";

export default function ProfileTab() {
  const [equippedTitle, setEquippedTitle] = useState(USER.equippedTitle);
  const [streak, setStreak] = useState(USER.streakDays);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showWrapped, setShowWrapped] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [activeVoucher, setActiveVoucher] = useState<{ merchant: string; discount: string } | null>(null);

  const handleCheckIn = () => {
    if (checkedIn) return;
    setStreak((s) => s + 1);
    setCheckedIn(true);
  };

  return (
    <>
      {showTitleModal && (
        <TitleEquipModal
          equipped={equippedTitle}
          onEquip={(_, label) => setEquippedTitle(label)}
          onClose={() => setShowTitleModal(false)}
        />
      )}
      {showWrapped && <WrappedModal onClose={() => setShowWrapped(false)} />}
      {activeVoucher && (
        <VoucherClaimModal
          merchant={activeVoucher.merchant}
          discount={activeVoucher.discount}
          onClose={() => setActiveVoucher(null)}
        />
      )}

      <div className="flex flex-col gap-4 pb-6">
        {/* Profile Card */}
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a0510 0%, #011835 100%)",
            border: "1px solid rgba(228,0,43,0.3)",
            boxShadow: "0 0 40px rgba(228,0,43,0.12)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(228,0,43,0.20) 0%, transparent 70%)" }} />
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0 animate-glow-pulse"
              style={{
                background: "linear-gradient(135deg, #E4002B, #B8001F)",
                border: "2px solid rgba(247,141,167,0.5)",
              }}
            >
              {USER.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-xl">{USER.name}</p>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-1.5"
                style={{
                  background: "linear-gradient(135deg, rgba(228,0,43,0.25), rgba(16,185,129,0.15))",
                  border: "1px solid rgba(247,141,167,0.4)",
                  boxShadow: "0 0 10px rgba(228,0,43,0.25)",
                }}
              >
                <span className="text-[10px]">⚡</span>
                <span className="text-[#F78DA7] font-black text-xs tracking-wider">{equippedTitle}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowTitleModal(true)}
            className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-[#F78DA7] border border-[#E4002B]/30 active:scale-95 transition-transform flex items-center justify-center gap-1"
            style={{ background: "rgba(228,0,43,0.1)" }}
          >
            Change Title <ChevronRight size={12} />
          </button>
        </div>

        {/* Streak Widget */}
        <div
          className="rounded-2xl px-4 py-4 flex items-center gap-3"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          <div className="text-3xl animate-fire">🔥</div>
          <div className="flex-1">
            <p className="text-white font-bold">{streak}-Day Streak Active</p>
            <p className="text-amber-400 text-xs">{checkedIn ? "Checked in! Back tomorrow 💪" : "Check in to keep your streak going!"}</p>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className="px-4 py-2 rounded-xl text-sm font-bold active:scale-90 transition-transform"
            style={{ background: checkedIn ? "rgba(255,255,255,0.08)" : "#F59E0B", color: checkedIn ? "#666" : "#000" }}
          >
            {checkedIn ? "✓" : "+1"}
          </button>
        </div>

        {/* Payment Replay Wrapped CTA */}
        <button
          onClick={() => setShowWrapped(true)}
          className="w-full py-5 rounded-3xl relative overflow-hidden active:scale-95 transition-transform gradient-border"
          style={{ background: "linear-gradient(135deg, #1a0510 0%, #011835 100%)" }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(228,0,43,0.12), rgba(16,185,129,0.08))" }} />
          <div className="relative flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(228,0,43,0.15)" }}>
                🎵
              </div>
              <div className="text-left">
                <p className="text-[#F78DA7] text-xs font-semibold uppercase tracking-widest">2026 Recap</p>
                <p className="text-white font-black text-sm">Review Your Payment Replay</p>
                <p className="text-gray-400 text-xs">Wrapped-style · Tap to relive</p>
              </div>
            </div>
            <Sparkles size={20} className="text-[#E4002B]" />
          </div>
        </button>

        {/* Vouchers Grid */}
        <div>
          <p className="text-white font-bold text-sm mb-3">Your Rewards</p>
          <div className="grid grid-cols-2 gap-3">
            {VOUCHERS.map((v) => (
              <button
                key={v.id}
                onClick={() => v.unlocked && setActiveVoucher({ merchant: v.merchant, discount: v.discount })}
                className="rounded-2xl p-3 relative overflow-hidden text-left transition-all active:scale-95"
                style={{
                  background: v.unlocked ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                  border: v.unlocked ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  opacity: v.unlocked ? 1 : 0.6,
                  cursor: v.unlocked ? "pointer" : "default",
                }}
              >
                <p className="text-white font-bold text-xs mb-0.5">{v.merchant}</p>
                <p className="font-black text-sm" style={{ color: v.unlocked ? "#10B981" : "#555" }}>{v.discount}</p>
                {v.unlocked ? (
                  <div className="mt-2 text-[10px] font-bold text-[#10B981]">✅ Tap to claim</div>
                ) : (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500">
                    <Lock size={9} />
                    Unlocks Day {v.daysNeeded}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🌏", label: "Countries",    val: "4"     },
            { icon: "⚡", label: "Transactions", val: "187"   },
            { icon: "💰", label: "Saved",        val: "$1,280" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-3 text-center border border-white/5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-white font-black text-lg leading-none">{s.val}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
