"use client";

import { useState } from "react";
import { X, Copy, CheckCircle2, Tag } from "lucide-react";

interface VoucherClaimModalProps {
  merchant: string;
  discount: string;
  onClose: () => void;
}

const CODE_MAP: Record<string, string> = {
  "Chagee":       "NETS-CHG-2026",
  "Flash Coffee": "NETS-FLC-2026",
  "GrabFood":     "NETS-GRB-2026",
  "Uniqlo":       "NETS-UNQ-2026",
};

export default function VoucherClaimModal({ merchant, discount, onClose }: VoucherClaimModalProps) {
  const [copied, setCopied] = useState(false);
  const code = CODE_MAP[merchant] ?? "NETS-REWARD";

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in px-5" style={{ borderRadius: 40 }}>
      <div className="w-full max-w-xs animate-fade-scale">
        <div
          className="relative rounded-3xl overflow-hidden p-6 text-center"
          style={{
            background: "linear-gradient(135deg, #001035 0%, #001489 60%, #07101F 100%)",
            border: "1px solid rgba(0,20,137,0.5)",
            boxShadow: "0 0 40px rgba(0,20,137,0.35), 0 0 80px rgba(234,0,41,0.08)",
          }}
        >
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #EA0029, #001489)" }} />

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Tag size={28} className="text-white" />
          </div>

          <p className="text-blue-300 text-xs font-black tracking-widest uppercase mb-1">NETS Reward</p>
          <h2 className="text-white font-black text-xl mb-0.5">{discount}</h2>
          <p className="text-gray-400 text-sm mb-5">at {merchant}</p>

          {/* Code box */}
          <div
            className="rounded-2xl px-4 py-3 mb-4 flex items-center justify-between gap-3"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <span className="text-white font-black text-base tracking-widest flex-1 text-left">{code}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-90"
              style={{
                background: copied ? "#10B981" : "#001489",
                color: "#fff",
              }}
            >
              {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-gray-500 text-xs mb-5">Valid at checkout · Show to cashier or paste online</p>

          {/* Divider with scissors icon */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px border-t border-dashed border-white/15" />
            <span className="text-gray-500 text-xs">✂</span>
            <div className="flex-1 h-px border-t border-dashed border-white/15" />
          </div>

          <p className="text-gray-500 text-[10px]">Powered by NETS Pulse · Expires 31 Dec 2026</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 text-gray-400 text-sm flex items-center justify-center gap-2"
        >
          <X size={14} /> Close
        </button>
      </div>
    </div>
  );
}
