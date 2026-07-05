"use client";

import { useState } from "react";
import { Filter, Bot, Sparkles, X, ChevronUp, ChevronDown, Clock, Star, Gem, Flame, Share2, CreditCard, RotateCcw, CheckCircle2, Loader2, MapPin, Wand2, Download } from "lucide-react";
import { MERCHANTS, SPLIT_GROUP } from "@/lib/mockData";
import SmartReceiptModal from "@/components/modals/SmartReceiptModal";

type FilterType = "hotspots" | "hiddenGem" | "peakHours";

const FILTER_CONFIG: Record<FilterType, { label: string; glow: string }> = {
  hotspots:  { label: "🔥 Hot Spots",   glow: "#E4002B" },
  hiddenGem: { label: "💎 Hidden Gems", glow: "#10B981" },
  peakHours: { label: "⏰ Peak Hours",  glow: "#F59E0B" },
};

// ─── NETS blue ────────────────────────────────────────────────
const NETS_BLUE  = "#003DA5";
const NETS_RED   = "#E4002B";

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
  type AIMerchant = { id: number; icon: string; name: string; category: string; rating: number; priceBaht?: number; priceLocal?: number; netsQr?: boolean };
  type AIResult   = { 
    title: string; 
    subtitle: string; 
    totalBudgetNote: string; 
    currencySymbol?: string; 
    currencyCode?: string; 
    rateToSGD?: number; 
    merchants: AIMerchant[] 
  };

  const [aiStep, setAiStep]       = useState<"prompt" | "loading" | "result" | "error" | "active" | "completed">("prompt");
  const [aiResult, setAiResult]   = useState<AIResult | null>(null);
  const [aiError, setAiError]     = useState("");
  const [aiLocation, setAiLocation] = useState("Bangkok, Thailand");
  const [aiBudget, setAiBudget]   = useState("SGD 60");
  const [aiPrefs, setAiPrefs]     = useState<string[]>(["food", "drinks", "dessert"]);

  // Active Journey States
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [completedStops, setCompletedStops] = useState<Set<number>>(new Set());
  const [totalSpentBaht, setTotalSpentBaht] = useState(0);
  const [isPaying, setIsPaying] = useState(false);
  const [payingStopId, setPayingStopId] = useState<number | null>(null);
  const [splitBillAmountBaht, setSplitBillAmountBaht] = useState(1200);

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

  const currencySymbol = aiResult?.currencySymbol || "฿";
  const currencyCode = aiResult?.currencyCode || "THB";
  const exchangeRate = aiResult?.rateToSGD || 28;

  const aiMerchants = aiResult?.merchants ?? [];
  const aiTotalBaht = aiMerchants.reduce((s, m) => s + (m.priceLocal !== undefined ? m.priceLocal : (m.priceBaht || 0)), 0);
  const aiTotalSGD  = (aiTotalBaht / exchangeRate).toFixed(0);

  const activeStops = aiMerchants.filter((m) => checkedMerchants.size === 0 || checkedMerchants.has(m.id));
  const activeStopsTotalBaht = activeStops.reduce((s, m) => s + (m.priceLocal !== undefined ? m.priceLocal : (m.priceBaht || 0)), 0);

  const handleStartItinerary = () => {
    setActiveStopIndex(0);
    setCompletedStops(new Set());
    setTotalSpentBaht(0);
    setAiStep("active");
  };

  const handlePayStop = (stopId: number, priceBaht: number, name: string) => {
    setIsPaying(true);
    setPayingStopId(stopId);
    
    setTimeout(() => {
      setIsPaying(false);
      setPayingStopId(null);
      
      setCompletedStops((prev) => {
        const next = new Set(prev);
        next.add(stopId);
        return next;
      });
      
      setTotalSpentBaht((prev) => prev + priceBaht);
      
      setSelectedMerchant({
        id: "mock-stop",
        name: name,
        category: "Itinerary Stop",
        lat: 190, lng: 120,
        glow: "#10B981",
        pulse: `Successfully paid ${currencySymbol}${priceBaht} via NETS QR.`,
        successRate: 100,
        score: { student: 90, hiddenGem: 90, peak: "Now" }
      });
      setShowReceipt(true);
      
      if (activeStopIndex < activeStops.length - 1) {
        setActiveStopIndex((prev) => prev + 1);
      } else {
        setAiStep("completed");
      }
    }, 1500);
  };

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


  const splitBillAmountSGD = splitBillAmountBaht / exchangeRate;
  const totalOwed = splitGroup.filter((m) => !m.settled).reduce((s, m) => s + m.owes, 0);
  const perPerson = (splitGroup.reduce((s, m) => s + m.owes, 0) + splitBillAmountSGD) / (splitGroup.length + 1);

  const glowColor = FILTER_CONFIG[activeFilter].glow;

  return (
    <>
      {showReceipt && (
        <SmartReceiptModal 
          merchantName={selectedMerchant.name} 
          location={itineraryOpen ? aiLocation : "Bangkok, Thailand"} 
          onClose={() => setShowReceipt(false)} 
        />
      )}

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
                    {aiStep === "result" ? aiResult?.subtitle : "Powered by GENZ AI · NETS QR only"}
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
                    style={{ background: "rgba(0,61,165,0.12)", border: "1px solid rgba(0,61,165,0.35)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Bot size={14} style={{ color: NETS_BLUE }} />
                      <p className="text-blue-300 text-xs font-semibold">Tell GENZ where you want to go</p>
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
                    style={{ background: `linear-gradient(135deg, ${NETS_BLUE}, #0022CC)`, boxShadow: "0 4px 20px rgba(0,61,165,0.4)" }}
                  >
                    <Wand2 size={16} /> Generate with GENZ AI
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
                    <p className="text-white font-black text-base">GENZ is thinking...</p>
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
                    style={{ background: "rgba(0,61,165,0.25)", border: "1px solid rgba(0,61,165,0.5)" }}
                  >
                    <p className="text-white text-xs font-semibold">Total budget</p>
                    <p className="text-white font-black text-sm">
                      {aiResult.totalBudgetNote || `${currencySymbol}${aiTotalBaht.toLocaleString()} ≈ SGD ${aiTotalSGD}`}
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
                            background: isChecked ? "rgba(0,61,165,0.2)" : "rgba(255,255,255,0.04)",
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
                            <p className="font-black text-sm" style={{ color: NETS_RED }}>
                              {currencySymbol}{(m.priceLocal !== undefined ? m.priceLocal : (m.priceBaht || 0)).toLocaleString()}
                            </p>
                            <div className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wide" style={{ background: "rgba(0,61,165,0.3)", color: "#60A5FA", border: "1px solid rgba(0,61,165,0.5)" }}>
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
                      onClick={handleStartItinerary}
                      className="flex-1 py-3 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 4px 20px rgba(16,185,129,0.35)" }}
                    >
                      Start This Itinerary →
                    </button>
                  </div>

                  <p className="text-center text-gray-600 text-[10px] mt-3">Generated by GENZ AI · Not financial advice</p>
                </>
              )}

              {/* ── ACTIVE JOURNEY ────────────────────────────────── */}
              {aiStep === "active" && aiResult && (
                <>
                  {/* Progress Stats bar */}
                  <div
                    className="rounded-2xl px-4 py-3 mb-4"
                    style={{ background: "rgba(0,61,165,0.25)", border: "1px solid rgba(0,61,165,0.5)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white text-xs font-semibold">
                        Progress: Stop {activeStopIndex + 1} of {activeStops.length}
                      </p>
                      <p className="text-white font-black text-xs">
                        {currencySymbol}{totalSpentBaht.toLocaleString()} / {currencySymbol}{activeStopsTotalBaht.toLocaleString()} Spent
                      </p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(completedStops.size / activeStops.length) * 100}%`,
                          background: `linear-gradient(90deg, ${NETS_BLUE}, #10B981)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Stops Timeline */}
                  <div className="flex flex-col gap-4 relative pl-4 border-l border-dashed border-white/20 ml-2.5 my-6">
                    {activeStops.map((m, index) => {
                      const isCompleted = completedStops.has(m.id);
                      const isActive = index === activeStopIndex;
                      const isFuture = index > activeStopIndex;
                      const isCurrentPaying = isPaying && payingStopId === m.id;

                      return (
                        <div key={m.id} className="relative flex flex-col gap-2">
                          {/* Dot / Indicator */}
                          <div
                            className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border"
                            style={{
                              background: isCompleted ? "#10B981" : isActive ? NETS_RED : "#1f2937",
                              borderColor: isCompleted ? "#10B981" : isActive ? NETS_RED : "rgba(255,255,255,0.2)",
                              boxShadow: isActive ? `0 0 10px ${NETS_RED}` : "none",
                            }}
                          >
                            {isCompleted && (
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            )}
                          </div>

                          {/* Stop Info Card */}
                          <div
                            className="rounded-2xl px-4 py-3 transition-all"
                            style={{
                              background: isActive
                                ? "rgba(0,61,165,0.15)"
                                : isCompleted
                                ? "rgba(16,185,129,0.05)"
                                : "rgba(255,255,255,0.02)",
                              border: isActive
                                ? `1px solid ${NETS_BLUE}`
                                : isCompleted
                                ? "1px solid rgba(16,185,129,0.2)"
                                : "1px solid rgba(255,255,255,0.05)",
                              opacity: isFuture ? 0.5 : 1,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{m.icon}</span>
                                <div>
                                  <p className={`font-bold text-sm ${isActive ? "text-white" : "text-gray-300"}`}>
                                    {m.name}
                                  </p>
                                  <p className="text-gray-500 text-xs">{m.category}</p>
                                </div>
                              </div>
                              <p className="font-black text-sm text-gray-300">
                                {currencySymbol}{(m.priceLocal !== undefined ? m.priceLocal : (m.priceBaht || 0)).toLocaleString()}
                              </p>
                            </div>

                            {/* CTAs for Active Stop */}
                            {isActive && (
                              <div className="mt-3">
                                <button
                                  onClick={() => handlePayStop(m.id, m.priceLocal !== undefined ? m.priceLocal : (m.priceBaht || 0), m.name)}
                                  disabled={isPaying}
                                  className="w-full py-2.5 rounded-xl text-white text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all"
                                  style={{
                                    background: `linear-gradient(135deg, ${NETS_BLUE}, #0022CC)`,
                                    boxShadow: "0 4px 15px rgba(0,61,165,0.4)"
                                  }}
                                >
                                  {isCurrentPaying ? (
                                    <>
                                      <Loader2 size={13} className="animate-spin" />
                                      Scanning NETS QR...
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard size={13} />
                                      Pay {currencySymbol}{(m.priceLocal !== undefined ? m.priceLocal : (m.priceBaht || 0)).toLocaleString()} with NETS QR
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {isCompleted && (
                              <p className="text-[#10B981] text-[10px] font-bold mt-1 flex items-center gap-1">
                                ✓ Paid via NETS QR
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { setAiStep("result"); }}
                      className="w-full py-3 rounded-2xl text-xs font-bold glass border border-white/10 text-white active:scale-95 transition-transform"
                    >
                      Cancel Journey
                    </button>
                  </div>
                </>
              )}

              {/* ── JOURNEY COMPLETED ──────────────────────────────── */}
              {aiStep === "completed" && aiResult && (
                <div className="flex flex-col items-center text-center py-6 animate-fade-in">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-white font-black text-2xl mb-1">Journey Completed!</h2>
                  <p className="text-[#10B981] text-xs font-black uppercase tracking-widest mb-4">
                    ⚡ 100% NETS QR SUCCESS RATE
                  </p>

                  <p className="text-gray-300 text-sm max-w-xs mb-6">
                    Awesome job! You successfully completed your custom itinerary in <strong>{aiLocation}</strong>.
                  </p>

                  {/* Journey Stats */}
                  <div className="w-full flex gap-2 mb-6">
                    {[
                      { val: `${currencySymbol}${totalSpentBaht.toLocaleString()}`, label: "Total Spent" },
                      { val: `+10 XP`, label: "Streak Points", highlight: true },
                      { val: `SGD ${(totalSpentBaht / exchangeRate).toFixed(2)}`, label: "Estimated Savings" }
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-2xl p-3"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: s.highlight ? `1px solid ${NETS_RED}` : "1px solid rgba(255,255,255,0.07)"
                        }}
                      >
                        <p className={`font-black text-sm ${s.highlight ? "text-[#F78DA7]" : "text-white"}`}>
                          {s.val}
                        </p>
                        <p className="text-gray-500 text-[10px] mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="w-full flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setSplitBillAmountBaht(totalSpentBaht);
                        setSplitOpen(true);
                        setItineraryOpen(false);
                      }}
                      className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      style={{
                        background: "linear-gradient(135deg, #10B981, #059669)",
                        boxShadow: "0 4px 20px rgba(16,185,129,0.35)"
                      }}
                    >
                      <Share2 size={16} /> Split Bill with Friends
                    </button>

                    <button
                      onClick={() => {
                        setAiStep("prompt");
                        setAiResult(null);
                        setCheckedMerchants(new Set());
                      }}
                      className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-white/10 hover:bg-white/15 border border-white/10 active:scale-95 transition-transform"
                    >
                      Back to Map
                    </button>
                  </div>
                </div>
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
              <p className="text-white font-bold text-sm">฿{splitBillAmountBaht.toLocaleString()} THB (<span className="text-[#10B981]">${splitBillAmountSGD.toFixed(2)} SGD</span>)</p>
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
                    <rect x="4" y="4"  width="22" height="22" rx="3" fill="none" stroke="#003DA5" strokeWidth="3"/>
                    <rect x="8" y="8"  width="14" height="14" rx="1" fill="#003DA5"/>
                    <rect x="54" y="4" width="22" height="22" rx="3" fill="none" stroke="#003DA5" strokeWidth="3"/>
                    <rect x="58" y="8" width="14" height="14" rx="1" fill="#003DA5"/>
                    <rect x="4" y="54" width="22" height="22" rx="3" fill="none" stroke="#003DA5" strokeWidth="3"/>
                    <rect x="8" y="58" width="14" height="14" rx="1" fill="#003DA5"/>
                    {/* Data dots */}
                    {[30,33,36,39,42,45,48,51,54].map((x) => [30,33,36,39,42].map((y) => (
                      <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill={(x+y)%5===0 ? "#003DA5" : (x+y)%3===0 ? "#E4002B" : "transparent"} />
                    )))}
                    {/* Center logo */}
                    <rect x="33" y="33" width="14" height="14" rx="2" fill="#003DA5"/>
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
                    style={{ background: "rgba(228,0,43,0.15)", color: NETS_RED, border: `1px solid ${NETS_RED}44` }}
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
                <div className="px-4 pb-4 flex flex-col gap-3 animate-slide-down text-left">
                  {/* Ledger Header */}
                  <div className="text-center pt-2">
                    <h4 className="text-white font-black text-sm tracking-wider uppercase">Jeh O Chula</h4>
                    <p className="text-gray-500 text-[10px] mt-0.5">Chulalongkorn Soi 3, Bangkok</p>
                    <p className="text-gray-500 text-[9px] mt-0.5">Table: 7 · Covers: 4 · 4 Jul 2026</p>
                  </div>

                  {/* Dashed line */}
                  <div className="border-t border-dashed border-gray-800 my-1" />

                  {/* Items List */}
                  <div className="flex flex-col gap-2">
                    {[
                      { qty: "1x", name: "Tom Yum Goong", price: 280 },
                      { qty: "2x", name: "Pad Thai (Shrimp)", price: 360 },
                      { qty: "1x", name: "Green Curry", price: 220 },
                      { qty: "2x", name: "Mango Sticky Rice", price: 240 },
                      { qty: "4x", name: "Thai Iced Tea", price: 240 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500 font-medium">{item.qty}</span>
                          <span className="text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-gray-300 font-semibold">฿{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dashed line */}
                  <div className="border-t border-dashed border-gray-800 my-1" />

                  {/* Subtotal / Charges */}
                  <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>฿1,340</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Charge (10%)</span>
                      <span>฿134</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (7%)</span>
                      <span>฿94</span>
                    </div>
                  </div>

                  {/* Dashed line */}
                  <div className="border-t border-dashed border-gray-800 my-1" />

                  {/* Total */}
                  <div className="flex justify-between items-end">
                    <span className="text-white font-black text-sm uppercase">Total</span>
                    <div className="text-right">
                      <span className="font-black text-lg text-[#10B981]">฿1,568</span>
                      <p className="text-gray-500 text-[10px]">$45.50 SGD</p>
                    </div>
                  </div>

                  {/* Save Receipt Button */}
                  <button
                    onClick={() => alert("Receipt Saved! 🧾")}
                    className="w-full mt-2 py-2.5 rounded-xl border border-[#F59E0B]/30 hover:bg-[#F59E0B]/5 active:scale-95 transition-all text-xs font-bold text-[#F59E0B] flex items-center justify-center gap-2"
                  >
                    <Download size={12} /> Save Receipt
                  </button>
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
                    style={{ background: "rgba(228,0,43,0.15)", color: NETS_RED, border: `1px solid ${NETS_RED}33` }}
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
                  boxShadow: "0 4px 20px rgba(0,61,165,0.45)",
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
            {[40,80,120,160,200].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="380" y2={y} stroke="rgba(0,61,165,0.12)" strokeWidth="1" />)}
            {[50,100,150,200,250,300,350].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="240" stroke="rgba(0,61,165,0.12)" strokeWidth="1" />)}
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
