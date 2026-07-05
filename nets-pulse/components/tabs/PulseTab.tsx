"use client";

import { useState } from "react";
import { USER, WEEKLY_SPENDING, RECENT_TRANSACTIONS } from "@/lib/mockData";
import { Bell, TrendingUp, Send, Download, Plus, MoreHorizontal, ChevronRight } from "lucide-react";
import SendReceiveModal from "@/components/modals/SendReceiveModal";

type QuickAction = "send" | "receive" | "topup" | null;

export default function PulseTab() {
  const max = Math.max(...WEEKLY_SPENDING.map((d) => d.amount));
  const [activeModal, setActiveModal] = useState<QuickAction>(null);

  return (
    <div className="flex flex-col gap-4 pb-6 relative">
      {/* Modals */}
      {activeModal === "send"   && <SendReceiveModal mode="send"    onClose={() => setActiveModal(null)} />}
      {activeModal === "receive" && <SendReceiveModal mode="receive" onClose={() => setActiveModal(null)} />}
      {activeModal === "topup"  && <SendReceiveModal mode="topup"   onClose={() => setActiveModal(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-gray-400 text-sm">Good morning,</p>
          <h1 className="text-white font-black text-2xl flex items-center gap-2">
            {USER.name} <span className="text-[#EA0029]">✦</span>
          </h1>
        </div>
        <button className="relative w-10 h-10 glass rounded-full border border-white/10 flex items-center justify-center">
          <Bell size={18} className="text-white" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EA0029]" />
        </button>
      </div>

      {/* Balance Card */}
      <div
        className="rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001035 0%, #001489 50%, #0a1220 100%)",
          boxShadow: "0 8px 32px rgba(0,20,137,0.35)",
        }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,20,137,0.5) 0%, transparent 70%)" }} />
        <p className="text-blue-200 text-xs uppercase tracking-widest mb-1 opacity-70">Total Balance</p>
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-white font-black text-4xl">${USER.balance.toLocaleString()}</h2>
          <div className="flex items-center gap-1 text-[#10B981] text-sm font-semibold">
            <TrendingUp size={14} />
            <span>+2.4%</span>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {[
            { label: "Income", val: USER.income, color: "#10B981", icon: "↙" },
            { label: "Spent",  val: USER.spent,  color: "#EF4444", icon: "↗" },
            { label: "Saved",  val: USER.saved,  color: "#F78DA7", icon: "↑" },
          ].map((s) => (
            <div key={s.label} className="flex-1 rounded-2xl p-2.5" style={{ background: "rgba(0,0,0,0.25)" }}>
              <p className="text-gray-400 text-[10px] mb-1">{s.label}</p>
              <p className="font-bold text-sm" style={{ color: s.color }}>
                <span className="mr-0.5">{s.icon}</span>${s.val.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Banner */}
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(234,0,41,0.08))", border: "1px solid rgba(16,185,129,0.3)" }}
      >
        <div className="text-2xl animate-fire">🔥</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">7-Day Saving Streak!</p>
          <p className="text-[#6EE7B7] text-xs">Keep it up — hit 14 days for a bonus badge</p>
        </div>
        <ChevronRight size={16} className="text-[#10B981]" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Send,           label: "Send",    bg: "#001489", action: () => setActiveModal("send") },
          { icon: Download,       label: "Receive", bg: "#10B981", action: () => setActiveModal("receive") },
          { icon: Plus,           label: "Top Up",  bg: "#F59E0B", action: () => setActiveModal("topup") },
          { icon: MoreHorizontal, label: "More",    bg: "#374151", action: () => {} },
        ].map(({ icon: Icon, label, bg, action }) => (
          <button key={label} onClick={action} className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: bg }}>
              <Icon size={20} className="text-white" />
            </div>
            <span className="text-white text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>

      {/* Cross-Border Pulse Card */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "linear-gradient(135deg, rgba(234,0,41,0.10), rgba(16,185,129,0.08))", border: "1px solid rgba(234,0,41,0.2)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <p className="text-[#10B981] text-xs font-bold uppercase tracking-wider">Live Cross-Border Pulse</p>
        </div>
        <p className="text-white text-sm font-semibold">Trending in Bangkok 🇹🇭</p>
        <p className="text-gray-400 text-xs mt-1">
          48 Singaporean travelers scanned NETS QR at Chagee Siam Square in the last 3 hours. Steady lah!
        </p>
      </div>

      {/* Weekly Spending Chart */}
      <div className="glass rounded-3xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm">Weekly Spending</h3>
          <button className="text-[#EA0029] text-xs font-semibold">This week</button>
        </div>
        <div className="flex items-end gap-2 h-20">
          {WEEKLY_SPENDING.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{ height: `${(d.amount / max) * 100}%`, background: i === 4 ? "#EA0029" : "rgba(234,0,41,0.25)" }}
              />
              <span className="text-gray-500 text-[10px]">{d.day}</span>
            </div>
          ))}
        </div>
        <svg className="w-full mt-1" viewBox="0 0 300 40" preserveAspectRatio="none" style={{ height: 30 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EA0029" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <polyline
            points={WEEKLY_SPENDING.map((d, i) => `${(i / (WEEKLY_SPENDING.length - 1)) * 300},${40 - (d.amount / max) * 35}`).join(" ")}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Recent Activity</h3>
          <button className="text-[#EA0029] text-xs font-semibold">See all</button>
        </div>
        <div className="flex flex-col gap-2">
          {RECENT_TRANSACTIONS.slice(0, 3).map((tx) => (
            <div key={tx.id} className="glass flex items-center gap-3 p-3 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${tx.color}22` }}>
                {tx.icon}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">{tx.name}</p>
                <p className="text-gray-500 text-xs">{tx.sub}</p>
              </div>
              <p className="text-[#EF4444] text-sm font-bold">{tx.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
