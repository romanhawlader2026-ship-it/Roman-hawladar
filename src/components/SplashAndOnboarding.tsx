import { useState, useEffect } from "react";
import { Play, Sparkles, Layers, Sliders, Zap, Check, ArrowRight } from "lucide-react";

interface SplashAndOnboardingProps {
  onComplete: () => void;
}

export default function SplashAndOnboarding({ onComplete }: SplashAndOnboardingProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Simulated fast progressive load
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowSplash(false);
          }, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const onboardingSteps = [
    {
      title: "PRO MULTI-TRACK TIMELINE",
      description: "Tap, split, trim and layer video, audio, neon titles and stickers with mobile precision.",
      icon: <Layers className="w-12 h-12 text-purple-400" />,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "CINEMATIC LUTs & TRANSITIONS",
      description: "Apply VHS glitch, retro colors, and 3D kinetic transitions to make your edits stand out instantly.",
      icon: <Sliders className="w-12 h-12 text-pink-400" />,
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "INTELLIGENT AI MAGIC TOOLS",
      description: "Auto-generate bilingual subtitles (Bangla / English), enhance audio tracks, and translate text instantly.",
      icon: <Sparkles className="w-12 h-12 text-amber-300" />,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop"
    }
  ];

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#07030d] flex flex-col items-center justify-center text-white z-50">
        <div className="relative flex flex-col items-center">
          {/* Futuristic Ultra Edits Logo */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-800 via-indigo-900 to-purple-500 p-[2px] shadow-[0_0_50px_rgba(139,92,246,0.5)] mb-6 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d071b] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-20 h-20 bg-purple-500 blur-3xl opacity-35" />
              <div className="relative flex items-center justify-center">
                <Play className="w-10 h-10 text-white fill-purple-400 animate-pulse translate-x-[2px]" />
                <Zap className="w-5 h-5 text-amber-300 absolute -top-1 -right-1" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-display font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-indigo-200">
            ULTRA EDITS
          </h1>
          <p className="text-sm font-sans tracking-widest text-purple-400/80 font-medium mt-1">
            EDIT WITHOUT LIMITS
          </p>

          {/* Loading bar */}
          <div className="w-56 h-[3px] bg-purple-950/70 rounded-full mt-12 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="font-mono text-[10px] text-purple-400/50 mt-3 tracking-widest">
            LOADING ASSETS & GPU ENGINES... {progress}%
          </span>
        </div>
      </div>
    );
  }

  const current = onboardingSteps[activeStep];

  return (
    <div className="fixed inset-0 bg-[#07030a] flex items-center justify-center text-white z-40 p-4">
      <div className="w-full max-w-sm glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-purple-500/20 max-h-[90vh]">
        {/* Top brand header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-950/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white translate-x-[0.5px]" />
            </div>
            <span className="font-display font-bold text-xs tracking-wider">ULTRA EDITS</span>
          </div>
          <button
            onClick={onComplete}
            className="text-xs text-purple-400 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Visual Showcase Card */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl mb-6">
            <img
              src={current.image}
              alt="Ultra Edits Feature"
              className="w-full h-full object-cover brightness-90 saturate-125"
            />
            {/* Absolute visual badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d071b] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/30 text-purple-300 backdrop-blur-sm">
                STABLE GPU RENDER v3.5
              </span>
            </div>
          </div>

          {/* Icon Badge */}
          <div className="bg-purple-900/10 w-fit p-3 rounded-2xl border border-purple-500/10 mb-4">
            {current.icon}
          </div>

          {/* Title and descriptions */}
          <h2 className="text-xl font-display font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
            {current.title}
          </h2>
          <p className="text-sm font-sans text-purple-300/80 mt-2 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Action controllers */}
        <div className="px-6 py-5 bg-[#0b0614] border-t border-purple-950/40 flex items-center justify-between">
          {/* Step pagination indicators */}
          <div className="flex items-center gap-1.5">
            {onboardingSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeStep === i ? "w-6 bg-purple-500" : "w-1.5 bg-purple-950"
                }`}
              />
            ))}
          </div>

          {/* Next/Get Started controls */}
          <button
            onClick={() => {
              if (activeStep < onboardingSteps.length - 1) {
                setActiveStep(activeStep + 1);
              } else {
                onComplete();
              }
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider text-white shadow-lg shadow-purple-950/30 transition-all hover:scale-105 active:scale-95"
          >
            {activeStep === onboardingSteps.length - 1 ? (
              <>
                START CREATING
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                NEXT ADVANCE
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
