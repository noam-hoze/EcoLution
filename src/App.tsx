/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Epoch, Entity, SimulationResult, Domain } from './types';
import { EpochStrata } from './components/EpochStrata';
import { FounderPortal } from './components/FounderPortal';
import { CorporateBeing } from './components/CorporateBeing';
import { EpochHeader } from './components/EpochHeader';
import { getEpochContext } from './lib/gemini';
import { Globe, Shield, Zap, Info, AlertTriangle, X, TrendingUp, History, Key } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const CORPORATE_DOMAINS: Domain[] = [
  { id: 'gen-ai', name: 'Generative AI', x: 5, y: 5, width: 30, height: 30, color: 'rgba(168, 85, 247, 0.1)' },
  { id: 'cloud', name: 'Cloud Infrastructure', x: 40, y: 5, width: 55, height: 25, color: 'rgba(59, 130, 246, 0.1)' },
  { id: 'semis', name: 'Semiconductors', x: 5, y: 40, width: 30, height: 30, color: 'rgba(234, 179, 8, 0.1)' },
  { id: 'defense', name: 'Defense & Aerospace', x: 40, y: 35, width: 55, height: 40, color: 'rgba(239, 68, 68, 0.1)' },
  { id: 'social', name: 'Social Media', x: 5, y: 75, width: 30, height: 20, color: 'rgba(236, 72, 153, 0.1)' },
  { id: 'consumer', name: 'Consumer Electronics', x: 40, y: 80, width: 55, height: 15, color: 'rgba(34, 197, 94, 0.1)' },
];

const EPOCH_ENTITIES: Record<Epoch, Entity[]> = {
  Cognitive: [
    { id: 'tribe-a', name: 'The Myth Weavers', leader: 'Elder Shaman', value: 100, oxygen: 100, power: 80, control: 90, lineage: [], description: 'The first to master collective fiction.', isUser: false, status: 'Alive', position: { x: 20, y: 30 }, type: 'Human' },
    { id: 'tribe-b', name: 'Fire Keepers', leader: 'Chief Hunter', value: 80, oxygen: 100, power: 70, control: 60, lineage: [], description: 'Masters of the flame.', isUser: false, status: 'Alive', position: { x: 70, y: 40 }, type: 'Human' },
  ],
  Agricultural: [
    { id: 'kingdom-a', name: 'Mesopotamia', leader: 'Hammurabi', value: 500, oxygen: 100, power: 90, control: 85, lineage: [], description: 'The cradle of civilization.', isUser: false, status: 'Alive', position: { x: 30, y: 40 }, type: 'Human' },
    { id: 'kingdom-b', name: 'Egypt', leader: 'Ramses II', value: 450, oxygen: 100, power: 85, control: 90, lineage: [], description: 'The eternal empire.', isUser: false, status: 'Alive', position: { x: 60, y: 60 }, type: 'Human' },
  ],
  Industrial: [
    { id: 'oil', name: 'Standard Oil', leader: 'J.D. Rockefeller', value: 900, oxygen: 100, power: 95, control: 98, lineage: [], description: 'The Energy Monopoly.', isUser: false, status: 'Alive', position: { x: 20, y: 30 }, type: 'Machine' },
    { id: 'steel', name: 'Carnegie Steel', leader: 'Andrew Carnegie', value: 600, oxygen: 100, power: 85, control: 80, lineage: [], description: 'The Infrastructure Layer.', isUser: false, status: 'Alive', position: { x: 70, y: 40 }, type: 'Machine' },
    { id: 'ford', name: 'Ford Motor Co.', leader: 'Henry Ford', value: 500, oxygen: 100, power: 80, control: 75, lineage: [], description: 'The Mobility Layer.', isUser: false, status: 'Alive', position: { x: 40, y: 60 }, type: 'Machine' },
    { id: 'ge', name: 'General Electric', leader: 'Thomas Edison', value: 450, oxygen: 100, power: 75, control: 70, lineage: [], description: 'The Power Layer.', isUser: false, status: 'Alive', position: { x: 80, y: 80 }, type: 'Machine' },
  ],
  Corporate: [
    { id: 'msft', name: 'Microsoft', leader: 'Satya Nadella', value: 420.55, oxygen: 100, power: 80, control: 90, lineage: [], description: 'The OS Layer', isUser: false, status: 'Alive', position: { x: 55, y: 15 }, type: 'Incorporated', domains: ['Generative AI', 'Cloud Infrastructure'] },
    { id: 'goog', name: 'Google', leader: 'Sundar Pichai', value: 150.22, oxygen: 100, power: 85, control: 85, lineage: [], description: 'The Knowledge Layer', isUser: false, status: 'Alive', position: { x: 20, y: 15 }, type: 'Incorporated', domains: ['Generative AI', 'Cloud Infrastructure', 'Social Media'] },
    { id: 'meta', name: 'Meta', leader: 'Mark Zuckerberg', value: 510.12, oxygen: 100, power: 75, control: 70, lineage: [], description: 'The Social Layer', isUser: false, status: 'Alive', position: { x: 20, y: 85 }, type: 'Incorporated', domains: ['Generative AI', 'Social Media'] },
    { id: 'aapl', name: 'Apple', leader: 'Tim Cook', value: 185.90, oxygen: 100, power: 90, control: 95, lineage: [], description: 'The Hardware Layer', isUser: false, status: 'Alive', position: { x: 70, y: 85 }, type: 'Incorporated', domains: ['Consumer Electronics'] },
    { id: 'anth', name: 'Anthropic', leader: 'Dario Amodei', value: 85.00, oxygen: 100, power: 40, control: 50, lineage: ['goog'], description: 'The Safety Layer', isUser: false, status: 'Alive', position: { x: 15, y: 25 }, type: 'Incorporated', domains: ['Generative AI'] },
    { id: 'nvda', name: 'NVIDIA', leader: 'Jensen Huang', value: 900.00, oxygen: 100, power: 95, control: 90, lineage: [], description: 'The Compute Layer', isUser: false, status: 'Alive', position: { x: 20, y: 55 }, type: 'Incorporated', domains: ['Semiconductors', 'Generative AI'] },
    { id: 'intl', name: 'Intel', leader: 'Pat Gelsinger', value: 45.00, oxygen: 100, power: 60, control: 50, lineage: [], description: 'The Legacy Layer', isUser: false, status: 'Alive', position: { x: 10, y: 55 }, type: 'Incorporated', domains: ['Semiconductors'] },
    { id: 'pltr', name: 'Palantir', leader: 'Alex Karp', value: 35.00, oxygen: 100, power: 50, control: 60, lineage: [], description: 'The Defense Layer', isUser: false, status: 'Alive', position: { x: 60, y: 50 }, type: 'Incorporated', domains: ['Defense & Aerospace', 'Generative AI'] },
    { id: 'spcx', name: 'SpaceX', leader: 'Elon Musk', value: 180.00, oxygen: 100, power: 85, control: 80, lineage: [], description: 'The Frontier Layer', isUser: false, status: 'Alive', position: { x: 80, y: 50 }, type: 'Incorporated', domains: ['Defense & Aerospace'] },
  ],
  AI: [
    { id: 'openai', name: 'OpenAI', leader: 'Sam Altman', value: 1000, oxygen: 100, power: 95, control: 90, lineage: ['msft'], description: 'The Intelligence Layer', isUser: false, status: 'Alive', position: { x: 50, y: 50 }, type: 'Synthetic' },
  ],
};

export default function App() {
  const [currentEpoch, setCurrentEpoch] = useState<Epoch>('Corporate');
  const [epochDescription, setEpochDescription] = useState<string>('');
  const [entities, setEntities] = useState<Entity[]>(EPOCH_ENTITIES['Corporate']);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    setEntities(EPOCH_ENTITIES[currentEpoch]);
  }, [currentEpoch]);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    const fetchContext = async () => {
      const desc = await getEpochContext(currentEpoch);
      setEpochDescription(desc);
    };
    fetchContext();
  }, [currentEpoch]);

  const handleSimulationComplete = (result: SimulationResult, name: string) => {
    if (result.verdict !== 'Extinct') {
      const newEntity: Entity = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        value: result.survivalProbability * 100,
        oxygen: result.survivalProbability * 100,
        power: 10,
        control: 5,
        lineage: [],
        description: 'New Mutation',
        isUser: true,
        status: result.verdict as any,
        position: { x: 50, y: 50 },
        type: currentEpoch === 'AI' ? 'Synthetic' : currentEpoch === 'Corporate' ? 'Incorporated' : currentEpoch === 'Industrial' ? 'Machine' : 'Human'
      };
      setEntities(prev => [...prev, newEntity]);
    }
  };

  const getEpochStyles = () => {
    switch (currentEpoch) {
      case 'Cognitive':
        return {
          aura1: 'bg-amber-500/10',
          aura2: 'bg-green-500/10',
          gridOpacity: 'opacity-20',
          gridSize: 'bg-[size:60px_60px]',
          accent: 'text-amber-500',
          border: 'border-amber-500/20'
        };
      case 'Agricultural':
        return {
          aura1: 'bg-emerald-500/10',
          aura2: 'bg-yellow-500/10',
          gridOpacity: 'opacity-30',
          gridSize: 'bg-[size:80px_80px]',
          accent: 'text-emerald-500',
          border: 'border-emerald-500/20'
        };
      case 'Industrial':
        return {
          aura1: 'bg-zinc-700/20',
          aura2: 'bg-orange-900/20',
          gridOpacity: 'opacity-40',
          gridSize: 'bg-[size:40px_40px]',
          accent: 'text-zinc-400',
          border: 'border-zinc-500/20'
        };
      case 'Corporate':
        return {
          aura1: 'bg-blue-500/5',
          aura2: 'bg-orange-500/5',
          gridOpacity: 'opacity-10',
          gridSize: 'bg-[size:40px_40px]',
          accent: 'text-orange-500',
          border: 'border-white/5'
        };
      case 'AI':
        return {
          aura1: 'bg-purple-500/10',
          aura2: 'bg-cyan-500/10',
          gridOpacity: 'opacity-50',
          gridSize: 'bg-[size:20px_20px]',
          accent: 'text-cyan-400',
          border: 'border-cyan-500/20'
        };
      default:
        return {
          aura1: 'bg-white/5',
          aura2: 'bg-white/5',
          gridOpacity: 'opacity-10',
          gridSize: 'bg-[size:40px_40px]',
          accent: 'text-white',
          border: 'border-white/5'
        };
    }
  };

  const styles = getEpochStyles();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] transition-colors duration-1000">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ backgroundColor: styles.aura1.split(' ')[0].replace('bg-', '') }}
          className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${styles.aura1} blur-[120px] rounded-full transition-all duration-1000`} 
        />
        <motion.div 
          animate={{ backgroundColor: styles.aura2.split(' ')[0].replace('bg-', '') }}
          className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${styles.aura2} blur-[120px] rounded-full transition-all duration-1000`} 
        />
        
        {/* Grid System */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] ${styles.gridSize} ${styles.gridOpacity} transition-all duration-1000`} />
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:200px_200px] ${styles.gridOpacity} transition-all duration-1000`} />
        
        {currentEpoch === 'Industrial' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-white/5 to-transparent blur-sm" />
            <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-white/5 to-transparent blur-sm" />
          </div>
        )}

        {currentEpoch === 'Corporate' && (
          <div className="absolute inset-0 pointer-events-none">
            {CORPORATE_DOMAINS.map(domain => {
              const reigningEntities = entities.filter(e => e.domains?.includes(domain.name));
              const isHighlighted = hoveredEntityId && entities.find(e => e.id === hoveredEntityId)?.domains?.includes(domain.name);
              const isSelected = selectedEntity && selectedEntity.domains?.includes(domain.name);

              return (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    borderColor: (isHighlighted || isSelected) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)',
                    backgroundColor: (isHighlighted || isSelected) ? domain.color.replace('0.1', '0.2') : domain.color
                  }}
                  className="absolute border rounded-2xl flex flex-col items-center justify-start p-4 transition-colors duration-500"
                  style={{
                    left: `${domain.x}%`,
                    top: `${domain.y}%`,
                    width: `${domain.width}%`,
                    height: `${domain.height}%`,
                  }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
                    Territory
                  </div>
                  <div className="text-lg font-serif italic text-white/40 mt-1">
                    {domain.name}
                  </div>
                  
                  {(isHighlighted || isSelected) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-auto flex flex-wrap justify-center gap-1"
                    >
                      {reigningEntities.map(re => (
                        <div key={re.id} className={`w-1.5 h-1.5 rounded-full ${re.id === (hoveredEntityId || selectedEntity?.id) ? 'bg-white' : 'bg-white/20'}`} />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-50 contrast-150" />
      </div>

      {/* The World Stage */}
      <main className="absolute inset-0 overflow-hidden">
        <EpochHeader 
          currentEpoch={currentEpoch}
          epochDescription={epochDescription}
          hasApiKey={hasApiKey}
          onSelectKey={handleSelectKey}
          onToggleInfo={() => setShowInfo(!showInfo)}
          styles={styles}
          isVisible={isHeaderVisible}
          onToggleVisibility={() => setIsHeaderVisible(!isHeaderVisible)}
        />

        {/* The Walking Beings */}
        <div className="absolute inset-0 z-10">
          {entities.map(entity => (
            <CorporateBeing 
              key={entity.id} 
              entity={entity} 
              epoch={currentEpoch} 
              onClick={setSelectedEntity} 
              onMouseEnter={() => setHoveredEntityId(entity.id)}
              onMouseLeave={() => setHoveredEntityId(null)}
            />
          ))}
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-8 left-8 flex gap-8 z-20">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
              <Shield size={10} /> Stability
            </div>
            <div className="text-xl font-serif italic text-white">High</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
              <AlertTriangle size={10} className="text-orange-500" /> AGI Risk
            </div>
            <div className="text-xl font-serif italic text-white">Unstable</div>
          </div>
        </div>
      </main>

      {/* Floating Navigation */}
      <EpochStrata currentEpoch={currentEpoch} onEpochChange={setCurrentEpoch} />

      {/* Entity Details Modal */}
      <AnimatePresence>
        {selectedEntity && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntity(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: 450 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 450 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] z-50 bg-zinc-950/95 backdrop-blur-3xl border-l border-white/10 p-12 shadow-2xl overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedEntity(null)}
                className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-16">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-[1px] ${styles.accent.replace('text-', 'bg-')}`} />
                    <div className={`text-[10px] font-mono uppercase tracking-[0.3em] ${styles.accent}`}>
                      {selectedEntity.type} Entity
                    </div>
                  </div>
                  <h2 className="text-7xl font-serif italic text-white leading-tight tracking-tighter">
                    {selectedEntity.name}
                  </h2>
                  {selectedEntity.leader && (
                    <div className="text-lg text-white/40 italic font-serif">
                      Under the governance of <span className="text-white/80">{selectedEntity.leader}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 group hover:bg-white/10 transition-all">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <TrendingUp size={12} /> Real-Time Valuation
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-serif italic text-green-500">${selectedEntity.value.toFixed(2)}</span>
                      <span className="text-xs text-green-500/50 font-mono">+2.4%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                        <Zap size={12} /> Market Power
                      </div>
                      <div className="text-4xl font-serif italic text-white">{selectedEntity.power}%</div>
                    </div>
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                        <Shield size={12} /> Control
                      </div>
                      <div className="text-4xl font-serif italic text-white">{selectedEntity.control}%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                    <History size={12} /> Lineage & Deep History
                  </div>
                  <div className="relative pl-8 border-l border-white/10 space-y-6">
                    <p className="text-lg text-white/70 leading-relaxed font-serif italic">
                      {selectedEntity.description || "A dominant organism in the current market strata."}
                    </p>
                    {selectedEntity.domains && (
                      <div className="flex flex-wrap gap-2">
                        {selectedEntity.domains.map(d => (
                          <span key={d} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-12 border-t border-white/5 space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">Strategic Moat Strength</div>
                    <div className={`text-sm font-mono ${styles.accent}`}>{selectedEntity.control}%</div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedEntity.control}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FounderPortal currentEpoch={currentEpoch} onSimulationComplete={handleSimulationComplete} />

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-2xl bg-zinc-900 border border-white/10 p-12 rounded-3xl space-y-8"
            >
              <h2 className="text-5xl font-serif italic text-white">Macro-Evolution</h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  Welcome to the simulation. You are observing the lineage of human dominance—a 70,000-year trajectory where ideas are the genetic material and power is the apex prize.
                </p>
                <p>
                  From the Cognitive Revolution to the Industrial Age, the "Inhabitants" of our world have evolved from tribes to kingdoms, and finally to the **Incorporated Entities** we see today.
                </p>
                <p>
                  As we approach the **AI Event Horizon**, the physics of survival are changing. Autonomy, Governance, and Alignment are the new survival traits.
                </p>
                <p className="text-orange-500 font-medium">
                  Your mission: Introduce a new mutation. Pitch your startup. Survive the Market Physics.
                </p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all"
              >
                Enter the Simulation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
