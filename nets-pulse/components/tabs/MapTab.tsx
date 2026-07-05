"use client";

import { useState } from "react";
import { Filter, Bot, Sparkles, X, ChevronUp, ChevronDown, Clock, Star, Gem, Flame, Share2, CreditCard, RotateCcw, CheckCircle2, Loader2, MapPin, Wand2 } from "lucide-react";
import { MERCHANTS, SPLIT_GROUP } from "@/lib/mockData";
import SmartReceiptModal from "@/components/modals/SmartReceiptModal";

type FilterType = "hotspots" | "hiddenGem" | "peakHours";

const FILTER_CONFIG: Record<FilterType, { label: string; glow: string }> = {
  hotspots:  { label: "🔥 Hot Spots",   glow: "#EA0029" },
  hiddenGem: { label: "💎 Hidden Gems", glow: "#10B981" },
  peakHours: { label: "⏰ Peak Hours",  glow: "#F59E0B" },
};

// ─── NETS blue ────────────────────────────────────────────────
const NETS_BLUE  = "#001489";
const NETS_RED   = "#EA0029";

export default function MapTab() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("hotspots");
  const [selectedMerchant, setSelectedMerchant] = useState(MERCHANTS[0]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [itineraryOpen, setItineraryOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [splitGroup, setSplitGroup] = useState(SPLIT_GROUP);
  const [allSettled, setAllSettled] = useState(false);
  const [streakBump, setStreakBump] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [checkedMerchants, setCheckedMerchants] = useState<Set<number>>(new Set());

  // ─── AI Itinerary state ──────────────────────────────────────
  type AIMerchant = { id: number; icon: string; name: string; category: string; rating: number; priceBaht: number; netsQr?: boolean };
  type AIResult   = { title: string; subtitle: string; totalBudgetNote: string; merchants: AIMerchant[] };

  const [aiStep, setAiStep]       = useState<"prompt" | "loading" | "result" | "error">("prompt");
  const [aiResult, setAiResult]   = useState<AIResult | null>(null);
  const [aiError, setAiError]     = useState("");
  const [aiLocation, setAiLocation] = useState("Bangkok, Thailand");
  const [aiBudget, setAiBudget]   = useState("SGD 60");
  const [aiPrefs, setAiPrefs]     = useState<string[]>(["food", "drinks", "dessert"]);

  const PREF_OPTIONS = ["food", "drinks", "dessert", "shopping", "culture", "nightlife"];

  const generateItinerary = async () => {
    setAiStep("loading");
    setAiError("");
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: aiLocation,
          budget: aiBudget,
          preferences: aiPrefs.join(", "),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "API error");
      }
      const data: AIResult = await res.json();
      if (!data.merchants?.length) throw new Error("No merchants returned");
      setAiResult(data);
      setAiStep("result");
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : "Something went wrong");
      setAiStep("error");
    }
  };

  const aiMerchants = aiResult?.merchants ?? [];
  const aiTotalBaht = aiMerchants.reduce((s, m) => s + m.priceBaht, 0);
  const aiTotalSGD  = (aiTotalBaht / 28).toFixed(0);

  const handleSettle = () => {
    setSplitGroup((g) => g.map((m) => ({ ...m, settled: true, method: "Bank Transfer" as string | null, settledAt: "Now" as string | null })));
    setAllSettled(true);
    setStreakBump(true);
    setTimeout(() => setStreakBump(false), 2500);
  };

  const handleRecord = (id: number) => {
    setSplitGroup((g) => g.map((m) => m.id === id ? { ...m, settled: true, method: "NETS QR" as string | null, settledAt: new Date().toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" }) as string | null } : m));
  };

  const handleUndo = (id: number) => {
    setSplitGroup((g) => g.map((m) => m.id === id ? { ...m, settled: false, method: null as string | null, settledAt: null as string | null } : m));
  };

  const toggleMerchant = (id: number) => {
    setCheckedMerchants((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };


  const totalOwed = splitGroup.filter((m) => !m.settled).reduce((s, m) => s + m.owes, 0);
  const perPerson = (splitGroup.reduce((s, m) => s + m.owes, 0) + 45.50) / (splitGroup.length + 1);

  const glowColor = FILTER_CONFIG[activeFilter].glow;

  return (
    <>
      {showReceipt && <SmartReceiptModal merchantName={selectedMerchant.name} onClose={() => setShowReceipt(false)} />}

      {/* ── AI Micro-Itinerary Sheet ─────────────────────────── */}
      {itineraryOpen && (
        <div className="absolute inset-0 z-40 flex animate-slide-in-right" style={{ borderRadius: 40 }}>
          <div className="w-full h-full overflow-y-auto no-scrollbar" style={{ background: "#07101F", borderRadius: 40 }}>
            <div className="px-5 pt-14 pb-10">

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-black tracking-widest uppercase mb-0.5" style={{ color: NETS_RED }}>
                    ⚡ AI MICRO-ITINERARY
                  </p>
                  <h2 className="text-white font-black text-xl leading-tight">
                    {aiStep === "result" ? aiResult?.title : "Plan My Day"}
                  </h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {aiStep === "result" ? aiResult?.subtitle : "Powered by DeepSeek AI · NETS QR only"}
                  </p>
                </div>
                <button
                  onClick={() => { setItineraryOpen(false); setAiStep("prompt"); setAiResult(null); }}
                  className="p-2 rounded-full border border-white/10 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* ── PROMPT FORM ──────────────────────────────────── */}
              {aiStep === "prompt" && (
                <div className="flex flex-col gap-4">
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: "rgba(0,20,137,0.12)", border: "1px solid rgba(0,20,137,0.35)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Bot size={14} style={{ color: NETS_BLUE }} />
                      <p className="text-blue-300 text-xs font-semibold">Tell DeepSeek where you want to go</p>
                    </div>

                    {/* Location */}
                    <div className="mb-3">
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">📍 Location</p>
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={aiLocation}
                          onChange={(e) => setAiLocation(e.target.value)}
                          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
                          placeholder="e.g. Bangkok, Thailand"
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="mb-3">
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">💰 Budget</p>
                      <div className="flex gap-2">
                        {["SGD 30", "SGD 60", "SGD 100", "SGD 150"].map((b) => (
                          <button
                            key={b}
                            onClick={() => setAiBudget(b)}
                            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-90"
                            style={{
                              background: aiBudget === b ? NETS_BLUE : "rgba(255,255,255,0.06)",
                              color: aiBudget === b ? "#fff" : "#777",
                              border: aiBudget === b ? "none" : "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1.5">✨ Vibe</p>
                      <div className="flex flex-wrap gap-2">
                        {PREF_OPTIONS.map((p) => {
                          const on = aiPrefs.includes(p);
                          return (
                            <button
                              key={p}
                              onClick={() => setAiPrefs((prev) => on ? prev.filter((x) => x !== p) : [...prev, p])}
                              className="px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all active:scale-90"
                              style={{
                                background: on ? NETS_RED : "rgba(255,255,255,0.06)",
                                color: on ? "#fff" : "#777",
                                border: on ? "none" : "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={generateItinerary}
                    disabled={!aiLocation.trim()}
                    className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40"
                    style={{ background: `linear-gradient(135deg, ${NETS_BLUE}, #0022CC)`, boxShadow: "0 4px 20px rgba(0,20,137,0.4)" }}
                  >
                    <Wand2 size={16} /> Generate with DeepSeek AI
                  </button>

                  <p className="text-center text-gray-600 text-[10px]">AI-generated · Merchants may vary · Always verify NETS QR acceptance</p>
                </div>
              )}

              {/* ── LOADING ──────────────────────────────────────── */}
              {aiStep === "loading" && (
                <div className="flex flex-col items-center justify-center gap-5 py-16">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${NETS_BLUE}, ${NETS_RED})` }}>
                      <Bot size={28} className="text-white" />
                    </div>
                    <Loader2 size={14} className="absolute -top-1 -right-1 text-white animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-black text-base">DeepSeek is thinking...</p>
                    <p className="text-gray-400 text-xs mt-1">Finding the best NETS QR spots in {aiLocation}</p>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: i === 0 ? NETS_RED : i === 1 ? NETS_BLUE : "#10B981", animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── ERROR ────────────────────────────────────────── */}
              {aiStep === "error" && (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="text-4xl">⚠️</div>
                  <div>
                    <p className="text-white font-bold">Couldn&apos;t generate itinerary</p>
                    <p className="text-gray-400 text-xs mt-1 max-w-xs">{aiError}</p>
                    <p className="text-gray-600 text-xs mt-2">Make sure DEEPSEEK_API_KEY is set in .env.local</p>
                  </div>
                  <button
                    onClick={() => setAiStep("prompt")}
                    className="px-5 py-2.5 rounded-2xl text-white text-sm font-bold"
                    style={{ background: NETS_BLUE }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* ── RESULT ───────────────────────────────────────── */}
              {aiStep === "result" && aiResult && (
                <>
                  {/* Budget bar */}
                  <div
                    className="rounded-2xl px-4 py-3 mb-4 flex items-center justify-between"
                    style={{ background: "rgba(0,20,137,0.25)", border: "1px solid rgba(0,20,137,0.5)" }}
                  >
                    <p className="text-white text-xs font-semibold">Total budget</p>
                    <p className="text-white font-black text-sm">
                      {aiResult.totalBudgetNote || `฿${aiTotalBaht} ≈ SGD ${aiTotalSGD}`}
                    </p>
                  </div>

                  {/* Merchant Checklist */}
                  <div className="flex flex-col gap-2">
                    {aiMerchants.map((m) => {
                      const isChecked = checkedMerchants.has(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleMerchant(m.id)}
                          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all active:scale-95"
                          style={{
                            background: isChecked ? "rgba(0,20,137,0.2)" : "rgba(255,255,255,0.04)",
                            border: isChecked ? `1px solid ${NETS_BLUE}` : "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {/* Checkbox */}
                          <div
                            className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all"
                            style={{
                              background: isChecked ? NETS_BLUE : "transparent",
                              borderColor: isChecked ? NETS_BLUE : "rgba(255,255,255,0.25)",
                            }}
                          >
                            {isChecked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>

                          {/* Icon */}
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
                            {m.icon}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm truncate">{m.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-gray-400 text-xs">{m.category}</span>
                              <span className="text-gray-600">·</span>
                              <span className="text-yellow-400 text-xs">★ {m.rating}</span>
                            </div>
                          </div>

                          {/* Price + NETS badge */}
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <p className="font-black text-sm" style={{ color: NETS_RED }}>฿{m.priceBaht}</p>
                            <div className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wide" style={{ background: "rgba(0,20,137,0.3)", color: "#60A5FA", border: "1px solid rgba(0,20,137,0.5)" }}>
                              ✦ NETS QR
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => { setAiStep("prompt"); setAiResult(null); setCheckedMerchants(new Set()); }}
                      className="flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-bold glass border border-white/10 text-white"
                    >
                      Regenerate
                    </button>
                    <button
                      className="flex-1 py-3 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 4px 20px rgba(16,185,129,0.35)" }}
                    >
                      Start This Itinerary →
                    </button>
                  </div>

                  <p className="text-center text-gray-600 text-[10px] mt-3">Generated by DeepSeek AI · Not financial advice</p>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── Group Split Sheet ────────────────────────────────── */}
      {splitOpen && (
        <div className="absolute inset-0 z-40 animate-slide-up overflow-y-auto no-scrollbar" style={{ borderRadius: 40, background: "#07101F" }}>
          <div className="px-5 pt-14 pb-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-black text-xl">Split Bill</h2>
              <button
                onClick={() => { setSplitOpen(false); setSplitGroup(SPLIT_GROUP); setAllSettled(false); setLedgerOpen(false); }}
                className="p-2 rounded-full border border-white/10"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Payment Confirmed Card */}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <p className="text-[#10B981] text-xs font-black uppercase tracking-widest mb-1">✅ Successfully paid</p>
              <p className="text-white font-bold text-sm">฿1,200 THB (<span className="text-[#10B981]">$45.50 SGD</span>)</p>
              <p className="text-gray-400 text-xs mt-0.5">to <span className="text-white font-semibold">Jeh O Chula</span> via NETS QR</p>
              <div className="flex gap-2 mt-3">
                {["NETS QR", "Verified", "Instant"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.3)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Group Split QR Code */}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: NETS_BLUE }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><rect x="1" y="1" width="3" height="3"/><rect x="6" y="1" width="3" height="3"/><rect x="1" y="6" width="3" height="3"/><rect x="5" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="6" y="6" width="1" height="2"/><rect x="8" y="6" width="1" height="1"/></svg>
                  </div>
                  <p className="text-white font-black text-sm">Group Split QR Code</p>
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold"
                  style={{ background: NETS_BLUE }}
                >
                  <Share2 size={11} /> Share
                </button>
              </div>

              <div className="flex gap-4">
                {/* QR Code */}
                <div
                  className="rounded-2xl p-2 flex-shrink-0"
                  style={{ background: "#fff", width: 80, height: 80 }}
                >
                  <svg viewBox="0 0 80 80" width={64} height={64}>
                    {/* Corner squares */}
                    <rect x="4" y="4"  width="22" height="22" rx="3" fill="none" stroke="#001489" strokeWidth="3"/>
                    <rect x="8" y="8"  width="14" height="14" rx="1" fill="#001489"/>
                    <rect x="54" y="4" width="22" height="22" rx="3" fill="none" stroke="#001489" strokeWidth="3"/>
                    <rect x="58" y="8" width="14" height="14" rx="1" fill="#001489"/>
                    <rect x="4" y="54" width="22" height="22" rx="3" fill="none" stroke="#001489" strokeWidth="3"/>
                    <rect x="8" y="58" width="14" height="14" rx="1" fill="#001489"/>
                    {/* Data dots */}
                    {[30,33,36,39,42,45,48,51,54].map((x) => [30,33,36,39,42].map((y) => (
                      <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill={(x+y)%5===0 ? "#001489" : (x+y)%3===0 ? "#EA0029" : "transparent"} />
                    )))}
                    {/* Center logo */}
                    <rect x="33" y="33" width="14" height="14" rx="2" fill="#001489"/>
                    <text x="40" y="43" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">N</text>
                  </svg>
                </div>

                {/* Split Info */}
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-3">Friends scan to split instantly — no app needed</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">Per person</p>
                      <p className="text-white font-black text-sm">${perPerson.toFixed(2)}</p>
                    </div>
                    <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">Still owed</p>
                      <p className="font-black text-sm" style={{ color: NETS_RED }}>${totalOwed.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloned Smart Ledger */}
            <div
              className="rounded-2xl mb-4 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3"
                onClick={() => setLedgerOpen((o) => !o)}
              >
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-white" />
                  <span className="text-white font-bold text-sm">Cloned Smart Ledger</span>
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest"
                    style={{ background: "rgba(234,0,41,0.15)", color: NETS_RED, border: `1px solid ${NETS_RED}44` }}
                  >
                    DIGITIZED
                  </span>
                </div>
                <ChevronDown size={14} className="text-gray-400" style={{ transform: ledgerOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {!ledgerOpen && (
                <div className="flex items-center justify-between px-4 pb-3">
                  <p className="text-gray-500 text-xs">฿1,568 · 5 items</p>
                  <p className="text-xs font-semibold" style={{ color: NETS_RED }}>Tap to expand</p>
                </div>
              )}
              {ledgerOpen && (
                <div className="px-4 pb-3 flex flex-col gap-1.5 animate-slide-down">
                  {["Jeh O Chula dinner", "MBK Center shopping", "Chagee x4", "After You café", "MRT transport"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <p className="text-gray-300 text-xs">{item}</p>
                      <p className="text-white text-xs font-bold">฿{[450, 680, 140, 220, 78][i]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Split Balances */}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-black text-sm">Split Balances</p>
                {totalOwed > 0 && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(234,0,41,0.15)", color: NETS_RED, border: `1px solid ${NETS_RED}33` }}
                  >
                    ${totalOwed.toFixed(2)} pending
                  </span>
                )}
                {totalOwed === 0 && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}
                  >
                    ✓ All settled
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {splitGroup.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: member.color }}
                      >
                        {member.avatar}
                      </div>
                      {member.settled && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#10B981" }}>
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </div>
                      )}
                    </div>

                    {/* Name + info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold leading-tight">{member.name}</p>
                      {!member.settled && (
                        <p className="text-gray-400 text-xs">Owes you ${member.owes.toFixed(2)}</p>
                      )}
                      {member.settled && (
                        <div>
                          <p className="text-[#10B981] text-xs font-semibold">
                            Settled ${member.owes.toFixed(2)} · {member.method} · {member.settledAt}
                          </p>
                          {member.note && (
                            <p className="text-gray-500 text-[10px] italic">"{member.note}"</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    {!member.settled ? (
                      <button
                        onClick={() => handleRecord(member.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-bold active:scale-90 transition-transform flex-shrink-0"
                        style={{ background: NETS_BLUE }}
                      >
                        <CreditCard size={10} /> Record
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUndo(member.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-90 transition-transform flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)", color: "#888", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <RotateCcw size={9} /> Undo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Settle via Bank Transfer CTA */}
            {!allSettled ? (
              <button
                onClick={handleSettle}
                className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${NETS_BLUE}, #0022CC)`,
                  boxShadow: "0 4px 20px rgba(0,20,137,0.45)",
                }}
              >
                <CreditCard size={16} /> Settle via Bank-Tier Direct Transfer →
              </button>
            ) : (
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                <CheckCircle2 size={28} className="text-[#10B981] mx-auto mb-1" />
                <p className="text-[#10B981] font-black">All Settled via Bank Rails!</p>
                {streakBump && <p className="text-[#F78DA7] text-xs mt-1 animate-pulse">🔥 Streak +1!</p>}
              </div>
            )}

            <p className="text-center text-gray-600 text-[10px] mt-3">Encrypted · Instant settlement · Zero fees</p>
          </div>
        </div>
      )}

      {/* ── Main Map View ─────────────────────────────────────── */}
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
          style={{ height: 240, background: "linear-gradient(135deg, #070E18 0%, #0B1525 100%)" }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 240">
            {[40,80,120,160,200].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="380" y2={y} stroke="rgba(0,20,137,0.12)" strokeWidth="1" />)}
            {[50,100,150,200,250,300,350].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="240" stroke="rgba(0,20,137,0.12)" strokeWidth="1" />)}
            {([[0,80,380,80],[0,170,380,170],[190,0,190,240],[80,0,80,240],[310,0,310,240]] as number[][]).map(([x1,y1,x2,y2],i) => (
              <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
            ))}
            {MERCHANTS.map((m) => {
              const score = activeFilter === "hiddenGem" ? m.score.hiddenGem : activeFilter === "peakHours" ? m.score.student : 80;
              const size = 8 + (score / 100) * 8;
              const g = activeFilter === "hotspots" ? m.glow : activeFilter === "hiddenGem" ? "#10B981" : "#F59E0B";
              return (
                <g key={m.id} onClick={() => { setSelectedMerchant(m); setDrawerOpen(true); }} style={{ cursor: "pointer" }}>
                  <circle cx={m.lat} cy={m.lng} r={size + 10} fill={g} opacity={0.08} className="animate-pulse-ring" />
                  <circle cx={m.lat} cy={m.lng} r={size + 5}  fill={g} opacity={0.15} className="animate-pulse-ring2" />
                  <circle cx={m.lat} cy={m.lng} r={size}      fill={g} opacity={0.9} />
                  <circle cx={m.lat} cy={m.lng} r={size * 0.4} fill="white" opacity={0.9} />
                  <text x={m.lat} y={m.lng + size + 14} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight="600">
                    {m.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
            <circle cx={190} cy={120} r={6} fill="#fff" />
            <circle cx={190} cy={120} r={12} fill="#fff" opacity={0.15} className="animate-pulse" />
            <text x={190} y={138} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7">You</text>
          </svg>
          {activeFilter === "peakHours" && (
            <div className="absolute top-3 right-3 glass rounded-xl px-3 py-2 border border-[#F59E0B]/30 animate-fade-in">
              <p className="text-[#F59E0B] text-[10px] font-bold">⏰ Peak Now</p>
              <p className="text-white text-xs font-semibold">2–4 PM</p>
            </div>
          )}
        </div>

        {/* Merchant Bottom Drawer */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "#101827", border: "1px solid rgba(255,255,255,0.07)" }}>
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
                  style={{ background: `linear-gradient(135deg, ${NETS_BLUE}, #0022CC)` }}
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
                  className="px-3 py-2.5 rounded-2xl text-white text-xs font-bold active:scale-95 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${NETS_RED}, #B8001F)` }}
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
