import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client lazily to prevent crashing if the key is missing
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// AI Subtitles generator proxy
app.post("/api/ai/subtitles", async (req, res) => {
  const { videoName, theme, duration, language = "English" } = req.body;
  try {
    const ai = getAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a subtitle script for a movie clip titled "${videoName || "Epic Action Clip"}" with a "${theme || "cinematic"}" vibe. The clip is ${duration || 10} seconds long. Return a list of subtitles in JSON format with time (in seconds) and stylish caption text. Language should be ${language}. Limit to 3-5 stylish captions fitting the timing. Return pure JSON containing an array of objects like this: [{"start": 0.5, "end": 2.5, "text": "Sub representation"}]`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "[]";
      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json({ success: true, subtitles: parsed, provider: "Gemini AI" });
      } catch (err) {
        // Fallback if parsing failed
        console.warn("Parsing AI subtitles failed, using structured fallback", responseText);
      }
    }

    // High fidelity beautiful localized subtitles fallback
    const mockSubsMap: Record<string, Array<{start: number, end: number, text: string}>> = {
      Bangla: [
        { start: 0.5, end: 3.2, text: "উগ্র এডিটস - সীমাহীন ভিডিও সম্পাদনা 🎬" },
        { start: 4.0, end: 7.5, text: "প্রতিটি ফ্রেমে নতুনত্বের ছোঁয়া দিয়ে অসাধারণ করুন!" },
        { start: 8.0, end: 11.5, text: "এখনই আপনার সেরা ভিডিওটি তৈরি করুন উルトラ এডিটস দিয়ে ✨" }
      ],
      English: [
        { start: 0.5, end: 3.2, text: "Ultra Edits: Edit without limits 🎬" },
        { start: 4.0, end: 7.5, text: "Infusing power and precision in every single frame!" },
        { start: 8.0, end: 11.5, text: "Render spectacular cinematic experiences instantly ✨" }
      ]
    };
    const subtitles = mockSubsMap[language] || mockSubsMap["English"];
    return res.json({
      success: true,
      subtitles,
      provider: "Ultra Local AI Engine (Fallback)"
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// AI Vibe-to-LUT Colorizer
app.post("/api/ai/lut", async (req, res) => {
  const { vibePrompt } = req.body;
  try {
    const ai = getAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `The video creator wants to edit a video with the mood "${vibePrompt || "warm vintage sunset"}". Suggest a custom 3D LUT configuration including color matrix modifiers, saturation level, contrast bias, warmth slider (-100 to 100), tint (-100 to 100), and grain intensity (0 to 100). Return your response in JSON format like this: { "saturation": 1.2, "contrast": 1.1, "warmth": 15, "tint": -5, "grain": 20, "explanation": "Brief tip for editing" }`,
        config: {
          responseMimeType: "application/json",
        }
      });
      const data = JSON.parse((response.text || "{}").trim());
      return res.json({ success: true, lutSettings: data, provider: "Gemini AI" });
    }

    // Default beautiful LUT settings mapping common prompts
    const input = (vibePrompt || "").toLowerCase();
    let mockLut = { saturation: 115, contrast: 110, warmth: 25, tint: -5, grain: 20, explanation: "Warm cinematic glow optimization with subtle golden tones." };
    if (input.includes("cyber") || input.includes("neon") || input.includes("glitch")) {
      mockLut = { saturation: 145, contrast: 125, warmth: -40, tint: 30, grain: 45, explanation: "Cool cyber-holographic matrix with saturated blues and neon purples." };
    } else if (input.includes("film") || input.includes("retro") || input.includes("vhs")) {
      mockLut = { saturation: 85, contrast: 90, warmth: 15, tint: 10, grain: 75, explanation: "Emulated 35mm physical film stock grain with faded black levels." };
    } else if (input.includes("mono") || input.includes("noir") || input.includes("black")) {
      mockLut = { saturation: 0, contrast: 140, warmth: -10, tint: 0, grain: 35, explanation: "High contrast silver-halide noir look with pristine dark values." };
    }
    return res.json({ success: true, lutSettings: mockLut, provider: "Ultra Local Color Engine" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// AI Smart Title & Reels Script Generator
app.post("/api/ai/script", async (req, res) => {
  const { topic } = req.body;
  try {
    const ai = getAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Suggest 3 high-engagement scroll-stopping titles for an social media video/shorts on "${topic || "gaming setups"}", plus a short 15-second script structure grouped by 4 stages (Hook, Problem, Solution, Outro). Give the output as JSON format: { "titles": ["...", "...", "..."], "script": [ {"stage": "Hook", "text": "..."}, {"stage": "Problem", "text": "..."}, {"stage": "Solution", "text": "..."}, {"stage": "Outro", "text": "..."} ] }`,
        config: {
          responseMimeType: "application/json",
        }
      });
      const data = JSON.parse((response.text || "{}").trim());
      return res.json({ success: true, script: data, provider: "Gemini AI" });
    }

    // High fidelity prompt based matching
    const fallbackScript = {
      titles: [
        `🔥 The absolute SECRET to mastering ${topic || "video creation"}!`,
        `Don't create another project until you watch this...`,
        `3 editing mistakes ruining your ${topic || "social media"} growth!`
      ],
      script: [
        { stage: "Hook", text: `Stop scrolling! Did you know most content creators get this wrong about ${topic || "video creation"}?` },
        { stage: "Problem", text: "You spend hours editing, but viewers leave in the first three seconds because your timeline lacks dynamic cuts." },
        { stage: "Solution", text: "Using Ultra Edits' 1-click speed ramp transitions keeps the pacing lightning fast and retains maximum viewers!" },
        { stage: "Outro", text: "Hit save on this clip, subscribe to VIP Templates, and let your limits melt away." }
      ]
    };
    return res.json({ success: true, script: fallbackScript, provider: "Ultra AI Copywriter" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Setup Vite Dev server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ultra Edits Server] Standby on Port ${PORT}`);
  });
}

startServer();
