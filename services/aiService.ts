import { GoogleGenAI } from "@google/genai";
import { ShiftResult, AiAnalysis } from "../types";

// In Next.js client components, environment variables need NEXT_PUBLIC_ prefix
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export const analyzeShifts = async (shifts: ShiftResult[]): Promise<AiAnalysis> => {
  if (shifts.length === 0) {
    return { summary: "Add shifts to generate an AI analysis.", tips: [] };
  }

  const prompt = `
    I need a helpful summary of the following overtime and on-call shift calculations for a UK-based payroll context.
    
    Data:
    ${JSON.stringify(shifts.slice(0, 10))} ${shifts.length > 10 ? '...(and more)' : ''}
    
    Rules for calculation provided to the system:
    - Currency: GBP (£)
    - Shift Types: 'overtime' (based on salary rate) and 'on-call' (fixed flat rates).
    - Overtime Rules: Mon-Fri 1.5x, Sat-Sun 1.75x, Bank Holiday 2.0x. Plus unsociable premiums (15% 8pm-11pm, 30% 11pm-6am).
    - On Call Rules: Mon-Fri £1/hr, Sat-Sun £1.25/hr, Bank Holiday £2/hr.
    
    Please provide:
    1. A brief, friendly summary paragraph explaining the total earnings, split between overtime and on-call if relevant.
    2. A list of 3 short, actionable observations or tips (e.g., "On-call weekends are adding up", or "Night overtime is your best earner").
    
    Return JSON format only:
    {
      "summary": "string",
      "tips": ["string", "string", "string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AiAnalysis;

  } catch (error) {
    console.error("AI Analysis Failed", error);
    return {
      summary: "Could not generate analysis at this time.",
      tips: ["Ensure API Key is valid", "Try adding more shift data"]
    };
  }
};