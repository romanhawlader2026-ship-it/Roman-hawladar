import { useState } from "react";
import { Plus, Video, Sparkles, Film, Compass, Settings, Trash2, Folder, Zap, Play, Layers } from "lucide-react";
import { EditProject } from "../types";

interface HomeDashboardProps {
  projects: EditProject[];
  onCreateProject: (aspectRatio: "16:9" | "9:16" | "1:1" | "2.39:1", name?: string) => void;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenPremium: () => void;
  isVIP: boolean;
}

export default function HomeDashboard({
  projects,
  onCreateProject,
  onSelectProject,
  onDeleteProject,
  onOpenPremium,
  isVIP
}: HomeDashboardProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "templates" | "learn">("projects");

  const ratioOptions = [
    { title: "Mobile Portrait", ratio: "9:16" as const, desc: "TikTok, Reels, Shorts", icon: "📱" },
    { title: "Widescreen Pro", ratio: "16:9" as const, desc: "YouTube, Film, TV", icon: "💻" },
    { title: "Square Feed", ratio: "1:1" as const, desc: "Instagram, Post", icon: "⏹️" },
    { title: "Anamorphic", ratio: "2.39:1" as const, desc: "Cinematic Cinema Aspect", icon: "🎬" }
  ];

  const videoTemplates = [
    {
      id: "tmpl_cyber",
      name: "Cyberpunk Tokyo Shift",
      clippings: 4,
      duration: "12s",
      ratio: "9:16",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=250&auto=format&fit=crop",
      vibe: "Neon saturation, VHS grain, kinetic jumps"
    },
    {
      id: "tmpl_surf",
      name: "Golden Coast Surf Vlog",
      clippings: 3,
      duration: "8s",
      ratio: "16:9",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=250&auto=format&fit=crop",
      vibe: "Warm cinematic LUT, acoustic background, slow-motion"
    },
    {
      id: "tmpl_rain",
      name: "Cozy Rainy Dhaka Ride",
      clippings: 5,
      duration: "15s",
      ratio: "9:16",
      thumbnail: "https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=250&auto=format&fit=crop",
      vibe: "Bangla caption, real rain ambience, film style fades"
    }
  ];

  return (
    <div className="w-full text-white pb-12">
      {/* Top Banner with VIP upgrade */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-purple-500/20 shadow-xl bg-gradient-to-r from-purple-950/40 via-[#100720] to-indigo-950/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-radial-gradient from-purple-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] uppercase font-mono tracking-widest text-purple-300">
              ULTRA EDITS v3.5
            </span>
            {isVIP && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-[10px] uppercase font-mono tracking-widest text-amber-300 flex items-center gap-1">
                ⭐ VIP ACTIVATED
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
            Edit Without Limits
          </h2>
          <p className="text-xs md:text-sm text-purple-300/80 max-w-lg">
            Create high-engagement vertical shorts or cinematic landscapes. Powered by high-speed rendering pipelines and optional AI translations.
          </p>
        </div>

        {!isVIP && (
          <button
            onClick={onOpenPremium}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-600 to-indigo-600 hover:brightness-110 active:scale-95 font-display font-bold text-xs tracking-wider shadow-lg transition-all"
          >
            <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
            UPGRADE TO PRO VIP
          </button>
        )}
      </div>

      {/* Grid of new ratios */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold tracking-wider text-sm text-purple-200 uppercase">
            Create New Project
          </h3>
          <span className="font-mono text-[10px] text-purple-500">SELECT COMPOSITION ASPECT RATIO</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ratioOptions.map((opt) => (
            <button
              key={opt.ratio}
              onClick={() => {
                const names = ["Tokyo Travel", "Raw Vlog", "Short Reel", "Cinema Cut"];
                const pick = names[Math.floor(Math.random() * names.length)];
                onCreateProject(opt.ratio, `Ultra ${pick} (${opt.ratio})`);
              }}
              className="glass-card-purple p-4 text-left rounded-2xl border border-purple-500/10 hover:border-purple-500/40 transition-all group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{opt.icon}</span>
                <span className="font-mono text-xs text-purple-400 font-bold bg-purple-900/20 px-2 py-0.5 rounded">
                  {opt.ratio}
                </span>
              </div>
              <h4 className="font-display font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                {opt.title}
              </h4>
              <p className="text-[10px] text-purple-400 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-purple-950/60 mb-6 font-display font-medium text-sm gap-6">
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-3 relative transition-all ${
            activeTab === "projects"
              ? "text-purple-300 font-bold border-b-2 border-purple-500"
              : "text-purple-500 hover:text-purple-300"
          }`}
        >
          Recent Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-3 relative transition-all ${
            activeTab === "templates"
              ? "text-purple-300 font-bold border-b-2 border-purple-500"
              : "text-purple-500 hover:text-purple-300"
          }`}
        >
          VIP Creative Templates
        </button>
      </div>

      {/* Content states */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-2xl bg-purple-950/10 border border-dashed border-purple-900/40 p-12 text-center">
              <Folder className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-purple-300">No Draft Projects Saved</h4>
              <p className="text-xs text-purple-400 mt-1 max-w-md mx-auto">
                All timeline changes are cached in high-fidelity GPU sandbox state and automatically recovered upon reload. Select a ratios composition style above to begin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-purple-500/10 group hover:border-purple-500/30 transition-all"
                >
                  <div
                    onClick={() => onSelectProject(proj.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex flex-col items-center justify-center font-mono text-[10px] text-purple-300">
                      <span>{proj.aspectRatio}</span>
                      <Video className="w-4 h-4 mt-0.5 text-purple-400 opacity-60" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                        {proj.name}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-purple-400 mt-1 font-mono">
                        <span>{proj.clips.length} Layer clips</span>
                        <span>•</span>
                        <span>{proj.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="p-2 rounded-lg bg-purple-900/10 hover:bg-purple-900/30 border border-purple-500/20 text-purple-300 transition-all"
                      title="Open Timeline"
                    >
                      <Play className="w-3.5 h-3.5 fill-purple-300 text-purple-300" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-950/30 hover:border-red-500/20 transition-all"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videoTemplates.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl overflow-hidden border border-purple-500/10 hover:border-purple-500/30 group transition-all flex flex-col"
            >
              <div className="relative aspect-video">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <span className="absolute bottom-2.5 right-2.5 bg-black/70 px-2 py-0.5 font-mono text-[10px] rounded border border-purple-500/20 text-purple-300">
                  {item.duration}
                </span>

                <span className="absolute top-2.5 left-2.5 bg-purple-950/80 px-2 py-0.5 font-mono text-[9px] rounded border border-purple-400/30 text-purple-200">
                  {item.ratio} Aspect
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-semibold text-sm group-hover:text-purple-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-purple-400 mt-2 leading-relaxed italic">
                    {item.vibe}
                  </p>
                </div>

                <button
                  onClick={() => {
                    // Set ratio of templates
                    onCreateProject(item.ratio as any, `${item.name} (Edited)`);
                  }}
                  className="w-full mt-4 bg-purple-950/60 hover:bg-purple-900/40 border border-purple-500/20 text-purple-300 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all"
                >
                  USE DRAFT BLUEPRINT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
