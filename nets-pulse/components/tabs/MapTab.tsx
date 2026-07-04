"use client";

import { useState } from "react";
import { Filter, Bot, Sparkles, X, ChevronUp, ChevronDown, Clock, Star, Gem, Flame } from "lucide-react";
import { MERCHANTS, AI_ITINERARY, SPLIT_GROUP } from "@/lib/mockData";
import SmartReceiptModal from "@/components/modals/SmartReceiptModal";

type FilterType = "hotspots" | "hiddenGem" | "peakHours";

const FILTER_CONFIG: Record<FilterType, { label: string; glow: string }> = {
  hotspots:  { label: "🔥 Hot Spots",   glow: "#EF4444" },
  hiddenGem: { label: "💎 Hidden Gems", glow: "#10B981" },
  peakHours: { label: "⏰ Peak Hours",  glow: "#F59E0B" },
};

export default function MapTab() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("hotspots");
  const [selectedMerchant, setSelectedMerchant] = useState(MERCHANTS[0]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [itineraryOpen, setItineraryOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [splitGroup, setSplitGroup] = useState(SPLIT_GROUP);
  const [settled, setSettled] = useState(false);
  const [streakBump, setStreakBump] = useState(false);

  const handleSettle = () => {
    setSplitGroup((g) => g.map((m) => ({ ...m, owes: 0 })));
    setSettled(true);
    setStreakBump(true);
    setTimeout(() => setStreakBump(false), 2000);
  };

  const glowColor = FILTER_CONFIG[activeFilter].glow;

  return (
    <>
      {showReceipt && <SmartReceiptModal merchantName={selectedMerchant.name} onClose={() => setShowReceipt(false)} />}

      {/* AI Itinerary Side Sheet */}
      {itineraryOpen && (
        <div className="absolute inset-0 z-40 flex animate-slide-in-right" style={{ borderRadius: 40 }}>
          <div className="w-full h-full overflow-y-auto no-scrollbar" style={{ background: "#10101a", borderRadius: 40 }}>
            <div className="px-5 pt-14 pb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-[#7C3AED]" />
                  <h2 className="text-white font-black text-xl">AI Micro-Itinerary</h2>
                </div>
                <button onClick={() => setItineraryOpen(false)} className="p-2 glass rounded-full border border-white/10">
                  <X size={16} className="text-white" />
                </button>
              </div>
              <div className="glass rounded-2xl p-3 border border-[#7C3AED]/30 mb-5">
                <p className="text-[#A78BFA] text-xs font-semibold">📍 Bangkok · Budget: $60 SGD</p>
                <p className="text-gray-300 text-xs mt-1">NETS QR accepted at all stops. No cash needed, steady lah!</p>
              </div>
              <div className="flex flex-col gap-0">
                {AI_ITINERARY.map((step, i) => (
                  <div key={step.step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 z-10"
                        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(16,185,129,0.2))", border: "1px solid rgba(124,58,237,0.4)" }}
                      >
                        {step.icon}
                      </div>
                      {i < AI_ITINERARY.length - 1 && (
                        <div className="w-0.5 flex-1 my-1" style={{ background: "rgba(124,58,237,0.3)" }} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-[#A78BFA] text-xs font-semibold">{step.time}</p>
                      <p className="text-white font-bold text-sm">{step.place}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{step.action}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#10B981] font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        NETS QR Accepted
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ShareSpace Split Sheet */}
      {splitOpen && (
        <div className="absolute inset-0 z-40 animate-slide-up" style={{ borderRadius: 40, background: "#10101a" }}>
          <div className="px-5 pt-14 pb-10 h-full overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-black text-xl">ShareSpace Ledger</h2>
              <button
                onClick={() => { setSplitOpen(false); setSettled(false); setSplitGroup(SPLIT_GROUP); }}
                className="p-2 glass rounded-full border border-white/10"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            <div className="glass rounded-2xl p-4 mb-4 border border-[#10B981]/30">
              <p className="text-[#10B981] text-xs font-bold uppercase tracking-widest mb-1">✅ Payment Confirmed</p>
              <p className="text-white font-bold">Paid 1,200 THB ($45.50 SGD)</p>
              <p className="text-gray-400 text-xs">Jeh O Chula · via NETS QR</p>
            </div>

            {/* QR Canvas */}
            <div className="flex flex-col items-center mb-5">
              <div
                className="w-44 h-44 rounded-3xl flex flex-col items-center justify-center animate-glow-pulse"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "2px solid rgba(124,58,237,0.7)",
                  boxShadow: "0 0 24px rgba(124,58,237,0.4)",
                }}
              >
                <svg viewBox="0 0 100 100" width={100} height={100}>
                  <rect x="10" y="10" width="30" height="30" rx="3" fill="none" stroke="#7C3AED" strokeWidth="3" />
                  <rect x="60" y="10" width="30" height="30" rx="3" fill="none" stroke="#7C3AED" strokeWidth="3" />
                  <rect x="10" y="60" width="30" height="30" rx="3" fill="none" stroke="#7C3AED" strokeWidth="3" />
                  {[65,67,70,72,75,77,80,82,85].map((x) => [65,67,70,72,75].map((y) => (
                    <rect key={`q${x}-${y}`} x={x} y={y} width={2} height={2} fill={(x + y) % 3 === 0 ? "#7C3AED" : "transparent"} />
                  )))}
                  <rect x="40" y="40" width="20" height="20" rx="4" fill="#7C3AED" opacity="0.8" />
                </svg>
                <p className="text-[#A78BFA] text-xs font-semibold mt-1">Scan to split</p>
              </div>
              <p className="text-gray-400 text-xs mt-2 text-center">Friends scan to split instantly.</p>
            </div>

            {!settled && (
              <div className="flex flex-col gap-2 mb-4">
                {splitGroup.map((member) => (
                  <div key={member.id} className="glass flex items-center gap-3 p-3 rounded-2xl border border-white/5">
                    <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center text-xs font-bold text-white">{member.avatar}</div>
                    <p className="flex-1 text-white text-sm font-semibold">{member.name} owes you</p>
                    <p className="text-[#10B981] font-bold text-sm">${member.owes.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            {settled && (
              <div className="glass rounded-2xl p-4 mb-4 border border-[#10B981]/30 text-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-[#10B981] font-bold">All Settled up via Bank Rails!</p>
                {streakBump && <p className="text-[#A78BFA] text-xs mt-1 animate-pulse">🔥 Streak +1!</p>}
              </div>
            )}

            {!settled && (
              <button
                onClick={handleSettle}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #7C3AED, #10B981)" }}
              >
                ⚡ Direct Settlement
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-4">
          <h1 className="text-white font-black text-2xl">Pulse Map</h1>
          <button className="w-9 h-9 glass rounded-full border border-white/10 flex items-center justify-center">
            <Filter size={16} className="text-white" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {(Object.keys(FILTER_CONFIG) as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-90"
              style={{
                background: activeFilter === f ? glowColor : "rgba(255,255,255,0.07)",
                color: "#fff",
                border: activeFilter === f ? "none" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: activeFilter === f ? `0 0 12px ${glowColor}66` : "none",
              }}
            >
              {FILTER_CONFIG[f].label}
            </button>
          ))}
        </div>

        {/* SVG Map */}
        <div
          className="relative rounded-3xl overflow-hidden mb-4 flex-shrink-0"
          style={{ height: 260, background: "linear-gradient(135deg, #0a0f0a 0%, #0d160d 100%)" }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 260">
            {[40,80,120,160,200,240].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="380" y2={y} stroke="rgba(16,185,129,0.07)" strokeWidth="1" />)}
            {[50,100,150,200,250,300,350].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="260" stroke="rgba(16,185,129,0.07)" strokeWidth="1" />)}
            {([[0,100,380,100],[0,200,380,200],[190,0,190,260],[80,0,80,260],[310,0,310,260]] as number[][]).map(([x1,y1,x2,y2],i) => (
              <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            ))}
            {MERCHANTS.map((m) => {
              const score = activeFilter === "hiddenGem" ? m.score.hiddenGem : activeFilter === "peakHours" ? m.score.student : 80;
              const size = 8 + (score / 100) * 8;
              const g = activeFilter === "hotspots" ? m.glow : activeFilter === "hiddenGem" ? "#10B981" : "#F59E0B";
              return (
                <g key={m.id} onClick={() => { setSelectedMerchant(m); setDrawerOpen(true); }} style={{ cursor: "pointer" }}>
                  <circle cx={m.lat} cy={m.lng} r={size + 10} fill={g} opacity={0.08} className="animate-pulse-ring" />
                  <circle cx={m.lat} cy={m.lng} r={size + 5} fill={g} opacity={0.15} className="animate-pulse-ring2" />
                  <circle cx={m.lat} cy={m.lng} r={size} fill={g} opacity={0.9} />
                  <circle cx={m.lat} cy={m.lng} r={size * 0.4} fill="white" opacity={0.9} />
                  <text x={m.lat} y={m.lng + size + 14} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight="600">
                    {m.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
            <circle cx={190} cy={130} r={6} fill="#fff" />
            <circle cx={190} cy={130} r={12} fill="#fff" opacity={0.15} className="animate-pulse" />
            <text x={190} y={148} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7">You</text>
          </svg>
          {activeFilter === "peakHours" && (
            <div className="absolute top-3 right-3 glass rounded-xl px-3 py-2 border border-[#F59E0B]/30 animate-fade-in">
              <p className="text-[#F59E0B] text-[10px] font-bold">⏰ Peak Now</p>
              <p className="text-white text-xs font-semibold">2–4 PM</p>
            </div>
          )}
        </div>

        {/* Merchant Bottom Drawer */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "#16161e", border: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            className="w-full flex items-center justify-between px-5 py-3"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-white font-bold text-sm">{selectedMerchant.name}</span>
            </div>
            {drawerOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
          </button>

          {drawerOpen && (
            <div className="px-5 pb-4 animate-slide-down">
              <div className="flex gap-2 mb-3">
                {[
                  { icon: Star,  val: `${selectedMerchant.successRate}%`, label: "Success" },
                  { icon: Flame, val: "🔥 Hot",                          label: "Trending" },
                  { icon: Clock, val: selectedMerchant.score.peak,       label: "Peak" },
                  { icon: Gem,   val: `${selectedMerchant.score.hiddenGem}`, label: "Gem Score" },
                ].map(({ val, label }) => (
                  <div key={label} className="flex-1 rounded-xl p-2 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-white text-xs font-bold">{val}</p>
                    <p className="text-gray-500 text-[9px]">{label}</p>
                  </div>
                ))}
              </div>
              <div className="glass rounded-2xl p-3 mb-3 border border-white/5">
                <p className="text-[#10B981] text-[10px] font-bold uppercase tracking-widest mb-0.5">Live Pulse</p>
                <p className="text-gray-300 text-xs">{selectedMerchant.pulse}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setItineraryOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-white text-xs font-bold active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
                >
                  <Bot size={13} /> AI Itinerary
                </button>
                <button
                  onClick={() => setShowReceipt(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-white text-xs font-bold active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
                >
                  <Sparkles size={13} /> Smart Receipt
                </button>
                <button
                  onClick={() => setSplitOpen(true)}
                  className="px-3 py-2.5 rounded-2xl text-white text-xs font-bold glass border border-white/10 active:scale-95 transition-transform"
                >
                  Split
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
