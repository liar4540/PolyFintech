"use client";

import { useState } from "react";
import { X, Send, Download, Plus, ArrowRight, CheckCircle2 } from "lucide-react";

type Mode = "send" | "receive" | "topup";

interface SendReceiveModalProps {
  mode: Mode;
  onClose: () => void;
}

const CONTACTS = [
  { id: 1, name: "Kai",  avatar: "K", color: "#003DA5" },
  { id: 2, name: "Mia",  avatar: "M", color: "#10B981" },
  { id: 3, name: "Ryan", avatar: "R", color: "#E4002B" },
  { id: 4, name: "Jess", avatar: "J", color: "#F59E0B" },
];

const TOP_UP_AMOUNTS = [10, 20, 50, 100, 200];

const NETS_BLUE = "#003DA5";
const NETS_RED  = "#E4002B";

export default function SendReceiveModal({ mode, onClose }: SendReceiveModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [selectedTopUp, setSelectedTopUp] = useState<number | null>(null);

  const modeConfig = {
    send: {
      title: "Send Money",
      subtitle: "Send via NETS QR",
      icon: <Send size={20} className="text-white" />,
      color: NETS_BLUE,
      ctaLabel: "Send Now",
    },
    receive: {
      title: "Request Money",
      subtitle: "Share your QR to receive",
      icon: <Download size={20} className="text-white" />,
      color: "#10B981",
      ctaLabel: "Generate QR",
    },
    topup: {
      title: "Top Up Balance",
      subtitle: "Add funds via PayNow / Bank",
      icon: <Plus size={20} className="text-white" />,
      color: "#F59E0B",
      ctaLabel: "Confirm Top Up",
    },
  }[mode];

  const handleSubmit = () => {
    if (step === "form") { setStep("confirm"); return; }
    setStep("done");
  };

  const effectiveAmount = mode === "topup" ? selectedTopUp?.toString() ?? amount : amount;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in px-0" style={{ borderRadius: 40 }}>
      <div
        className="w-full animate-slide-up rounded-t-[32px] pb-10"
        style={{ background: "#0A1525", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-5 pt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: modeConfig.color }}>
                {modeConfig.icon}
              </div>
              <div>
                <h2 className="text-white font-black text-lg">{modeConfig.title}</h2>
                <p className="text-gray-400 text-xs">{modeConfig.subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 glass rounded-full border border-white/10">
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* ── DONE state ────────────────────────────────── */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 size={56} style={{ color: "#10B981" }} />
              <div className="text-center">
                <p className="text-white font-black text-xl">
                  {mode === "topup" ? "Topped Up!" : mode === "send" ? "Sent!" : "QR Ready!"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {mode === "send" && `$${effectiveAmount} sent to ${selectedContact.name} via NETS QR`}
                  {mode === "receive" && `Request for $${effectiveAmount} sent`}
                  {mode === "topup" && `$${effectiveAmount} added to your balance`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm mt-2"
                style={{ background: "#10B981" }}
              >
                Done
              </button>
            </div>
          )}

          {/* ── CONFIRM state ─────────────────────────────── */}
          {step === "confirm" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {mode === "send" && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-xs">To</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: selectedContact.color }}>{selectedContact.avatar}</div>
                        <p className="text-white font-semibold text-sm">{selectedContact.name}</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/5 my-2" />
                  </>
                )}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-xs">Amount</p>
                  <p className="text-white font-black text-lg">${effectiveAmount}</p>
                </div>
                {note && (
                  <>
                    <div className="h-px bg-white/5 my-2" />
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs">Note</p>
                      <p className="text-white text-sm">{note}</p>
                    </div>
                  </>
                )}
                <div className="h-px bg-white/5 my-2" />
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs">Method</p>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: NETS_BLUE }} />
                    <p className="text-white text-xs font-semibold">NETS QR</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 py-3 rounded-2xl text-white text-sm font-semibold glass border border-white/10"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: modeConfig.color }}
                >
                  Confirm <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ── FORM state ────────────────────────────────── */}
          {step === "form" && (
            <div className="flex flex-col gap-4">

              {/* Contact picker (Send only) */}
              {mode === "send" && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Send To</p>
                  <div className="flex gap-3">
                    {CONTACTS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedContact(c)}
                        className="flex flex-col items-center gap-1.5 transition-all active:scale-90"
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white transition-all"
                          style={{
                            background: c.color,
                            boxShadow: selectedContact.id === c.id ? `0 0 0 3px white, 0 0 0 5px ${c.color}` : "none",
                          }}
                        >
                          {c.avatar}
                        </div>
                        <span className="text-xs text-gray-400 font-semibold">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Up preset amounts */}
              {mode === "topup" && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Quick Amounts</p>
                  <div className="flex gap-2 flex-wrap">
                    {TOP_UP_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setSelectedTopUp(amt)}
                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-90"
                        style={{
                          background: selectedTopUp === amt ? "#F59E0B" : "rgba(255,255,255,0.06)",
                          color: selectedTopUp === amt ? "#000" : "#fff",
                          border: selectedTopUp === amt ? "none" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount input */}
              {mode !== "topup" || selectedTopUp === null ? (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">
                    {mode === "topup" ? "Or enter custom amount" : "Amount (SGD)"}
                  </p>
                  <div
                    className="flex items-center gap-3 rounded-2xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <span className="text-gray-400 font-bold text-lg">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setSelectedTopUp(null); }}
                      className="flex-1 bg-transparent text-white text-xl font-black outline-none placeholder-gray-600"
                      inputMode="decimal"
                    />
                    <span className="text-gray-500 text-xs">SGD</span>
                  </div>
                </div>
              ) : null}

              {/* Note (Send/Receive only) */}
              {mode !== "topup" && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Note (optional)</p>
                  <input
                    type="text"
                    placeholder="Dinner, rent, etc."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 bg-white/5 text-white text-sm outline-none placeholder-gray-600 border border-white/10"
                  />
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!effectiveAmount && !amount}
                className="w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-40"
                style={{ background: modeConfig.color }}
              >
                {modeConfig.ctaLabel} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
