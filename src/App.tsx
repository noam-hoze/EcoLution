/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Shield, Cpu, Cloud, Sparkles, Activity, 
  Layers, Globe as GlobeIcon, Info, X, Terminal,
  Database, Network, Server, Radio, Box, Play, Pause,
  Target
} from 'lucide-react';
import { SurvivalAnalysis } from './components/SurvivalAnalysis';

// --- Data Definitions ---

const CONTINENTS = [
  { 
    id: 'llm', 
    name: 'LLM Highlands', 
    lat: 40, lng: 45, 
    color: '#a855f7', 
    description: 'The peaks of cognitive synthesis and linguistic modeling.',
    size: 1.2
  },
  { 
    id: 'cloud', 
    name: 'Cloud Tundra', 
    lat: -40, lng: -35, 
    color: '#3b82f6', 
    description: 'The vast frozen plains of distributed storage and server farms.',
    size: 1.2
  },
  { 
    id: 'semis', 
    name: 'Semiconductor Archipelago', 
    lat: -30, lng: 105, 
    color: '#eab308', 
    description: 'The volcanic islands of pure compute and lithography.',
    size: 1.2
  }
];

const TECH_HUBS = [
  // LLM Highlands (Intelligence)
  { id: 'openai', name: 'OpenAI', lat: 35, lng: 35, color: '#a855f7', value: '80B', type: 'Intelligence', control: 85, logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128', description: 'Leader in generative pre-trained transformers.' },
  { id: 'anthropic', name: 'Anthropic', lat: 15, lng: 55, color: '#a855f7', value: '18B', type: 'Intelligence', control: 40, logo: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128', description: 'AI safety and research company.' },
  { id: 'deepmind', name: 'DeepMind', lat: 25, lng: 30, color: '#a855f7', value: 'N/A', type: 'Intelligence', control: 75, logo: 'https://www.google.com/s2/favicons?domain=deepmind.com&sz=128', description: 'Google\'s premier AI research division.' },
  { id: 'mistral', name: 'Mistral', lat: 45, lng: 50, color: '#a855f7', value: '2B', type: 'Intelligence', control: 20, logo: 'https://www.google.com/s2/favicons?domain=mistral.ai&sz=128', description: 'European champion of open-weight models.' },

  // Cloud Tundra (Infrastructure)
  { id: 'aws', name: 'AWS', lat: -5, lng: -20, color: '#3b82f6', value: '1.2T', type: 'Infrastructure', control: 92, logo: 'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128', description: 'The backbone of the modern internet.' },
  { id: 'azure', name: 'Azure', lat: -30, lng: -50, color: '#3b82f6', value: '900B', type: 'Infrastructure', control: 88, logo: 'https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=128', description: 'Enterprise-grade cloud solutions.' },
  { id: 'gcp', name: 'GCP', lat: -10, lng: -60, color: '#3b82f6', value: '500B', type: 'Infrastructure', control: 65, logo: 'https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128', description: 'Data-centric cloud infrastructure.' },
  { id: 'oracle', name: 'Oracle', lat: -45, lng: -25, color: '#3b82f6', value: '300B', type: 'Infrastructure', control: 45, logo: 'https://www.google.com/s2/favicons?domain=oracle.com&sz=128', description: 'Legacy database and cloud services.' },

  // Semiconductor Archipelago (Compute)
  { id: 'nvidia', name: 'Nvidia', lat: 10, lng: 90, color: '#eab308', value: '2.1T', type: 'Compute', control: 95, logo: 'https://www.google.com/s2/favicons?domain=nvidia.com&sz=128', description: 'The forge of the AI revolution.' },
  { id: 'tsmc', name: 'TSMC', lat: -20, lng: 120, color: '#eab308', value: '600B', type: 'Foundry', control: 98, logo: 'https://www.google.com/s2/favicons?domain=tsmc.com&sz=128', description: 'The world\'s most advanced silicon foundry.' },
  { id: 'asml', name: 'ASML', lat: 5, lng: 80, color: '#eab308', value: '350B', type: 'Lithography', control: 90, logo: 'https://www.google.com/s2/favicons?domain=asml.com&sz=128', description: 'Sole provider of EUV lithography machines.' },
  { id: 'amd', name: 'AMD', lat: -25, lng: 100, color: '#eab308', value: '280B', type: 'Compute', control: 55, logo: 'https://www.google.com/s2/favicons?domain=amd.com&sz=128', description: 'High-performance computing and graphics.' },
  { id: 'intel', name: 'Intel', lat: 15, lng: 110, color: '#eab308', value: '180B', type: 'Compute', control: 40, logo: 'https://www.google.com/s2/favicons?domain=intel.com&sz=128', description: 'The legacy titan of x86 architecture.' }
];

const ARCS = [
  { startLat: 35, startLng: 35, endLat: 10, endLng: 90, color: ['#a855f7', '#eab308'], label: 'H100 Allocation' },
  { startLat: -5, startLng: -20, endLat: 35, endLng: 35, color: ['#3b82f6', '#a855f7'], label: 'Training Compute' },
  { startLat: -20, startLng: 120, endLat: -5, endLng: -20, color: ['#eab308', '#3b82f6'], label: 'Server Deployment' }
];

// Background noise data for hexbins
const HEX_DATA = [...Array(1000).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 160,
  lng: (Math.random() - 0.5) * 360,
  weight: Math.random()
}));

// --- Components ---

const Sidebar: React.FC<{ selected: any; onClose: () => void }> = ({ selected, onClose }) => (
  <motion.div
    initial={{ x: 480, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 480, opacity: 0 }}
    className="fixed top-0 right-0 bottom-0 w-[480px] bg-black/40 backdrop-blur-xl border-l border-white/5 p-12 z-50 flex flex-col gap-10 shadow-2xl"
  >
    <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
      <X size={24} />
    </button>

    <div className="space-y-6 pt-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-[1px] bg-blue-500/50" />
        <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-400 font-bold">
          Node Analysis
        </div>
      </div>
      <div className="flex items-center gap-6">
        {selected.logo && (
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm flex items-center justify-center">
            <img src={selected.logo} alt={selected.name} className="w-full h-full object-contain filter brightness-110" />
          </div>
        )}
        <h2 className="text-5xl font-serif italic text-white leading-tight tracking-tighter">
          {selected.name}
        </h2>
      </div>
      <div className="flex items-center gap-2 text-xs text-white/40 font-mono uppercase tracking-widest">
        {selected.icon && <span className="text-blue-400">{selected.icon}</span>}
        {selected.type || 'Territory'}
      </div>
    </div>

    <div className="space-y-8">
      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 group hover:bg-white/10 transition-all">
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
          <Activity size={12} /> Territory Control
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-serif italic text-blue-400">
            {selected.control || '0'}%
          </span>
          <span className="text-[10px] text-blue-500/50 font-mono">Dominance</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${selected.control || 0}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      </div>

      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 group hover:bg-white/10 transition-all">
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
          <Zap size={12} /> Valuation
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-serif italic text-green-400">
            ${selected.value || 'N/A'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
          <Info size={12} /> Intelligence Report
        </div>
        <p className="text-lg text-white/70 leading-relaxed font-serif italic">
          {selected.description || 'A critical node in the global digital ecosystem, facilitating the flow of information and value across the network. This entity maintains high-level synchronization with adjacent hubs.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-white/30">Latency</div>
          <div className="text-xl font-serif italic text-white">4ms</div>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="text-[9px] font-mono uppercase tracking-widest text-white/30">Throughput</div>
          <div className="text-xl font-serif italic text-white">8.2 TB/s</div>
        </div>
      </div>
    </div>

    <div className="mt-auto pt-10 border-t border-white/10">
      <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-widest">
        <span>Network Integrity</span>
        <span className="text-blue-400">98.2%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden p-[1px] border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '98.2%' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const globeRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [showSurvivalEngine, setShowSurvivalEngine] = useState(false);
  const [hubs, setHubs] = useState(TECH_HUBS);
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCompanyCreated = (company: any) => {
    setHubs(prev => [...prev, company]);
    // Fly to the new company
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: company.lat, lng: company.lng, altitude: 1.5 }, 2000);
    }
  };

  // Custom globe texture placeholder (dark grid)
  const globeImageUrl = "https://unpkg.com/three-globe/example/img/earth-night.jpg";
  const bumpImageUrl = "//unpkg.com/three-globe/example/img/earth-topology.png";
  const backgroundImageUrl = "//unpkg.com/three-globe/example/img/night-sky.png";

  useEffect(() => {
    if (globeRef.current) {
      // Configure controls
      const controls = globeRef.current.controls();
      controls.autoRotate = isAutoRotate;
      controls.autoRotateSpeed = 0.3;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }
  }, [isAutoRotate]);

  useEffect(() => {
    if (globeRef.current) {
      // Set initial camera position - centered on equator
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 4000);
    }
  }, []);

  return (
    <div className="relative h-screen w-screen bg-[#050505] overflow-hidden">
      {/* Globe Container */}
      <div className="absolute inset-0 z-0">
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={globeImageUrl}
          bumpImageUrl={bumpImageUrl}
          backgroundImageUrl={backgroundImageUrl}
          
          // Atmosphere
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.2}

          // Labels (Continents)
          labelsData={CONTINENTS}
          labelLat={d => (d as any).lat}
          labelLng={d => (d as any).lng}
          labelText={d => (d as any).name}
          labelSize={d => (d as any).size}
          labelDotRadius={0.6}
          labelColor={d => (d as any).color}
          labelResolution={3}
          labelAltitude={0.05}
          onLabelClick={setSelectedNode}

          // Points (Tech Hubs)
          pointsData={hubs}
          pointLat={d => (d as any).lat}
          pointLng={d => (d as any).lng}
          pointColor={d => (d as any).color}
          pointRadius={0.5}
          pointsMerge={false}
          pointAltitude={0.02}
          onPointClick={setSelectedNode}

          // HTML Elements (Company Markers)
          htmlElementsData={hubs}
          htmlElement={(d: any) => {
            const el = document.createElement('div');
            el.style.pointerEvents = 'auto'; // Ensure it captures clicks
            el.innerHTML = `
              <div class="group cursor-pointer flex flex-col items-center">
                <div class="relative w-8 h-8 flex items-center justify-center">
                  <!-- Outer Glow Ring -->
                  <div class="absolute inset-0 rounded-full bg-white/10 blur-sm group-hover:bg-white/20 transition-all duration-300"></div>
                  <!-- Border Ring -->
                  <div class="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
                  <!-- Logo Container -->
                  <div class="relative w-6 h-6 rounded-full overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center p-1 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <img src="${d.logo}" alt="${d.name}" class="w-full h-full object-contain filter brightness-110 pointer-events-none" />
                  </div>
                </div>
                <!-- Label -->
                <div class="mt-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <div class="text-[8px] font-mono text-white whitespace-nowrap uppercase tracking-widest font-bold">${d.name}</div>
                </div>
              </div>
            `;
            el.onclick = (e) => {
              e.stopPropagation();
              setSelectedNode(d);
            };
            return el;
          }}

          // Arcs (Supply Chain)
          arcsData={ARCS}
          arcStartLat={d => (d as any).startLat}
          arcStartLng={d => (d as any).startLng}
          arcEndLat={d => (d as any).endLat}
          arcEndLng={d => (d as any).endLng}
          arcColor={d => (d as any).color}
          arcDashLength={0.5}
          arcDashGap={3}
          arcDashInitialGap={() => Math.random() * 5}
          arcDashAnimateTime={1500}
          arcStroke={0.6}
          arcCurveResolution={64}

          // Rings (Active Hubs)
          ringsData={TECH_HUBS}
          ringLat={d => (d as any).lat}
          ringLng={d => (d as any).lng}
          ringColor={d => (d as any).color}
          ringMaxRadius={5}
          ringPropagationSpeed={2}
          ringRepeatPeriod={800}

          // Hexbins (Background Traffic)
          hexBinPointsData={HEX_DATA}
          hexBinPointWeight="weight"
          hexBinResolution={4}
          hexMargin={0.2}
          hexTopColor={() => 'rgba(59, 130, 246, 0.4)'}
          hexSideColor={() => 'rgba(59, 130, 246, 0.1)'}
          hexAltitude={d => (d as any).sumWeight * 0.01}
        />
      </div>

      {/* Survival Engine Overlay */}
      <AnimatePresence>
        {showSurvivalEngine && (
          <SurvivalAnalysis 
            onClose={() => setShowSurvivalEngine(false)} 
            onCompanyCreated={handleCompanyCreated}
          />
        )}
      </AnimatePresence>

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Header / HUD */}
        <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start pointer-events-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-blue-500/50" />
              <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-blue-400/80 font-bold">
                System Active // v3.0
              </div>
            </div>
            <h1 className="text-4xl font-serif italic text-white tracking-tighter leading-none opacity-90">
              The Global <span className="text-blue-500">Stack</span>
            </h1>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setShowSurvivalEngine(true)}
              className="px-5 py-3 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 hover:bg-purple-600/20 transition-all shadow-2xl flex items-center gap-2 group backdrop-blur-md"
              title="Survival Engine"
            >
              <Target size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[9px] font-mono uppercase tracking-[0.15em] font-bold">Start</span>
            </button>
          </div>
        </header>

        {/* Bottom Stats / HUD */}
        <div className="absolute bottom-8 left-8 flex gap-12 pointer-events-auto">
          <div className="space-y-1">
            <div className="text-[9px] font-mono uppercase tracking-widest text-white/20 flex items-center gap-2">
              <Activity size={10} className="text-green-500/50" /> Network Load
            </div>
            <div className="text-xl font-serif italic text-white/80">Optimal</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] font-mono uppercase tracking-widest text-white/20 flex items-center gap-2">
              <Layers size={10} className="text-blue-500/50" /> Active Nodes
            </div>
            <div className="text-xl font-serif italic text-white/80">14,204</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] font-mono uppercase tracking-widest text-white/20 flex items-center gap-2">
              <Terminal size={10} className="text-purple-500/50" /> Latency
            </div>
            <div className="text-xl font-serif italic text-white/80">12ms</div>
          </div>
        </div>

        {/* Legend / HUD */}
        <div className="absolute bottom-8 right-8 p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-white/5 space-y-4 pointer-events-auto shadow-2xl">
          <div className="text-[9px] font-mono uppercase tracking-widest text-white/20">
            Territory Legend
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">LLM Highlands</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">Cloud Tundra</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">Semiconductors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <Sidebar selected={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
