"use client";

import { X, Check } from "lucide-react";
import { TITLES } from "@/lib/mockData";

interface TitleEquipModalProps {
  equipped: string;
  onEquip: (id: string, label: string) => void;
  onClose: () => void;
}

export default function TitleEquipModal({ equipped, onEquip, onClose }: TitleEquipModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" style={{ borderRadius: 40 }}>
      <div className="w-full animate-slide-up" style={{ borderRadius: "32px 32px 40px 40px", background: "#16161e", border: "1px solid rgba(255,255,255,0.08)", paddingBottom: 32 }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-bold text-xl">Choose Your Title</h3>
            <button onClick={onClose} className="p-2 glass rounded-full border border-white/10">
              <X size={16} className="text-white" />
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-5">Equip a title to flex on your profile. Like Discord, but for your wallet. 🤝</p>

          <div className="flex flex-col gap-3">
            {TITLES.map((t) => {
              const isEquipped = equipped === t.label;
              return (
                <button
                  key={t.id}
                  disabled={!t.unlocked}
                  onClick={() => { onEquip(t.id, t.label); onClose(); }}
                  className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-95 relative overflow-hidden"
                  style={{
                    background: isEquipped
                      ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(16,185,129,0.15))"
                      : t.unlocked
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.02)",
                    border: isEquipped
                      ? "1px solid rgba(124,58,237,0.6)"
                      : t.unlocked
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(255,255,255,0.03)",
                    opacity: t.unlocked ? 1 : 0.45,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: isEquipped
                        ? "rgba(124,58,237,0.25)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-black text-sm tracking-wide"
                      style={{ color: isEquipped ? "#A78BFA" : t.unlocked ? "#fff" : "#555" }}
                    >
                      {t.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: t.unlocked ? "#666" : "#444" }}>
                      {t.unlocked ? (isEquipped ? "Currently equipped" : "Unlocked — tap to equip") : "🔒 Locked"}
                    </p>
                  </div>
                  {isEquipped && (
                    <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
