
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationResult, Entity, Epoch } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });

export const simulateStartupSurvival = async (
  startupName: string,
  idea: string,
  currentEpoch: Epoch,
  competitors: Entity[]
): Promise<SimulationResult> => {
  const competitorContext = competitors
    .map(c => `${c.name}: ${c.power}% market share, ${c.control}% control`)
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      You are the "Market Environment" in a macro-evolutionary simulation of human dominance.
      The current epoch is: ${currentEpoch}.
      
      The startup "${startupName}" is entering the ecosystem with the following idea:
      "${idea}"
      
      The current apex predators (competitors) are:
      ${competitorContext}
      
      Evaluate the survival probability of this startup over 12 months. 
      Consider the "AGI Risk Factor": if the startup uses AI, assess the risk of agentic autonomy, governance failure, and sovereignty loss.
      
      Return the result in JSON format.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          survivalProbability: { type: Type.NUMBER },
          monthsSurvived: { type: Type.INTEGER },
          feedback: { type: Type.STRING },
          agiRiskLevel: { type: Type.NUMBER },
          verdict: { 
            type: Type.STRING, 
            enum: ["Survived", "Acquired", "Extinct"] 
          }
        },
        required: ["survivalProbability", "monthsSurvived", "feedback", "agiRiskLevel", "verdict"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as SimulationResult;
};

const EPOCH_FALLBACKS: Record<Epoch, string> = {
  Cognitive: "70,000 years ago. The birth of language. Power was held by those who could weave the most compelling myths. Oxygen: Shared Belief.",
  Agricultural: "12,000 years ago. The transition from nomads to settlers. Power was land. Oxygen: Grain and Surplus.",
  Industrial: "1760. The age of steam and steel. Power was mechanical leverage. Oxygen: Coal and Capital.",
  Corporate: "1950. The rise of the incorporated entity. Power is market share. Oxygen: Revenue and Attention.",
  AI: "2024. The Event Horizon. Power is compute and autonomy. Oxygen: Data and Alignment."
};

export const getEpochContext = async (epoch: Epoch): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the ${epoch} revolution in human history. 
      Focus on how power was structured and what the "Oxygen" (survival resource) was. 
      Keep it concise (max 100 words).`
    });
    return response.text || EPOCH_FALLBACKS[epoch];
  } catch (error) {
    console.warn("Gemini API Quota exceeded, using fallback context.");
    return EPOCH_FALLBACKS[epoch];
  }
};
