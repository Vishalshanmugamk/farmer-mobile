import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on the server-side with key
// Users configure this via the Secrets panel in the AI Studio UI
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI advisor replies will be pre-made templates.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Farming Intelligence Advisor
app.post("/api/farming-advisor", async (req, res) => {
  try {
    const { query, moduleId, contextData } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getAiClient();
    
    if (!ai) {
      // Fallback answers when API key is missing, so the app remains fully functional and reliable
      let fallbackText = "I am ready to help! However, the GEMINI_API_KEY is not configured in the environment. Here is generic advice:\n\n";
      if (moduleId === "agriculture") {
        fallbackText += "🌾 **Agriculture Tips:** Always water plants either early in the morning or late in the evening to reduce water evaporation. Check soil moisture 2 inches deep before watering. Use balanced nitrogen-phosphorus-potassium (NPK) fertilizer on time.";
      } else if (moduleId === "livestock") {
        fallbackText += "🐄 **Livestock Care:** Ensure milk cows receive at least 40-50 liters of fresh water daily. Provide clean, well-aerated shelter for cows, goats, and hens. Do vaccinations against foot-and-mouth disease on schedule.";
      } else if (moduleId === "harvest") {
        fallbackText += "📦 **Vegetable Marketing:** Harvest produce during cooler pre-dawn hours. Store in a well-ventilated, shaded space. Transport to market immediately to capitalize on freshness and higher pricing.";
      } else if (moduleId === "lorry") {
        fallbackText += "🚚 **Water Lorry Rentals:** For water trucks/lorries, define clear hourly rental limits. Record pre-tank levels. Charge extra for travel over 10 km to maintain profitable wear-and-tear margins.";
      } else {
        fallbackText += "📅 **Household Planning:** Pay EB, wifi, and finance EMIs 3 days before the deadline. Set automated recurring reminders to avoid late penalty charges and power cuts.";
      }
      return res.json({ text: fallbackText });
    }

    let promptContext = "You are 'Kisan Guru' (Farmer Assistant), an expert mobile assistant for farmers. Write practical, very actionable, and easy-to-follow answers. Use helpful headings and bullet points where appropriate. Keep it concise since it is viewed on a mobile phone screen.\n";
    
    if (moduleId) {
      promptContext += `Current Module: ${moduleId}.\n`;
    }
    if (contextData) {
      promptContext += `Relevant entity details: ${JSON.stringify(contextData)}\n`;
    }
    
    promptContext += `Farmer Query: "${query}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
      config: {
        systemInstruction: "You are 'Kisan Guru', a humble and professional farming assistant. You give simple, direct advices using clear bullet points. Write in standard readable paragraphs. Do not mention system paths, codes or internal variables. You can include localized advice (e.g. EB bills means electricity bills in India, water lorry rentals, cow/goat rearing best practices).",
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Advisor API Error:", error);
    res.status(500).json({ error: "Failed to query Kisan Guru Advisor model", details: error.message });
  }
});

// Configure Vite or Serve Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite server in development
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Server integrated Vite Dev Middleware");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Server serving static directory: ${distPath}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Farmer Mobile Companion Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
