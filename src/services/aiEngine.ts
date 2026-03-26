import { GoogleGenAI, Type } from "@google/genai";
import companyDocs from "../../docs/companies.json";

// Initialize the Gemini API
// The API key is handled by the platform via process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CompanyAnalysis {
  survivalChance: number; // 0-100
  prediction: string;
  strengths: string[];
  weaknesses: string[];
  competitiveLandscape: string;
  verdict: "SURVIVE" | "ACQUIRED" | "FAIL";
  suggestedStrategy: string;
  inferredDomain: string;
  suggestedTerritoryId: "llm" | "cloud" | "semis";
  coordinates: { lat: number; lng: number };
}

export const analyzeCompanySurvival = async (
  companyName: string,
  description: string,
  funding: string,
  teamSize: number
): Promise<CompanyAnalysis> => {
  const model = "gemini-3.1-pro-preview"; // Using Pro for complex reasoning

  const systemInstruction = `
    You are the "Global Stack Survival Engine," a high-fidelity AI validator for new tech ventures in a winner-take-all digital ecosystem.
    Your goal is to predict the survival of a new company based on the current competitive landscape of "The Global Stack."
    
    Current Market Data (The Global Stack):
    ${JSON.stringify(companyDocs, null, 2)}

    Evaluation Criteria:
    1. Domain Inference: Based on the description, identify which domain the company belongs to (e.g., Intelligence, Infrastructure, Compute, Foundry, Lithography).
    2. Territory Placement: Assign the company to one of the three main territories:
       - "llm" (LLM Highlands): For Intelligence/AI software companies.
       - "cloud" (Cloud Tundra): For Infrastructure/Cloud/Storage companies.
       - "semis" (Semiconductor Archipelago): For Compute/Hardware/Foundry companies.
    3. Coordinates: Suggest a specific latitude and longitude within that territory's range for visual placement.
       - llm: lat 15 to 45, lng 30 to 60
       - cloud: lat -45 to -5, lng -55 to -15
       - semis: lat -25 to 15, lng 80 to 125
    4. Competitive Threat: Which "Big Tech" titans are most likely to crush or acquire this company?
    5. Moat Analysis: Does the company have a defensible technical or market advantage?
    
    You must provide a realistic, non-deterministic assessment. Be critical. Most startups fail or get swallowed.
  `;

  const prompt = `
    Analyze the following new company:
    Name: ${companyName}
    Description: ${description}
    Initial Funding: ${funding}
    Team Size: ${teamSize}
    
    Provide a detailed survival analysis in JSON format.
  `;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            survivalChance: { type: Type.NUMBER, description: "0-100 probability of independent survival" },
            prediction: { type: Type.STRING, description: "A detailed 2-3 sentence prediction of the company's future" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            competitiveLandscape: { type: Type.STRING, description: "Analysis of which giants pose the most threat" },
            verdict: { type: Type.STRING, enum: ["SURVIVE", "ACQUIRED", "FAIL"] },
            suggestedStrategy: { type: Type.STRING, description: "What the company should do to increase survival odds" },
            inferredDomain: { type: Type.STRING, description: "The industry domain inferred from the description" },
            suggestedTerritoryId: { type: Type.STRING, enum: ["llm", "cloud", "semis"] },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              },
              required: ["lat", "lng"]
            }
          },
          required: ["survivalChance", "prediction", "strengths", "weaknesses", "competitiveLandscape", "verdict", "suggestedStrategy", "inferredDomain", "suggestedTerritoryId", "coordinates"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as CompanyAnalysis;
  } catch (error) {
    console.error("AI Engine Error:", error);
    throw new Error("Failed to analyze company survival. The engine is offline.");
  }
};
