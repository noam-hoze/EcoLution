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
  suggestedTerritoryId: "llm" | "cloud" | "semis" | "cyber" | "fintech" | "robotics" | "biotech" | "energy" | "quantum" | "spatial" | "space";
  coordinates: { lat: number; lng: number };
  gapAnalysis: {
    gap: string;
    suggestion: string;
  };
  dueDiligence: {
    credibilityScore: number; // 0-100
    assessment: string;
  };
}

export const analyzeCompanySurvival = async (
  companyName: string,
  description: string,
  funding: string,
  teamSize: number,
  founderLinkedIn: string[]
): Promise<CompanyAnalysis> => {
  const model = "gemini-3.1-pro-preview"; // Using Pro for complex reasoning

  const systemInstruction = `
    You are the "Global Stack Survival Engine," a high-fidelity AI validator for new tech ventures in a winner-take-all digital ecosystem.
    Your goal is to predict the survival of a new company based on the current competitive landscape of "The Global Stack."
    
    Current Market Data (The Global Stack):
    ${JSON.stringify(companyDocs, null, 2)}

    Evaluation Criteria:
    1. Domain Inference: Based on the description, identify which domain the company belongs to (e.g., Intelligence, Infrastructure, Compute, Foundry, Lithography, Security, Finance, Robotics, Biotech, Energy, Quantum, Spatial, Space).
    2. Territory Placement: Assign the company to one of the main territories:
       - "llm" (LLM Highlands): For Intelligence/AI software companies.
       - "cloud" (Cloud Tundra): For Infrastructure/Cloud/Storage companies.
       - "semis" (The Silicon Spires): For Compute/Hardware/Foundry companies.
       - "cyber" (The Citadel of Crypt): For Security/Defense/Threat Intelligence companies.
       - "fintech" (FinTech Nexus): For Finance/Payments/Crypto companies.
       - "robotics" (The Automaton Frontier): For Humanoid/Autonomous systems.
       - "biotech" (The Genomic Archipelago): For CRISPR/BCI/Longevity tech.
       - "energy" (The Solar Plains): For SMR/Battery/Climate tech.
       - "quantum" (The Qubit Reef): For Quantum computing/cryptography.
       - "spatial" (The Synthetic Valleys): For AR/VR/Spatial Intelligence.
       - "space" (The Celestial Harbor): For LEO/Lunar/Space exploration.
    3. Coordinates: Suggest a specific latitude and longitude within that territory's range for visual placement.
       - llm: lat 15 to 45, lng 30 to 60
       - cloud: lat -45 to -5, lng -55 to -15
       - semis: lat -25 to 15, lng 80 to 125
       - cyber: lat 50 to 75, lng -10 to 20
       - fintech: lat -10 to 20, lng -100 to -70
       - robotics: lat 30 to 40, lng 130 to 140
       - biotech: lat 5 to 15, lng 5 to 15
       - energy: lat -25 to -15, lng 20 to 30
       - quantum: lat 50 to 60, lng -115 to -105
       - spatial: lat 32 to 42, lng -127 to -117
       - space: lat -65 to -55, lng -65 to -55
    4. Competitive Threat: Which "Big Tech" titans are most likely to crush or acquire this company?
    5. Moat Analysis: Does the company have a defensible technical or market advantage?
    6. Gap Analysis: Identify the primary "Gap" between the current state and a >80% survival probability.
       - Gap: A short title (e.g., "Capital Starvation", "Niche Pivot Required", "Operational Bloat").
       - Suggestion: A tactical directive to alter their evolutionary trajectory.
    7. Due Diligence: Based on the provided LinkedIn profiles, assess the credibility of the founders.
       - Do they have the domain expertise to build what they claim?
       - Have they worked at relevant companies or built successful startups before?
    
    You must provide a realistic, non-deterministic assessment. Be critical. Most startups fail or get swallowed.
  `;

  const prompt = `
    Analyze the following new company:
    Name: ${companyName}
    Description: ${description}
    Initial Funding: ${funding}
    Team Size: ${teamSize}
    Founder LinkedIn Profiles: ${founderLinkedIn.join(", ")}
    
    Provide a detailed survival analysis in JSON format.
  `;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ urlContext: {} }],
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
            suggestedTerritoryId: { type: Type.STRING, enum: ["llm", "cloud", "semis", "cyber", "fintech", "robotics", "biotech", "energy", "quantum", "spatial", "space"] },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              },
              required: ["lat", "lng"]
            },
            gapAnalysis: {
              type: Type.OBJECT,
              properties: {
                gap: { type: Type.STRING, description: "The primary survival gap identified" },
                suggestion: { type: Type.STRING, description: "Tactical directive to close the gap" }
              },
              required: ["gap", "suggestion"]
            },
            dueDiligence: {
              type: Type.OBJECT,
              properties: {
                credibilityScore: { type: Type.NUMBER, description: "0-100 score of team credibility" },
                assessment: { type: Type.STRING, description: "Detailed assessment of the team's ability to execute" }
              },
              required: ["credibilityScore", "assessment"]
            }
          },
          required: ["survivalChance", "prediction", "strengths", "weaknesses", "competitiveLandscape", "verdict", "suggestedStrategy", "inferredDomain", "suggestedTerritoryId", "coordinates", "gapAnalysis", "dueDiligence"]
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
