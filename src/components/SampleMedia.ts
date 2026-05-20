import { MediaClip } from "../types";

export const SAMPLE_MEDIA_LIST: MediaClip[] = [
  {
    id: "v1",
    name: "Cyberpunk Tokyo Neon Drive",
    duration: 12,
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop", // placeholder or simulation thumb
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    type: "video"
  },
  {
    id: "v2",
    name: "Golden Hour Cinematic Surf",
    duration: 8,
    url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
    type: "video"
  },
  {
    id: "v3",
    name: "Dhaka Rain & Yellow Rickshaw",
    duration: 15,
    url: "https://images.unsplash.com/photo-1566847438217-76612748b533?q=80&w=1200&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=600&auto=format&fit=crop",
    type: "video"
  },
  {
    id: "v4",
    name: "Vibrant Space Nebula Portal",
    duration: 6,
    url: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1200&auto=format&fit=crop",
    thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop",
    type: "video"
  },
  {
    id: "a1",
    name: "Lo-Fi Midnight Beat (Chilled)",
    duration: 35,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop",
    type: "audio"
  },
  {
    id: "a2",
    name: "Retro Synthwave Drive (Upbeat)",
    duration: 28,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    thumbnail: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=200&auto=format&fit=crop",
    type: "audio"
  },
  {
    id: "a3",
    name: "Acoustic Sunset Vibe (Warm Guitar)",
    duration: 40,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    thumbnail: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=200&auto=format&fit=crop",
    type: "audio"
  }
];

export const TRANSITION_EFFECTS = [
  { id: "none", name: "None", duration: 0.5 },
  { id: "fade", name: "Fade Black", duration: 0.8 },
  { id: "zoom", name: "Kinetic Zoom in", duration: 0.6 },
  { id: "slide", name: "Express Slide Right", duration: 0.7 },
  { id: "flash", name: "Bright White Flash", duration: 1.0 },
  { id: "spin", name: "3D Spin Out", duration: 0.8 },
  { id: "blur", name: "Smooth Light Blur", duration: 0.8 }
];

export const VIDEO_EFFECTS = [
  { id: "normal", name: "Original Source", style: "filter-none" },
  { id: "vhs", name: "VHS Analog Retro", style: "sepia saturate-150 hue-rotate-15 contrast-125 saturate-50 brightness-110" },
  { id: "cinematic", name: "Cinematic Warm LUT", style: "contrast-115 brightness-95 saturate-125 sepia-[0.15]" },
  { id: "rgb_glitch", name: "RGB Matrix Glitch", style: "hue-rotate-90 saturate-200 contrast-150" },
  { id: "noir", name: "Classic Silver Noir", style: "grayscale contrast-135 brightness-95" },
  { id: "vintage", name: "35mm Vintage Faded", style: "sepia saturate-75 brightness-105 contrast-90" }
];
