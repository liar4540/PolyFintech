"use client";

import { useState } from "react";
import { Home, ArrowLeftRight, MapPin, Target, User } from "lucide-react";
import PulseTab from "@/components/tabs/PulseTab";
import MovesTab from "@/components/tabs/MovesTab";
import MapTab from "@/components/tabs/MapTab";
import GoalsTab from "@/components/tabs/GoalsTab";
import ProfileTab from "@/components/tabs/ProfileTab";

type Tab = "pulse" | "moves" | "map" | "goals" | "profile";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "pulse",   label: "Pulse",   icon: Home },
  { id: "moves",   label: "Moves",   icon: ArrowLeftRight },
  { id: "map",     label: "Map",     icon: MapPin },
  { id: "goals",   label: "Goals",   icon: Target },
  { id: "profile", label: "Profile", icon: User },
];

export default function NETSPulseApp() {
  const [activeTab, setActiveTab] = useState<Tab>("pulse");

  return (
    /* Outer page centring */
    <div
      className="flex items-start justify-center min-h-screen w-full py-4"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, #080810 55%)" }}
    >
      {/* Mobile frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: "95dvh",
          maxHeight: 844,
          background: "#0E0E10",
          borderRadius: 40,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,58,237,0.08)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-4 pb-1 flex-shrink-0">
          <span className="text-white text-xs font-bold">9:41</span>
          <div className="flex items-center gap-1">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <rect x="0" y="4" width="3" height="6" rx="0.5" fill="white" fillOpacity="0.4" />
              <rect x="4" y="2.5" width="3" height="7.5" rx="0.5" fill="white" fillOpacity="0.6" />
              <rect x="8" y="1" width="3" height="9" rx="0.5" fill="white" fillOpacity="0.8" />
              <rect x="12" y="0" width="3" height="10" rx="0.5" fill="white" />
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="white" fillOpacity="0.9">
              <path d="M7.5 2.5C9.5 2.5 11.3 3.3 12.5 4.7L14 3.2C12.3 1.2 9.9 0 7.5 0C5.1 0 2.7 1.2 1 3.2L2.5 4.7C3.7 3.3 5.5 2.5 7.5 2.5Z" />
              <path d="M7.5 6C8.8 6 10 6.5 10.8 7.4L12.3 5.9C11 4.7 9.3 4 7.5 4C5.7 4 4 4.7 2.7 5.9L4.2 7.4C5 6.5 6.2 6 7.5 6Z" />
              <circle cx="7.5" cy="10" r="1.5" />
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-6 h-3 rounded-sm border border-white/50 p-0.5 flex items-center">
                <div className="h-full rounded-[1px] bg-white" style={{ width: "80%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 relative">
          {activeTab === "pulse"   && <PulseTab />}
          {activeTab === "moves"   && <MovesTab />}
          {activeTab === "map"     && <MapTab />}
          {activeTab === "goals"   && <GoalsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>

        {/* Bottom nav */}
        <div
          className="flex-shrink-0 flex items-center justify-around pt-2 pb-5 px-4"
          style={{
            background: "rgba(14,14,16,0.95)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex flex-col items-center gap-1 transition-all active:scale-90"
                style={{ minWidth: 56 }}
              >
                {id === "map" ? (
                  /* Map tab — special floating pill */
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center -mt-6 shadow-lg"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, #7C3AED, #10B981)"
                        : "rgba(255,255,255,0.08)",
                      border: "2px solid rgba(14,14,16,0.9)",
                      boxShadow: isActive ? "0 4px 20px rgba(124,58,237,0.5)" : "none",
                    }}
                  >
                    <Icon size={20} style={{ color: "#fff" }} />
                  </div>
                ) : (
                  <Icon
                    size={22}
                    style={{ color: isActive ? "#7C3AED" : "#555" }}
                  />
                )}
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: isActive ? "#7C3AED" : "#444" }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
