import { useState } from "react";
import { Sparkles, Check, Crown, HelpCircle, X, Zap } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVIP: boolean;
  onSetVIP: (vip: boolean) => void;
}

export default function PremiumModal({ isOpen, onClose, isVIP, onSetVIP }: PremiumModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [successPaid, setSuccessPaid] = useState(false);

  if (!isOpen) return null;

  const features = [
    "No Watermarks on any Exported Videos",
    "Ultra-Engine 4K Resolution & 60FPS Support",
    "Auto AI Multilingual Subtitles (Unlimited)",
    "Exclusive Cinematic LUTs & Neon Bangla Fonts",
    "Advanced AI Green Screen Background Remover",
    "Smart Multi-Track Auto Beats Sync"
  ];

  const handlepurchase = () => {
    // Simulated frictionless purchase Flow
    setSuccessPaid(true);
    setTimeout(() => {
      onSetVIP(true);
      setSuccessPaid(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center text-white z-50 p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-[#140c24] to-[#07030e] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Glowing aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/25 blur-3xl rounded-full" />

        {/* Top bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-purple-950/40 relative z-10">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
            <span className="font-display font-extrabold text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-300 to-white">
              ULTRA VIP CLUB
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-purple-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* content area */}
        <div className="p-6 relative z-10">
          {isVIP ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-300 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-300 fill-amber-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-amber-300">VIP Status Unlocked!</h3>
              <p className="text-xs text-purple-300/80 mt-2 max-w-xs mx-auto">
                All premium templates, 4k background video render channels, watermarks, and AI engines have been fully unlocked.
              </p>
              <button
                onClick={() => {
                  onSetVIP(false);
                  onClose();
                }}
                className="mt-6 bg-red-950/40 hover:bg-red-900/30 border border-red-500/30 text-red-300 text-xs px-4 py-2 rounded-xl transition-all"
              >
                Reset VIP Status (Revoke Trial)
              </button>
            </div>
          ) : successPaid ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <Zap className="w-12 h-12 text-amber-300 animate-bounce" />
              <h3 className="text-lg font-display font-semibold mt-4">SIMULATING PAY CHANNEL...</h3>
              <p className="text-xs text-purple-400">Deploying cloud credentials into local video processor.</p>
              <div className="w-24 h-[2px] bg-purple-900 rounded mt-4 overflow-hidden relative">
                <div className="h-full bg-purple-300 w-1/2 animate-infinite-loading" />
              </div>
            </div>
          ) : (
            <>
              {/* Feature grid */}
              <div className="space-y-3 mb-6">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-purple-200">
                    <div className="p-0.5 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-400 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Plans toggles */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSelectedPlan("monthly")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedPlan === "monthly"
                      ? "bg-purple-950/40 border-purple-500/90 shadow-lg shadow-purple-950/50"
                      : "bg-[#0b0614]/40 border-purple-950/60 opacity-70"
                  }`}
                >
                  <span className="block text-[11px] font-medium tracking-wider text-purple-300">
                    MONTHLY GO
                  </span>
                  <span className="block text-lg font-display font-bold mt-1">$4.99</span>
                  <span className="block text-[10px] text-purple-400 mt-1">Cancel anytime</span>
                </button>

                <button
                  onClick={() => setSelectedPlan("yearly")}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPlan === "yearly"
                      ? "bg-purple-900/20 border-amber-500/90 shadow-lg shadow-purple-950/50"
                      : "bg-[#0b0614]/40 border-purple-950/60 opacity-70"
                  }`}
                >
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-500 rounded text-[8px] font-bold text-black tracking-widest">
                    60% SAVE
                  </div>
                  <span className="block text-[11px] font-medium tracking-wider text-amber-200">
                    YEARLY PASS
                  </span>
                  <span className="block text-lg font-display font-bold mt-1">$23.99</span>
                  <span className="block text-[10px] text-purple-400 mt-1">Only $1.99/mo</span>
                </button>
              </div>

              {/* Purchase Trigger buttons */}
              <button
                onClick={handlepurchase}
                className="w-full bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-600 hover:brightness-110 py-3 rounded-xl font-display font-bold text-xs tracking-widest shadow-lg shadow-purple-950/40 transition-all hover:-translate-y-0.5 active:translate-y-0 text-white"
              >
                SUBSCRIBE & INSTANT VIP
              </button>

              <span className="block font-mono text-[9px] text-center text-purple-500 mt-3 tracking-wider">
                🔒 256-BIT SECURITY • RESTORE PURCHASE AT ANY TIME
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
