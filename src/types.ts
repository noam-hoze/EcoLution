
export type Epoch = 'Cognitive' | 'Agricultural' | 'Industrial' | 'Corporate' | 'AI';

export interface HistoricalContext {
  epoch: Epoch;
  year: number;
  dominantPower: string;
  oxygenSource: string; // e.g., "Language", "Land", "Coal", "Revenue", "Compute"
  riskFactor: string;
}

export interface Entity {
  id: string;
  name: string;
  leader?: string;
  value: number; // Current share price or equivalent power units
  oxygen: number; 
  power: number; 
  control: number; 
  lineage: string[]; 
  description: string;
  isUser: boolean;
  status: 'Alive' | 'Acquired' | 'Extinct';
  position: { x: number; y: number }; // For walking in the world
  type: 'Human' | 'Machine' | 'Incorporated' | 'Synthetic';
  domains?: string[];
}

export interface Domain {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface SimulationResult {
  survivalProbability: number;
  monthsSurvived: number;
  feedback: string;
  agiRiskLevel: number; // 0-1
  verdict: 'Survived' | 'Acquired' | 'Extinct';
}
