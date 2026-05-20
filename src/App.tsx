/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, Sparkles, Layers, Sliders, Zap, Check, ArrowRight, Plus, 
  Trash2, Folder, Video, Music, Type, Smile, Undo, Redo, Scissors, 
  RotateCw, RefreshCw, Volume2, Maximize2, Download, LogIn, LogOut,
  ChevronRight, Compass, Settings, AlertCircle, HelpCircle, FileText, MonitorPlay,
  Heart, Globe
} from "lucide-react";
import { LayerType, MediaClip, TimelineClip, EditProject, SmartSubtitle } from "./types";
import { SAMPLE_MEDIA_LIST, TRANSITION_EFFECTS, VIDEO_EFFECTS } from "./components/SampleMedia";
import SplashAndOnboarding from "./components/SplashAndOnboarding";
import PremiumModal from "./components/PremiumModal";
import HomeDashboard from "./components/HomeDashboard";

// Helper keys for LocalStorage
const STORAGE_PROJECTS_KEY = "ultra_edits_projects_v2";
const STORAGE_USER_KEY = "ultra_edits_user";

export default function App() {
  // Authentication states
  const [user, setUser] = useState<{ email: string; isGuest: boolean } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : { email: "guest@ultraedits.studio", isGuest: true };
    } catch {
      return { email: "guest@ultraedits.studio", isGuest: true };
    }
  });

  // Flow controllers
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [isVIP, setIsVIP] = useState<boolean>(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  
  // Project list state
  const [projects, setProjects] = useState<EditProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load projects", e);
    }
    // Pre-populate a starting epic project
    return [
      {
        id: "proj_tokyo",
        name: "Epic Tokyo Nights Reel",
        updatedAt: "May 20, 2026",
        aspectRatio: "9:16",
        duration: 15,
        clips: [
          {
            id: "tc_v1",
            mediaId: "v1",
            name: "Cyberpunk Tokyo Neon Drive",
            type: LayerType.VIDEO,
            startTime: 0,
            duration: 8,
            volume: 85,
            color: "bg-purple-600/40 border-purple-400",
            effects: ["cinematic"],
            transition: "fade"
          },
          {
            id: "tc_v2",
            mediaId: "v2",
            name: "Golden Hour Cinematic Surf",
            type: LayerType.VIDEO,
            startTime: 8,
            duration: 7,
            volume: 100,
            color: "bg-blue-600/40 border-blue-400",
            effects: ["vintage"],
            transition: "zoom"
          },
          {
            id: "tc_a1",
            mediaId: "a1",
            name: "Lo-Fi Midnight Beat (Chilled)",
            type: LayerType.AUDIO,
            startTime: 0,
            duration: 15,
            volume: 70,
            color: "bg-indigo-600/30 border-indigo-400",
          },
          {
            id: "tc_t1",
            mediaId: "text_tmpl",
            name: "Dhaka Nights Intro Text",
            type: LayerType.TEXT,
            startTime: 1.5,
            duration: 5,
            color: "bg-pink-600/40 border-pink-400",
            textProps: {
              text: "উগ্র এডিটস - LIMITLESS ✨",
              style: "neon",
              fontSize: 22,
              color: "#f472b6"
            }
          },
          {
            id: "tc_s1",
            mediaId: "sticker_fire",
            name: "Fire Emoji Glow",
            type: LayerType.STICKER,
            startTime: 7.5,
            duration: 3.5,
            color: "bg-yellow-600/40 border-yellow-400",
            stickerProps: {
              stickerId: "fire",
              emoji: "🔥",
              animation: "pulse"
            }
          }
        ]
      }
    ];
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Active project helper
  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Video playback mechanics
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(3.5); // Current playhead time in seconds
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  
  // Custom tool state variables
  const [selectedLayerType, setSelectedLayerType] = useState<LayerType>(LayerType.VIDEO);
  const [aiSubtitles, setAiSubtitles] = useState<SmartSubtitle[]>([
    { id: "s1", start: 0, end: 4, text: "Welcome to Ultra Edits Pro 🎬" },
    { id: "s2", start: 4.5, end: 9, text: "Seamless multi-layered transitions rendering live on device..." },
  ]);
  const [subtitleLanguage, setSubtitleLanguage] = useState<string>("English");
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);

  // AI LUT wizard state
  const [aiVibePrompt, setAiVibePrompt] = useState("cyberpunk neon cyber");
  const [calculatedLUT, setCalculatedLUT] = useState<{
    saturation: number;
    contrast: number;
    warmth: number;
    tint: number;
    grain: number;
    explanation: string;
  } | null>(null);
  const [isFetchingLut, setIsFetchingLut] = useState(false);

  // AI Shorts script generator
  const [aiTopic, setAiTopic] = useState("cinematic travel vlog");
  const [suggestedScript, setSuggestedScript] = useState<{
    titles: string[];
    script: Array<{ stage: string; text: string }>;
  } | null>(null);
  const [isFetchingScript, setIsFetchingScript] = useState(false);

  // Selected Clip variables
  const activeClip = activeProject?.clips.find(c => c.id === selectedClipId) || null;

  // Export State System
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [exportResolution, setExportResolution] = useState<string>("1080p");
  const [exportFps, setExportFps] = useState<number>(60);

  // Local media upload file picker state
  const [uploadedFiles, setUploadedFiles] = useState<MediaClip[]>([]);
  const [customTextContent, setCustomTextContent] = useState("উগ্র এডিটস");
  const [customTextStyle, setCustomTextStyle] = useState<"neon" | "gradient" | "classic" | "shadow" | "bengali">("bengali");

  // Playback Loop Clock Simulation
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateClock = (now: number) => {
      if (isPlaying && activeProject) {
        const delta = (now - lastTime) / 1000;
        setCurrentTime((prev) => {
          const nextVal = prev + delta;
          if (nextVal >= activeProject.duration) {
            setIsPlaying(false);
            return 0;
          }
          return nextVal;
        });
      }
      lastTime = now;
      animationFrameId = requestAnimationFrame(updateClock);
    };

    animationFrameId = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, activeProject]);

  // Persist projects to local storage
  const saveProjects = (updatedProjects: EditProject[]) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updatedProjects));
    } catch (e) {
      console.error("Could not save to LocalStorage", e);
    }
  };

  const handleCreateProject = (aspectRatio: "16:9" | "9:16" | "1:1" | "2.39:1", name?: string) => {
    const freshProj: EditProject = {
      id: `proj_${Date.now()}`,
      name: name || `Creative Video Unit #${projects.length + 1}`,
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      aspectRatio,
      duration: 15,
      clips: [
        {
          id: `clip_${Date.now()}_v`,
          mediaId: "v3",
          name: "Dhaka Rain & Yellow Rickshaw",
          type: LayerType.VIDEO,
          startTime: 0,
          duration: 10,
          volume: 100,
          color: "bg-purple-600/40 border-purple-400",
          effects: ["cinematic"]
        },
        {
          id: `clip_${Date.now()}_a`,
          mediaId: "a2",
          name: "Retro Synthwave Drive (Upbeat)",
          type: LayerType.AUDIO,
          startTime: 0,
          duration: 12,
          volume: 80,
          color: "bg-indigo-600/30 border-indigo-400"
        }
      ]
    };
    saveProjects([freshProj, ...projects]);
    setActiveProjectId(freshProj.id);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    if (activeProjectId === id) {
      setActiveProjectId(null);
    }
  };

  // AI subtitle creation request
  const fetchAISubtitles = async () => {
    setIsGeneratingSubtitles(true);
    try {
      const response = await fetch("/api/ai/subtitles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoName: activeProject?.name || "Tokyo nights edit",
          theme: activeClip?.effects?.[0] || "cinematic",
          duration: activeProject?.duration || 15,
          language: subtitleLanguage
        })
      });
      const data = await response.json();
      if (data.success && data.subtitles) {
        setAiSubtitles(data.subtitles.map((v: any, index: number) => ({
          id: `ai_sub_${index}_${Date.now()}`,
          start: v.start,
          end: v.end,
          text: v.text
        })));
      }
    } catch (err) {
      console.error("Error generating AI subtitles", err);
    } finally {
      setIsGeneratingSubtitles(false);
    }
  };

  // AI color configuration LUT generator
  const triggerLUTAdvisor = async () => {
    setIsFetchingLut(true);
    try {
      const response = await fetch("/api/ai/lut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibePrompt: aiVibePrompt })
      });
      const data = await response.json();
      if (data.success && data.lutSettings) {
        setCalculatedLUT(data.lutSettings);
        // Automatically inject these aesthetic filters into the select video clip if edit selection is on!
        if (activeClip && activeClip.type === LayerType.VIDEO) {
          const updatedClips = (activeProject?.clips || []).map(clip => {
            if (clip.id === activeClip.id) {
              return {
                ...clip,
                effects: ["cinematic"], // apply custom matrix representation code
              };
            }
            return clip;
          });
          onUpdateClips(updatedClips);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingLut(false);
    }
  };

  // Retrieve AI reels script advice
  const generateShortsScript = async () => {
    setIsFetchingScript(true);
    try {
      const response = await fetch("/api/ai/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic })
      });
      const data = await response.json();
      if (data.success && data.script) {
        setSuggestedScript(data.script);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingScript(false);
    }
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newMedia: MediaClip = {
        id: `local_${Date.now()}`,
        name: file.name,
        duration: Math.ceil(Math.random() * 8) + 5,
        url: URL.createObjectURL(file),
        thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=200&auto=format&fit=crop",
        type: file.type.includes("audio") ? "audio" : "video"
      };
      setUploadedFiles(prev => [newMedia, ...prev]);
    }
  };

  const addClipToTimeline = (mediaItem: MediaClip, forcedType?: LayerType) => {
    if (!activeProject) return;
    const determinedType = forcedType || (mediaItem.type === "audio" ? LayerType.AUDIO : LayerType.VIDEO);
    
    let colorClass = "bg-purple-600/40 border-purple-400";
    if (determinedType === LayerType.AUDIO) colorClass = "bg-indigo-600/30 border-indigo-400";
    if (determinedType === LayerType.TEXT) colorClass = "bg-pink-600/40 border-pink-400";
    if (determinedType === LayerType.STICKER) colorClass = "bg-yellow-600/40 border-yellow-400";

    const newClip: TimelineClip = {
      id: `tc_${Date.now()}`,
      mediaId: mediaItem.id,
      name: mediaItem.name,
      type: determinedType,
      startTime: currentTime,
      duration: Math.min(mediaItem.duration, activeProject.duration - currentTime),
      volume: determinedType === LayerType.AUDIO || determinedType === LayerType.VIDEO ? 100 : undefined,
      color: colorClass
    };

    if (determinedType === LayerType.TEXT) {
      newClip.textProps = {
        text: customTextContent,
        style: customTextStyle,
        fontSize: 18,
        color: "#d946ef"
      };
    }

    if (determinedType === LayerType.STICKER) {
      newClip.stickerProps = {
        stickerId: "heart",
        emoji: "💖",
        animation: "pulse"
      };
    }

    const updatedClips = [...activeProject.clips, newClip];
    onUpdateClips(updatedClips);
    setSelectedClipId(newClip.id);
  };

  const onUpdateClips = (newClips: TimelineClip[]) => {
    if (!activeProject) return;
    const updated = projects.map((p) => {
      if (p.id === activeProject.id) {
        return { ...p, clips: newClips };
      }
      return p;
    });
    saveProjects(updated);
  };

  // Clip layout actions (split, delete, volume update, filters)
  const handleSplitClip = () => {
    if (!activeProject || !activeClip) return;
    const clipOffset = currentTime - activeClip.startTime;
    if (clipOffset <= 0.5 || clipOffset >= activeClip.duration - 0.5) {
      // Too close to edges
      return;
    }

    const originalDuration = activeClip.duration;
    const clip1Duration = clipOffset;
    const clip2Duration = originalDuration - clipOffset;

    const clip1: TimelineClip = {
      ...activeClip,
      id: `${activeClip.id}_pt1`,
      duration: clip1Duration
    };

    const clip2: TimelineClip = {
      ...activeClip,
      id: `${activeClip.id}_pt2`,
      startTime: currentTime,
      duration: clip2Duration
    };

    const remainingClips = activeProject.clips.filter(c => c.id !== activeClip.id);
    onUpdateClips([...remainingClips, clip1, clip2]);
    setSelectedClipId(clip2.id);
  };

  const handleDeleteClip = (id: string) => {
    if (!activeProject) return;
    const updated = activeProject.clips.filter(c => c.id !== id);
    onUpdateClips(updated);
    if (selectedClipId === id) setSelectedClipId(null);
  };

  const handleUpdateVolume = (clipId: string, val: number) => {
    if (!activeProject) return;
    const nextClips = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, volume: val };
      }
      return c;
    });
    onUpdateClips(nextClips);
  };

  const handleAddTransition = (clipId: string, effectName: string) => {
    if (!activeProject) return;
    const nextClips = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, transition: effectName };
      }
      return c;
    });
    onUpdateClips(nextClips);
  };

  const handleAddFilter = (clipId: string, filterId: string) => {
    if (!activeProject) return;
    const nextClips = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, effects: [filterId] };
      }
      return c;
    });
    onUpdateClips(nextClips);
  };

  // High fidelity trigger export screen
  const handleTriggerExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportSuccess(false);

    const stepInterval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(stepInterval);
          setExportSuccess(true);
          return 100;
        }
        return p + 5;
      });
    }, 150);
  };

  // Find active image sample for main monitor screen based on current timeline scrub
  const getActiveVideoSample = () => {
    if (!activeProject) return null;
    const videoClips = activeProject.clips.filter(c => c.type === LayerType.VIDEO);
    const activeOne = videoClips.find(
      c => currentTime >= c.startTime && currentTime <= c.startTime + c.duration
    );
    if (!activeOne) return SAMPLE_MEDIA_LIST[0]; // default back
    const matched = SAMPLE_MEDIA_LIST.find(m => m.id === activeOne.mediaId);
    return matched || SAMPLE_MEDIA_LIST[0];
  };

  // Active overlay subtitles matching clock time
  const currentOverlaySub = aiSubtitles.find(
    s => currentTime >= s.start && currentTime <= s.end
  );

  // Active custom styled text clip overlay list
  const activeTextClips = activeProject?.clips.filter(
    c => c.type === LayerType.TEXT && currentTime >= c.startTime && currentTime <= c.startTime + c.duration
  ) || [];

  // Active custom styled stickers overlay list
  const activeStickerClips = activeProject?.clips.filter(
    c => c.type === LayerType.STICKER && currentTime >= c.startTime && currentTime <= c.startTime + c.duration
  ) || [];

  const currentMedia = getActiveVideoSample();

  // Find transition animations
  const videoInTransition = activeProject?.clips.find(
    c => c.type === LayerType.VIDEO && Math.abs((c.startTime + c.duration) - currentTime) < 0.8
  );

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* Absolute Beautiful Ambient Glares - Immersive UI Style */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Dynamic Tutorial Overlay */}
      {isOnboarding && (
        <SplashAndOnboarding onComplete={() => setIsOnboarding(false)} />
      )}

      {/* Subscription Paywall Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        isVIP={isVIP}
        onSetVIP={setIsVIP}
      />

      {/* Global Application Nav Bar */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md z-30 relative">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Video className="w-5 h-5 text-white fill-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm tracking-wider uppercase">ULTRA EDITS</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300">PRO RENDERER</span>
            </div>
            {activeProject ? (
              <p className="text-[10px] text-purple-400/80 uppercase font-mono tracking-wider">
                Active project: <span className="text-white hover:underline cursor-pointer" onClick={() => setActiveProjectId(null)}>{activeProject.name}</span> ({activeProject.aspectRatio})
              </p>
            ) : (
              <p className="text-[10px] text-zinc-500 font-mono">DASHBOARD COMMAND STANDBY</p>
            )}
          </div>
        </div>

        {/* Global right actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden sm:flex items-center gap-2 bg-purple-950/20 px-3 py-1.5 rounded-full border border-purple-900/35">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-purple-200">{user.email}</span>
              <button 
                onClick={() => setUser(null)}
                className="text-[10px] text-red-400 hover:text-red-300 font-mono ml-2 transition-colors uppercase"
              >
                Signout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setUser({ email: "guest@ultraedits.studio", isGuest: true })}
              className="hidden sm:flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-all font-mono"
            >
              <LogIn className="w-3.5 h-3.5" />
              GUEST ACCESS
            </button>
          )}

          <button 
            onClick={() => setIsPremiumModalOpen(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1 transition-all ${
              isVIP 
                ? "bg-amber-600/20 border border-amber-500/40 text-amber-200" 
                : "bg-purple-900/20 border border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
            }`}
          >
            <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
            {isVIP ? "PRO ACTIVATED" : "GET ULTRA VIP"}
          </button>

          {activeProject && (
            <button
              onClick={handleTriggerExport}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-full text-xs font-bold font-display tracking-widest uppercase text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container Section */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Leftmost Sidebar Quick Navigation Utility bar */}
        <nav className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black/40 z-20">
          <div 
            onClick={() => setActiveProjectId(null)}
            className={`p-2.5 rounded-xl cursor-pointer transition-all ${
              !activeProject ? "text-purple-400 bg-purple-500/10 border border-purple-500/20" : "text-zinc-500 hover:text-white"
            }`}
            title="Projects Dashboard"
          >
            <Folder className="w-5 h-5" />
          </div>
          
          <div 
            onClick={() => {
              if (!activeProject && projects.length > 0) {
                setActiveProjectId(projects[0].id);
              }
            }}
            className={`p-2.5 rounded-xl cursor-pointer transition-all ${
              activeProject ? "text-purple-400 bg-purple-500/10 border border-purple-500/20" : "text-zinc-500 hover:text-white"
            }`}
            title="Timeline Video Workspace"
          >
            <MonitorPlay className="w-5 h-5" />
          </div>

          <div className="w-8 h-[1px] bg-white/5" />

          {/* Preset trigger widgets */}
          <button 
            onClick={() => {
              if (activeProject) {
                const nextRatio = activeProject.aspectRatio === "9:16" ? "16:9" : "9:16";
                const revised = projects.map(p => {
                  if (p.id === activeProject.id) {
                    return { ...p, aspectRatio: nextRatio as any };
                  }
                  return p;
                });
                saveProjects(revised);
              }
            }}
            className="p-2 text-zinc-500 hover:text-purple-400 rounded-lg transition-colors flex flex-col items-center"
            title="Adjust Output Aspect Ratio"
          >
            <span className="text-[9px] font-mono leading-none font-bold">RATIO</span>
          </button>

          <button 
            onClick={() => setIsPremiumModalOpen(true)}
            className="p-2 text-zinc-500 hover:text-amber-400 rounded-lg transition-colors"
            title="VIP Templates & Premium Filters"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="mt-auto p-2.5 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </a>
        </nav>

        {/* Content Body */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Active project viewport workspace vs Initial home project dashboard */}
          {!activeProject ? (
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <HomeDashboard 
                projects={projects}
                onCreateProject={handleCreateProject}
                onSelectProject={setActiveProjectId}
                onDeleteProject={handleDeleteProject}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
                isVIP={isVIP}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              
              {/* Double Column Display: Video Viewport & AI Helper panel */}
              <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 md:p-6 gap-6 overflow-y-auto lg:overflow-hidden timeline-scrollbar">
                
                {/* Visual Video Workstation Canvas Viewport */}
                <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 bg-[#0c0816]/70 rounded-2xl border border-white/5 relative flex flex-col justify-between overflow-hidden shadow-2xl p-4">
                  
                  {/* Aspect Ratio Sized Playback Container */}
                  <div className="flex-1 flex items-center justify-center relative bg-black/40 rounded-xl overflow-hidden shadow-inner video-frame-checkerboard border border-white/5">
                    
                    {/* Simulator Layout box responsive frame resizing */}
                    <div 
                      className={`relative bg-zinc-950 shadow-2xl transition-all duration-300 border border-purple-500/20 overflow-hidden flex items-center justify-center rounded-lg ${
                        activeProject.aspectRatio === "9:16" 
                          ? "h-[90%] aspect-[9/16]" 
                          : activeProject.aspectRatio === "16:9" 
                          ? "w-[90%] aspect-[16/9]" 
                          : activeProject.aspectRatio === "1:1" 
                          ? "h-[85%] aspect-square" 
                          : "w-[95%] aspect-[2.39/1]"
                      }`}
                    >
                      {/* Live Image source layer representing video track frame */}
                      <img 
                        src={currentMedia?.thumbnail} 
                        alt="Current Video Frame Simulation"
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          activeClip?.effects?.[0] === "vhs" 
                            ? "sepia saturate-150 contrast-125 saturate-50 hue-rotate-15"
                            : activeClip?.effects?.[0] === "cinematic"
                            ? "contrast-115 brightness-95 saturate-125 sepia-[0.15]"
                            : activeClip?.effects?.[0] === "noir"
                            ? "grayscale contrast-135"
                            : activeClip?.effects?.[0] === "vintage"
                            ? "sepia saturate-75 brightness-105"
                            : "filter-none"
                        } ${
                          // Kinetic Transition simulation on active timeline clocks
                          videoInTransition ? "scale-105 filter blur-xs" : ""
                        }`}
                      />

                      {/* Video Player overlay labels */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Smart Subtitles render tracks */}
                      {currentOverlaySub && (
                        <div className="absolute bottom-10 left-4 right-4 text-center pointer-events-none z-10 animate-pulse">
                          <span className="bg-black/85 text-xs text-amber-200 px-3.5 py-1.5 rounded-xl border border-purple-500/40 font-semibold tracking-wider font-display shadow-md glow-text-neon uppercase">
                            {currentOverlaySub.text}
                          </span>
                        </div>
                      )}

                      {/* Interactive Custom Text Layer Overlays */}
                      {activeTextClips.map((tClip) => (
                        <div 
                          key={tClip.id} 
                          className="absolute pointer-events-none z-20 text-center px-4"
                          style={{ top: "30%" }}
                        >
                          <span className={`block font-bold truncate text-lg uppercase tracking-widest ${
                            tClip.textProps?.style === "neon" 
                              ? "text-purple-300 glow-text-neon" 
                              : tClip.textProps?.style === "gradient"
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300"
                              : tClip.textProps?.style === "bengali"
                              ? "text-emerald-300 font-sans border border-emerald-500/20 bg-emerald-950/80 px-2 py-1 rounded"
                              : "text-white"
                          }`}>
                            {tClip.textProps?.text || "PREVIEW TEXT"}
                          </span>
                          <span className="block text-[8px] opacity-40 text-white font-mono uppercase mt-1">
                            {tClip.textProps?.style} rendering
                          </span>
                        </div>
                      ))}

                      {/* Interactive emoji stamp overlay */}
                      {activeStickerClips.map((sClip) => (
                        <div 
                          key={sClip.id} 
                          className="absolute pointer-events-none z-20 text-4xl animate-bounce"
                          style={{ right: "20%", top: "45%" }}
                        >
                          {sClip.stickerProps?.emoji || "✨"}
                        </div>
                      ))}

                      {/* Frame corner decorative graphics */}
                      <div className="absolute top-2 left-2 text-[9px] font-mono text-purple-400/80 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        LIVE MEMORY DECODED
                      </div>
                    </div>
                  </div>

                  {/* Viewport Control Hub */}
                  <div className="flex items-center justify-between mt-4 bg-black/30 p-3 rounded-xl border border-white/5 relative z-10">
                    <span className="text-[11px] font-mono text-purple-300 bg-purple-950/50 px-3 py-1 rounded-full border border-purple-500/20">
                      ⏱️ {currentTime.toFixed(2)}s / {activeProject.duration.toFixed(0)}s
                    </span>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setCurrentTime(0);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        title="Go back to frame 0"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] active:scale-90"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-white text-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white text-white translate-x-[1px]" />
                        )}
                      </button>

                      <button 
                        onClick={() => {
                          // Preview fast forward
                          setCurrentTime(prev => Math.min(prev + 2, activeProject.duration));
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
                        title="Forward 2 seconds"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => {
                          // Fast volume Toggle
                          if (activeClip && activeClip.volume !== undefined) {
                            handleUpdateVolume(activeClip.id, activeClip.volume > 0 ? 0 : 100);
                          }
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xs flex items-center gap-1"
                      >
                        <Volume2 className="w-4 h-4" />
                        {activeClip && activeClip.volume !== undefined ? `${activeClip.volume}%` : ""}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Cloud Assisted AI Command Suite */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                  
                  {/* AI Assistant Card component to run Gemini Proxy requests */}
                  <div className="flex-1 bg-gradient-to-b from-[#110c1c] to-[#07030e] border border-purple-500/15 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200">Gemini AI Studio</h3>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Cloud status dynamic and healthy"></span>
                      </div>

                      <p className="text-[11px] text-purple-400 leading-relaxed mb-4">
                        Leverage Gemini models directly on server-side to generate subtitle script translations, suggest aesthetic presets, or draft viral short scripts.
                      </p>

                      {/* Tool selection Accordion */}
                      <div className="space-y-4">
                        
                        {/* Tool: Smart Subtitles Generator */}
                        <div className="border border-purple-900/40 rounded-xl p-3 bg-purple-950/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-purple-300">Auto Subtitles</span>
                            <div className="flex items-center gap-1">
                              <select 
                                value={subtitleLanguage} 
                                onChange={(e) => setSubtitleLanguage(e.target.value)}
                                className="bg-purple-950 text-purple-300 text-[10px] px-1 py-0.5 rounded border border-purple-800 focus:outline-none"
                              >
                                <option value="English">English</option>
                                <option value="Bangla">Bangla (বাংলা)</option>
                              </select>
                            </div>
                          </div>

                          <button 
                            onClick={fetchAISubtitles}
                            disabled={isGeneratingSubtitles}
                            className="w-full py-1.5 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/20 rounded-lg text-[11px] text-purple-300 font-medium transition-all flex items-center justify-center gap-1"
                          >
                            {isGeneratingSubtitles ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                            )}
                            {isGeneratingSubtitles ? "GENERATING SCRIPTS..." : "GENERATE CAPTIONS"}
                          </button>
                        </div>

                        {/* Tool: Custom AI LUT Color Filter advisor */}
                        <div className="border border-purple-900/40 rounded-xl p-3 bg-purple-950/10">
                          <label className="block text-[10px] uppercase font-mono text-purple-300 mb-1.5">
                            AI Vibe-To-LUT Generator
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={aiVibePrompt}
                              onChange={(e) => setAiVibePrompt(e.target.value)}
                              placeholder="e.g., cyber sunset, retro vibe..."
                              className="flex-1 bg-black/40 border border-purple-900/60 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                            <button
                              onClick={triggerLUTAdvisor}
                              disabled={isFetchingLut}
                              className="px-2 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white"
                              title="Fetch suggestions"
                            >
                              GET
                            </button>
                          </div>

                          {calculatedLUT && (
                            <div className="mt-2.5 p-2 bg-black/60 rounded border border-purple-500/20 text-[10px] text-purple-300 space-y-1">
                              <p className="font-semibold text-amber-200">✓ Suggestions Loaded:</p>
                              <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                                <span>Cont: {calculatedLUT.contrast}%</span>
                                <span>Sat: {calculatedLUT.saturation}%</span>
                                <span>Warm: {calculatedLUT.warmth}</span>
                                <span>Grain: {calculatedLUT.grain}%</span>
                              </div>
                              <p className="italic text-[9px] text-zinc-400 border-t border-purple-950/60 pt-1 leading-tight mt-1">
                                {calculatedLUT.explanation}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Tool: AI Viral Shorts Creator */}
                        <div className="border border-purple-900/40 rounded-xl p-3 bg-purple-950/10">
                          <label className="block text-[10px] uppercase font-mono text-purple-300 mb-1.5">
                            Shorts Hook Script Creator
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={aiTopic}
                              onChange={(e) => setAiTopic(e.target.value)}
                              placeholder="Describe your video topic..."
                              className="flex-1 bg-black/40 border border-purple-900/60 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                            <button
                              onClick={generateShortsScript}
                              disabled={isFetchingScript}
                              className="px-2 bg-[#120a21] hover:bg-purple-900/20 text-xs text-purple-300 border border-purple-800/60 rounded"
                            >
                              HOOK
                            </button>
                          </div>

                          {suggestedScript && (
                            <div className="mt-2 p-2 bg-black/75 rounded border border-purple-500/20 text-[10px] space-y-1.5 max-h-36 overflow-y-auto timeline-scrollbar">
                              <p className="font-bold text-amber-300">💥 Suggested Hooks:</p>
                              <ul className="list-disc list-inside text-[9px] text-purple-200 space-y-1">
                                {suggestedScript.titles.slice(0, 2).map((title, id) => (
                                  <li key={id}>{title}</li>
                                ))}
                              </ul>
                              <p className="font-bold text-amber-300 border-t border-purple-950/60 pt-1">🎬 Micro Script:</p>
                              <div className="space-y-1 text-[9px] text-zinc-300 leading-tight">
                                {suggestedScript.script.map((sc, scIdx) => (
                                  <div key={scIdx}>
                                    <span className="text-purple-400 font-bold font-mono uppercase">{sc.stage}:</span> {sc.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-950/40">
                      <span className="text-[10px] text-purple-400/80 uppercase font-mono block text-center">
                        ⚡ Auto-Save Engine Enabled
                      </span>
                    </div>
                  </div>

                  {/* Quick Preset Asset Picker Drawer */}
                  <div className="bg-[#100b1a] border border-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">Media Bin</h4>
                      <label className="text-[10px] text-purple-400 font-medium underline cursor-pointer hover:text-white">
                        <span>+ Import File</span>
                        <input 
                          type="file" 
                          accept="video/*,audio/*,image/*" 
                          onChange={handleLocalFileUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto timeline-scrollbar">
                      {/* Media sample listings */}
                      {SAMPLE_MEDIA_LIST.map((med) => (
                        <div 
                          key={med.id} 
                          onClick={() => addClipToTimeline(med)}
                          className="group bg-black/40 rounded-xl overflow-hidden border border-purple-950/60 hover:border-purple-500/40 transition-all cursor-pointer relative"
                        >
                          <img 
                            src={med.thumbnail} 
                            alt={med.name} 
                            className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="p-1 px-1.5 bg-black/80 flex items-center justify-between text-[9px]">
                            <span className="truncate max-w-[55px] text-zinc-300 font-mono">{med.name}</span>
                            <span className="text-purple-400 font-bold bg-purple-950/80 px-1 rounded">{med.duration}s</span>
                          </div>
                        </div>
                      ))}

                      {/* Render custom uploader files */}
                      {uploadedFiles.map((med) => (
                        <div 
                          key={med.id} 
                          onClick={() => addClipToTimeline(med)}
                          className="group bg-amber-950/20 rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-400 transition-all cursor-pointer relative"
                        >
                          <img 
                            src={med.thumbnail} 
                            alt={med.name} 
                            className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="p-1 px-1.5 bg-black/90 flex items-center justify-between text-[9px]">
                            <span className="truncate max-w-[55px] text-amber-300 font-mono">{med.name}</span>
                            <span className="text-purple-450 font-bold bg-purple-950/80 px-1 rounded">{med.duration}s</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick overlay generators */}
                    <div className="mt-3 pt-3 border-t border-purple-950/40 grid grid-cols-2 gap-2 text-[10px]">
                      <button 
                        onClick={() => {
                          const customMediaItem: MediaClip = {
                            id: `txt_${Date.now()}`,
                            name: customTextContent,
                            duration: 4,
                            url: "",
                            thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=200",
                            type: "image"
                          };
                          addClipToTimeline(customMediaItem, LayerType.TEXT);
                        }}
                        className="py-1 bg-pink-900/20 hover:bg-pink-900/40 border border-pink-500/20 rounded text-pink-300 flex items-center justify-center gap-1 font-mono font-bold"
                      >
                        <Type className="w-3.5 h-3.5" />
                        + ADD TEXT Layer
                      </button>

                      <button 
                        onClick={() => {
                          const customMediaItem: MediaClip = {
                            id: `stk_${Date.now()}`,
                            name: "Emoji Overlay",
                            duration: 3,
                            url: "",
                            thumbnail: "",
                            type: "image"
                          };
                          addClipToTimeline(customMediaItem, LayerType.STICKER);
                        }}
                        className="py-1 bg-yellow-900/20 hover:bg-yellow-900/40 border border-yellow-500/20 rounded text-yellow-300 flex items-center justify-center gap-1 font-mono font-bold"
                      >
                        <Smile className="w-3.5 h-3.5" />
                        + ADD STICKER
                      </button>
                    </div>

                    {/* Custom Text Props Settings Box */}
                    <div className="mt-3 bg-black/35 rounded-lg border border-purple-900/30 p-2 text-[10px]">
                      <span className="text-zinc-400 block mb-1">Text Settings:</span>
                      <input 
                        type="text" 
                        value={customTextContent} 
                        onChange={(e) => setCustomTextContent(e.target.value)}
                        placeholder="Text / Bangla font text..."
                        className="w-full bg-black/70 border border-purple-900 px-2 py-1 rounded text-white focus:outline-none focus:border-purple-500 text-xs mb-1.5"
                      />
                      <div className="flex gap-1.5">
                        {["neon", "gradient", "bengali"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setCustomTextStyle(s as any)}
                            className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono ${
                              customTextStyle === s 
                                ? "bg-purple-900 border border-purple-500 text-white" 
                                : "bg-black text-purple-400"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Dynamic Action Multi Track Editing Controllers Panel relative inside viewports */}
              {activeClip && (
                <div className="mx-6 px-4 py-3 bg-[#0f0a1d] rounded-xl border border-purple-500/30 flex flex-wrap items-center justify-between gap-4 relative z-20">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                      🎬 SELECTED CLIP:
                    </span>
                    <span className="text-xs font-mono text-white max-w-[150px] truncate">{activeClip.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-400 uppercase font-mono">
                      {activeClip.type}
                    </span>
                  </div>

                  {/* Actions Bar for selected clip */}
                  <div className="flex items-center gap-3">
                    
                    {/* Trim and duration controllers */}
                    <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-purple-950">
                      <span className="text-[10px] text-zinc-500 font-mono">DURATION:</span>
                      <input 
                        type="number" 
                        min={1} 
                        max={15} 
                        value={activeClip.duration} 
                        onChange={(e) => {
                          const nVal = parseFloat(e.target.value) || 3;
                          const next = activeProject.clips.map(c => c.id === activeClip.id ? { ...c, duration: nVal } : c);
                          onUpdateClips(next);
                        }}
                        className="w-10 bg-transparent text-purple-300 text-xs text-center font-bold font-mono focus:outline-none"
                      />
                      <span className="text-[10px] text-zinc-500">s</span>
                    </div>

                    {/* Filter and Matrix picker */}
                    {activeClip.type === LayerType.VIDEO && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">LUTS:</span>
                        <select 
                          value={activeClip.effects?.[0] || "normal"}
                          onChange={(e) => handleAddFilter(activeClip.id, e.target.value)}
                          className="bg-black text-purple-400 text-[10px] p-1 rounded border border-purple-900 focus:outline-none"
                        >
                          {VIDEO_EFFECTS.map((fx) => (
                            <option key={fx.id} value={fx.id}>{fx.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Transitions control menu */}
                    {activeClip.type === LayerType.VIDEO && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] md:inline text-zinc-500 uppercase font-bold">TRANSITION:</span>
                        <select 
                          value={activeClip.transition || "none"}
                          onChange={(e) => handleAddTransition(activeClip.id, e.target.value)}
                          className="bg-black text-amber-300 text-[10px] p-1 rounded border border-purple-900 focus:outline-none"
                        >
                          {TRANSITION_EFFECTS.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Split scissor click clip */}
                    <button 
                      onClick={handleSplitClip}
                      className="p-1.5 rounded bg-purple-950 hover:bg-purple-900 border border-purple-500/20 text-purple-300 text-[10px] flex items-center gap-1 font-mono transition-colors"
                      title="Split clip at active playhead scrubber time"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      SPLIT
                    </button>

                    {/* Delete item clip */}
                    <button 
                      onClick={() => handleDeleteClip(activeClip.id)}
                      className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 text-red-300 text-[10px]"
                      title="Delete clip from timeline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </div>
              )}

              {/* TIMELINE RUNTIME REGULATION INTERFACES: MULTI TRACK TIMELINE */}
              <div className="h-64 bg-black/60 backdrop-blur-xl border-t border-white/10 flex flex-col relative shadow-inner overflow-hidden select-none">
                
                {/* Timeline Header bar with menu buttons */}
                <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-[#0e0a1a]">
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <button 
                      onClick={() => setSelectedLayerType(LayerType.VIDEO)}
                      className={`text-[11px] font-mono tracking-wider transition-all h-10 px-2 uppercase ${
                        selectedLayerType === LayerType.VIDEO 
                          ? "text-purple-400 border-b-2 border-purple-500 font-bold" 
                          : "text-zinc-500"
                      }`}
                    >
                      VIDEO TRACK
                    </button>
                    <button 
                      onClick={() => setSelectedLayerType(LayerType.AUDIO)}
                      className={`text-[11px] font-mono tracking-wider transition-all h-10 px-2 uppercase ${
                        selectedLayerType === LayerType.AUDIO 
                          ? "text-purple-400 border-b-2 border-purple-500 font-bold" 
                          : "text-zinc-500"
                      }`}
                    >
                      AUDIO MIXER
                    </button>
                    <button 
                      onClick={() => setSelectedLayerType(LayerType.TEXT)}
                      className={`text-[11px] font-mono tracking-wider transition-all h-10 px-2 uppercase ${
                        selectedLayerType === LayerType.TEXT 
                          ? "text-purple-400 border-b-2 border-purple-500 font-bold" 
                          : "text-zinc-500"
                      }`}
                    >
                      OVERLAYS & CAPTIONS
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                      <span>SNAP: ON</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    </div>

                    <div className="h-4 w-[1px] bg-white/10" />

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          // Interactive timeline undo simulation
                          alert("Undo success. Active layers state restored.");
                        }}
                        className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white"
                        title="Undo change"
                      >
                        <Undo className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          alert("Redo queue compiled.");
                        }}
                        className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white"
                        title="Redo change"
                      >
                        <Redo className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline Multi Layer Track Blocks scroll container */}
                <div className="flex-1 overflow-x-auto overflow-y-auto timeline-scrollbar relative p-4 bg-[#090512]">
                  
                  {/* Absolute glowing playhead indicator pointer */}
                  <div 
                    className="absolute top-0 bottom-0 w-[2px] bg-purple-500 z-10 shadow-[0_0_12px_rgba(168,85,247,0.9)] transition-all pointer-events-none"
                    style={{ left: `${(currentTime / activeProject.duration) * 100}%` }}
                  >
                    <div className="absolute top-0 -translate-x-1/2 w-3.5 h-3.5 bg-purple-500 rotate-45 border border-white/60"></div>
                  </div>

                  {/* Dynamic background layout track blocks */}
                  <div className="w-full flex flex-col gap-3 min-w-[650px] relative pb-8">
                    
                    {/* Track Module 1: TEXT OVERLAYS AND STICKERS */}
                    <div className="flex items-center gap-4">
                      <span className="w-12 text-[10px] text-zinc-500 font-bold uppercase font-mono tracking-wider">
                        TEXT T1
                      </span>
                      <div className="h-10 flex-1 bg-purple-950/10 border border-purple-500/10 rounded-lg relative flex items-center overflow-hidden">
                        {activeProject.clips
                          .filter(c => c.type === LayerType.TEXT || c.type === LayerType.STICKER)
                          .map((clip) => {
                            const leftOffset = (clip.startTime / activeProject.duration) * 100;
                            const widthPercent = (clip.duration / activeProject.duration) * 100;
                            return (
                              <div
                                key={clip.id}
                                onClick={() => setSelectedClipId(clip.id)}
                                className={`absolute h-7 rounded border text-[10px] px-2.5 flex items-center justify-between font-mono font-bold cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all overflow-hidden ${
                                  selectedClipId === clip.id 
                                    ? `${clip.color} border-purple-400 glow-active` 
                                    : `${clip.color} border-white/10 opacity-70`
                                }`}
                                style={{ left: `${leftOffset}%`, width: `${widthPercent}%` }}
                              >
                                <span className="truncate">{clip.name}</span>
                                {clip.type === LayerType.STICKER && (
                                  <span className="ml-1 text-xs">{clip.stickerProps?.emoji}</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Track Module 2: VIDEO TRACK LAYERS */}
                    <div className="flex items-center gap-4">
                      <span className="w-12 text-[10px] text-zinc-500 font-bold uppercase font-mono tracking-wider">
                        VIDEO V1
                      </span>
                      <div className="h-14 flex-1 bg-white/5 border border-white/10 rounded-lg relative flex items-center overflow-hidden">
                        {activeProject.clips
                          .filter(c => c.type === LayerType.VIDEO)
                          .map((clip) => {
                            const leftOffset = (clip.startTime / activeProject.duration) * 100;
                            const widthPercent = (clip.duration / activeProject.duration) * 100;
                            return (
                              <div
                                key={clip.id}
                                onClick={() => setSelectedClipId(clip.id)}
                                className={`absolute h-11 rounded border text-xs px-2 flex flex-col justify-center cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all overflow-hidden ${
                                  selectedClipId === clip.id 
                                    ? `${clip.color} border-purple-400 glow-active` 
                                    : `${clip.color} border-white/10 opacity-75`
                                }`}
                                style={{ left: `${leftOffset}%`, width: `${widthPercent}%` }}
                              >
                                <div className="flex items-center justify-between w-full font-bold">
                                  <span className="truncate font-sans font-medium text-[11px] text-white">
                                    {clip.name}
                                  </span>
                                  {clip.transition && clip.transition !== "none" && (
                                    <span className="text-[8px] bg-purple-950 text-amber-300 font-mono px-1 rounded">
                                      {clip.transition}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-[9px] text-purple-300">
                                  {clip.duration.toFixed(1)}s • {clip.effects?.[0] || "No Lut"}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Track Module 3: AUDIO AMBIENT SOUNDTRACKS */}
                    <div className="flex items-center gap-4">
                      <span className="w-12 text-[10px] text-zinc-500 font-bold uppercase font-mono tracking-wider">
                        AUDIO A1
                      </span>
                      <div className="h-11 flex-1 bg-indigo-900/10 border border-indigo-500/10 rounded-lg relative flex items-center">
                        {activeProject.clips
                          .filter(c => c.type === LayerType.AUDIO)
                          .map((clip) => {
                            const leftOffset = (clip.startTime / activeProject.duration) * 100;
                            const widthPercent = (clip.duration / activeProject.duration) * 100;
                            return (
                              <div
                                key={clip.id}
                                onClick={() => setSelectedClipId(clip.id)}
                                className={`absolute h-8 rounded border text-[10px] px-2 flex items-center justify-between font-mono cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all overflow-hidden ${
                                  selectedClipId === clip.id 
                                    ? `${clip.color} border-indigo-400 glow-active` 
                                    : `${clip.color} border-white/10 opacity-70`
                                }`}
                                style={{ left: `${leftOffset}%`, width: `${widthPercent}%` }}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <Music className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  <span className="truncate font-medium text-[10px] text-zinc-300">{clip.name}</span>
                                </div>
                                <span className="text-[9px] text-zinc-500">
                                  Vol: {clip.volume}%
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Render High-Fidelity Professional Export Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center text-white z-50 p-6">
          <div className="w-full max-w-md bg-gradient-to-b from-[#160e29] to-[#080312] border border-purple-500/30 p-8 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/20 blur-3xl rounded-full" />
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-purple-900/10 border border-purple-500 flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-purple-300" />
              </div>

              <h3 className="text-xl font-display font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-indigo-200">
                EXPORT ARCHITECTURE STANDBY
              </h3>
              <p className="text-xs text-purple-400 leading-relaxed mt-2 max-w-xs mx-auto">
                Compiles layers, matrix transitions, and subtitles on Cloud GPU nodes using FFmpeg bindings.
              </p>

              {/* Rendering Stats Selector */}
              {!exportSuccess && (
                <div className="my-6 grid grid-cols-2 gap-4 text-left border border-purple-950/60 p-4 rounded-2xl bg-[#090514]/40">
                  <div>
                    <label className="block text-[9px] text-purple-400 uppercase font-mono mb-1">FPS Standard</label>
                    <select 
                      value={exportFps} 
                      onChange={(e) => setExportFps(parseInt(e.target.value))}
                      className="w-full bg-black/80 border border-purple-900/50 rounded p-1.5 text-xs text-white uppercase focus:outline-none"
                    >
                      <option value={30}>30 FPS Standard</option>
                      <option value={60}>60 FPS Ultra Cinematic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-purple-400 uppercase font-mono mb-1">Quality Channel</label>
                    <select 
                      value={exportResolution} 
                      onChange={(e) => setExportResolution(e.target.value)}
                      className="w-full bg-black/80 border border-purple-900/50 rounded p-1.5 text-xs text-white Focus:outline-none"
                    >
                      <option value="1080p">1080p FHD Best Standard</option>
                      <option value="4K">4K UHD Cinematic</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Progress visual section */}
              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-xs font-mono text-purple-300">
                  <span>{exportSuccess ? "FFmpeg Render Finished" : "Multiplexing tracks..."}</span>
                  <span>{exportProgress}%</span>
                </div>

                <div className="w-full h-2.5 bg-purple-950 rounded-full overflow-hidden relative border border-purple-800/20">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-150 ease-out"
                    style={{ width: `${exportProgress}%` }}
                  />
                  {!exportSuccess && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-pulse" />
                  )}
                </div>

                <span className="block text-[9px] font-mono text-purple-500/80 uppercase">
                  ACTIVE PIPELINE: WebGPU • WASM TRANSCODE • H.264 BITRATE
                </span>
              </div>

              {/* Finalized action paths */}
              {exportSuccess ? (
                <div className="mt-8 space-y-3">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Render fully finished! Asset download ready.</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsExporting(false);
                        setExportSuccess(false);
                      }}
                      className="flex-1 py-2.5 bg-[#120a21] hover:bg-purple-900/20 text-purple-300 border border-purple-900/40 rounded-xl text-xs font-semibold tracking-wider transition-colors"
                    >
                      BACK TO TIMELINE
                    </button>
                    <a
                      href={currentMedia?.thumbnail}
                      download={`UltraEdits_${activeProject?.name || "TokyoEdit"}.mp4`}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Download className="w-3.5 h-3.5" />
                      DOWNLOAD MP4
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <button
                    onClick={() => {
                      setIsExporting(false);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-medium underline"
                  >
                    Cancel Render Process
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Persistent Status Frame Footer - Perfect Immersive Styling */}
      <footer className="h-8 bg-[#0a0614] border-t border-white/5 flex items-center px-6 justify-between text-[11px] text-zinc-500 relative z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[10px] text-purple-400 uppercase font-mono tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
            WASM GPURENDER STABLE
          </span>
          <span className="hidden sm:inline font-mono">CACHE USE: 124MB / 8.0GB RESIDENT</span>
        </div>
        <div className="flex gap-4 font-mono text-[10px]">
          <span>PROPERTIES: 1920x1080 @ 60FPS</span>
          <span className="hidden sm:inline">•</span>
          <span>LANG: BENGALI & ENGLISH COMPILING</span>
        </div>
      </footer>

    </div>
  );
}
