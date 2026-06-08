import { GoogleGenAI, Type } from "@google/genai";
import { DashboardCard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DASHBOARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['metric', 'chart', 'list', 'insights', 'engagement'] },
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          visualization: { type: Type.STRING, enum: ['bar', 'line', 'pie', 'velocity', 'progress', 'metric-only'] },
          data: { type: Type.OBJECT },
          actions: { type: Type.ARRAY, items: { type: Type.STRING } },
          footer: { type: Type.STRING },
          width: { type: Type.STRING, enum: ['full', 'half', 'third'] },
          codeSnippet: { type: Type.STRING, description: "A MINIMAL React/Tailwind blueprint. Max 10 lines." },
          developerNotes: { type: Type.STRING, description: "Technical implementation details." }
        },
        required: ['id', 'type', 'title', 'visualization', 'data', 'codeSnippet']
      }
    }
  },
  required: ['cards']
};

export async function generateDashboard(prompt: string): Promise<DashboardCard[]> {
  const systemInstruction = `
    You are an AI Hotel Analytics Specialist. Create high-fidelity dashboard prototypes.
    
    STYLE:
    - Shadcn Studio aesthetic: 2px borders, sharp corners, slate-900 shadows.
    - Colors: Slate-900, Orange-500 (Primary), Indigo-500 (Secondary), Emerald-500 (Trend Up).
    
    MOCK DATA REQUIREMENTS:
    - RevPAR: $150-$400, ADR: $200-$500, Occupancy: 65%-95%.
    - Lead Times: 0-60 days.
    - Stay Velocity: Day-over-day occupancy changes.
    - You MUST generate realistic MOCK DATA that matches these ranges.
    
    DATA STRUCTURES:
    - 'bar', 'line', 'velocity': data: Array<{ name: string, value: number, value2?: number }>
    - 'pie', 'progress': data: Array<{ name: string, value: number }>
    - 'metric-only': data: { value: string, trend: { value: number, label: string, isUp: boolean }, list?: Array<{ label: string, value: string, trend?: number }> }
    
    Return exactly 4-5 cards. No markdown.
  `;

  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Generate a hotel dashboard prototype for: ${prompt}` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: DASHBOARD_SCHEMA,
        temperature: 0.1,
      }
    });

    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed.cards || [];
  } catch (error) {
    console.error("LuxeMetric Data Engine Error:", error);
    return [];
  }
}
