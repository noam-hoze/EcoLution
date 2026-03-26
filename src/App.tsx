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
import { 
  Globe, Shield, Zap, Info, AlertTriangle, X, TrendingUp, History, Key,
  Sparkles, Cloud, Cpu, Share2, Smartphone, Rocket
} from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const CORPORATE_DOMAINS: Domain[] = [
  { 
    id: 'gen-ai', 
    name: 'Generative AI', 
    x: 5, y: 5, width: 30, height: 30, 
    color: 'rgba(168, 85, 247, 0.1)',
    imageUrl: 'https://loremflickr.com/800/600/artificialintelligence,neural',
    icon: 'Sparkles'
  },
  { 
    id: 'cloud', 
    name: 'Cloud Infrastructure', 
    x: 40, y: 5, width: 55, height: 25, 
    color: 'rgba(59, 130, 246, 0.1)',
    imageUrl: 'https://loremflickr.com/800/600/datacenter,server',
    icon: 'Cloud'
  },
  { 
    id: 'semis', 
    name: 'Semiconductors', 
    x: 5, y: 40, width: 30, height: 30, 
    color: 'rgba(234, 179, 8, 0.1)',
    imageUrl: 'https://loremflickr.com/800/600/microchip,circuit',
    icon: 'Cpu'
  },
  { 
    id: 'defense', 
    name: 'Defense & Aerospace', 
    x: 40, y: 35, width: 55, height: 40, 
    color: 'rgba(239, 68, 68, 0.1)',
    imageUrl: 'https://loremflickr.com/800/600/satellite,spacecraft',
    icon: 'Rocket'
  },
  { 
    id: 'social', 
    name: 'Social Media', 
    x: 5, y: 75, width: 30, height: 20, 
    color: 'rgba(236, 72, 153, 0.1)',
    imageUrl: 'https://loremflickr.com/800/600/socialnetwork,digital',
    icon: 'Share2'
  },
  { 
    id: 'consumer', 
    name: 'Consumer Electronics', 
    x: 40, y: 80, width: 55, height: 15, 
    color: 'rgba(34, 197, 94, 0.1)',
    imageUrl: 'https://loremflickr.com/800/600/smartphone,gadget',
    icon: 'Smartphone'
  },
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
    { id: 'msft', name: 'Microsoft', leader: 'Satya Nadella', value: 420.55, oxygen: 100, power: 80, control: 90, lineage: [], description: 'The OS Layer', isUser: false, status: 'Alive', position: { x: 55, y: 15 }, type: 'Incorporated', domains: ['Generative AI', 'Cloud Infrastructure'], logoUrl: 'https://logo.clearbit.com/microsoft.com' },
    { id: 'goog', name: 'Google', leader: 'Sundar Pichai', value: 150.22, oxygen: 100, power: 85, control: 85, lineage: [], description: 'The Knowledge Layer', isUser: false, status: 'Alive', position: { x: 20, y: 15 }, type: 'Incorporated', domains: ['Generative AI', 'Cloud Infrastructure', 'Social Media'], logoUrl: 'https://logo.clearbit.com/google.com' },
    { id: 'meta', name: 'Meta', leader: 'Mark Zuckerberg', value: 510.12, oxygen: 100, power: 75, control: 70, lineage: [], description: 'The Social Layer', isUser: false, status: 'Alive', position: { x: 20, y: 85 }, type: 'Incorporated', domains: ['Generative AI', 'Social Media'], logoUrl: 'https://logo.clearbit.com/meta.com' },
    { id: 'aapl', name: 'Apple', leader: 'Tim Cook', value: 185.90, oxygen: 100, power: 90, control: 95, lineage: [], description: 'The Hardware Layer', isUser: false, status: 'Alive', position: { x: 70, y: 85 }, type: 'Incorporated', domains: ['Consumer Electronics'], logoUrl: 'https://logo.clearbit.com/apple.com' },
    { id: 'anth', name: 'Anthropic', leader: 'Dario Amodei', value: 85.00, oxygen: 100, power: 40, control: 50, lineage: ['goog'], description: 'The Safety Layer', isUser: false, status: 'Alive', position: { x: 15, y: 25 }, type: 'Incorporated', domains: ['Generative AI'], logoUrl: 'https://logo.clearbit.com/anthropic.com' },
    { id: 'nvda', name: 'NVIDIA', leader: 'Jensen Huang', value: 900.00, oxygen: 100, power: 95, control: 90, lineage: [], description: 'The Compute Layer', isUser: false, status: 'Alive', position: { x: 20, y: 55 }, type: 'Incorporated', domains: ['Semiconductors', 'Generative AI'], logoUrl: 'https://logo.clearbit.com/nvidia.com' },
    { id: 'intl', name: 'Intel', leader: 'Pat Gelsinger', value: 45.00, oxygen: 100, power: 60, control: 50, lineage: [], description: 'The Legacy Layer', isUser: false, status: 'Alive', position: { x: 10, y: 55 }, type: 'Incorporated', domains: ['Semiconductors'], logoUrl: 'https://logo.clearbit.com/intel.com' },
    { id: 'pltr', name: 'Palantir', leader: 'Alex Karp', value: 35.00, oxygen: 100, power: 50, control: 60, lineage: [], description: 'The Defense Layer', isUser: false, status: 'Alive', position: { x: 60, y: 50 }, type: 'Incorporated', domains: ['Defense & Aerospace', 'Generative AI'], logoUrl: 'https://logo.clearbit.com/palantir.com' },
    { id: 'spcx', name: 'SpaceX', leader: 'Elon Musk', value: 180.00, oxygen: 100, power: 85, control: 80, lineage: [], description: 'The Frontier Layer', isUser: false, status: 'Alive', position: { x: 80, y: 50 }, type: 'Incorporated', domains: ['Defense & Aerospace'], logoUrl: 'https://logo.clearbit.com/spacex.com' },
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
  
  // Canvas State
  const [scale, setScale] = useState(1);
  const [canvasPos, setCanvasPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(prev => Math.min(Math.max(prev * delta, 0.5), 3));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

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
      {/* Fixed Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ backgroundColor: styles.aura1.split(' ')[0].replace('bg-', '') }}
          className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${styles.aura1} blur-[120px] rounded-full transition-all duration-1000`} 
        />
        <motion.div 
          animate={{ backgroundColor: styles.aura2.split(' ')[0].replace('bg-', '') }}
          className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${styles.aura2} blur-[120px] rounded-full transition-all duration-1000`} 
        />
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] ${styles.gridSize} ${styles.gridOpacity} transition-all duration-1000`} />
      </div>

      {/* Zoomable/Pannable World Canvas */}
      <div 
        className={`fixed inset-0 overflow-hidden z-10 transition-cursor duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <motion.div
          drag
          dragMomentum={false}
          onDrag={(e, info) => setCanvasPos(prev => ({ x: prev.x + info.delta.x, y: prev.y + info.delta.y }))}
          animate={{ 
            scale,
            x: canvasPos.x,
            y: canvasPos.y
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-[200vw] h-[200vh] -left-[50vw] -top-[50vh]"
        >
          {/* Territory Grid (Corporate Only) */}
          {currentEpoch === 'Corporate' && (
            <div className="absolute inset-0 z-0">
              {CORPORATE_DOMAINS.map(domain => {
                const reigningEntities = entities.filter(e => e.domains?.includes(domain.name));
                const isHighlighted = hoveredEntityId && entities.find(e => e.id === hoveredEntityId)?.domains?.includes(domain.name);
                const isSelected = selectedEntity && selectedEntity.domains?.includes(domain.name);

                const DomainIcon = {
                  Sparkles, Cloud, Cpu, Rocket, Share2, Smartphone
                }[domain.icon || 'Globe'] || Globe;

                return (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      borderColor: (isHighlighted || isSelected) ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.05)',
                      backgroundColor: (isHighlighted || isSelected) ? domain.color.replace('0.1', '0.25') : domain.color
                    }}
                    className="absolute border rounded-3xl overflow-hidden group transition-all duration-700"
                    style={{
                      left: `${domain.x}%`,
                      top: `${domain.y}%`,
                      width: `${domain.width}%`,
                      height: `${domain.height}%`,
                    }}
                  >
                    {/* Background Imagery */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={domain.imageUrl} 
                        alt={domain.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-all duration-1000 ${
                          (isHighlighted || isSelected) ? 'scale-110 opacity-60 blur-0' : 'scale-100 opacity-20 blur-[3px]'
                        }`}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${
                        (isHighlighted || isSelected) 
                          ? 'from-black/40 via-transparent to-black/60' 
                          : 'from-black/80 via-black/40 to-black/80'
                      }`} />
                    </div>

                    <div className="relative z-10 p-6 h-full flex flex-col items-start">
                      <div className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 mb-4 transition-all duration-500 shadow-xl ${
                        (isHighlighted || isSelected) ? 'scale-110 border-white/40 bg-white/20 shadow-white/5' : ''
                      }`}>
                        <DomainIcon size={20} className={isHighlighted || isSelected ? 'text-white' : 'text-white/40'} />
                      </div>
                      
                      <div className={`text-2xl font-serif italic tracking-tight leading-none transition-all duration-500 ${
                        (isHighlighted || isSelected) ? 'text-white translate-x-1 drop-shadow-lg' : 'text-white/30'
                      }`}>
                        {domain.name}
                      </div>
                      
                      {(isHighlighted || isSelected) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-auto w-full"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50">
                              Dominion Status
                            </div>
                            <div className="text-[9px] font-mono text-green-400 uppercase tracking-widest">
                              Active
                            </div>
                          </div>
                          <div className="flex gap-1.5 items-center h-1">
                            {reigningEntities.map(re => (
                              <motion.div 
                                key={re.id} 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`h-full flex-1 rounded-full transition-all ${
                                  re.id === (hoveredEntityId || selectedEntity?.id) 
                                    ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                                    : 'bg-white/20'
                                }`} 
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-50 contrast-150 pointer-events-none" />

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
        </motion.div>
      </div>

      {/* Fixed UI Layer */}
      <main className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="pointer-events-auto">
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
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-8 left-8 flex gap-8 z-20 pointer-events-auto">
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
