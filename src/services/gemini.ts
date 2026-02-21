import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export interface ResearchResult {
  text: string;
  sources: Array<{ uri: string; title: string }>;
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async conductResearch(query: string, urls: string[] = []): Promise<ResearchResult> {
    const tools: any[] = [{ googleSearch: {} }];
    if (urls.length > 0) {
      tools.push({ urlContext: {} });
    }

    // Construct a prompt that encourages deep synthesis
    const prompt = urls.length > 0 
      ? `Research the following query: "${query}". 
         Use the provided URLs as primary context, but feel free to use Google Search to fill in gaps or provide broader context. 
         Synthesize the information into a structured, insightful report.
         URLs to consider: ${urls.join(", ")}`
      : `Conduct deep research on: "${query}". 
         Synthesize multiple perspectives and provide a comprehensive, insightful report with clear sections.`;

    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools,
        systemInstruction: "You are Aura, a world-class research assistant. Your goal is to provide deep, synthesized insights rather than just surface-level summaries. Use a sophisticated, editorial tone. Structure your reports with clear headings, bullet points for key facts, and a 'Synthesis' section at the end.",
      },
    });

    const text = response.text || "No insights generated.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      }));

    return { text, sources };
  }
}

export const geminiService = new GeminiService();
