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
  Database, Network, Server, Radio, Box
} from 'lucide-react';

// --- Data Definitions ---

const CONTINENTS = [
  { 
    id: 'llm', 
    name: 'LLM Highlands', 
    lat: 25, lng: 45, 
    color: '#a855f7', 
    description: 'The peaks of cognitive synthesis and linguistic modeling.',
    size: 1.8
  },
  { 
    id: 'cloud', 
    name: 'Cloud Tundra', 
    lat: -15, lng: -35, 
    color: '#3b82f6', 
    description: 'The vast frozen plains of distributed storage and server farms.',
    size: 1.8
  },
  { 
    id: 'semis', 
    name: 'Semiconductor Archipelago', 
    lat: -5, lng: 105, 
    color: '#eab308', 
    description: 'The volcanic islands of pure compute and lithography.',
    size: 1.8
  }
];

const TECH_HUBS = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    lat: 25, lng: 45, 
    color: '#a855f7', 
    value: '80B',
    type: 'Intelligence',
    icon: <Sparkles size={16} />
  },
  { 
    id: 'aws', 
    name: 'AWS', 
    lat: -15, lng: -35, 
    color: '#3b82f6', 
    value: '1.2T',
    type: 'Infrastructure',
    icon: <Cloud size={16} />
  },
  { 
    id: 'nvidia', 
    name: 'Nvidia', 
    lat: -5, lng: 105, 
    color: '#eab308', 
    value: '2.1T',
    type: 'Compute',
    icon: <Cpu size={16} />
  },
  { 
    id: 'tsmc', 
    name: 'TSMC', 
    lat: -12, lng: 115, 
    color: '#eab308', 
    value: '600B',
    type: 'Foundry',
    icon: <Database size={16} />
  },
  { 
    id: 'azure', 
    name: 'Azure', 
    lat: -10, lng: -45, 
    color: '#3b82f6', 
    value: '900B',
    type: 'Infrastructure',
    icon: <Server size={16} />
  }
];

const ARCS = [
  {
    startLat: 25, startLng: 45,
    endLat: -5, endLng: 105,
    color: ['#a855f7', '#eab308'],
    label: 'Model Training Pipeline'
  },
  {
    startLat: -15, startLng: -35,
    endLat: 25, endLng: 45,
    color: ['#3b82f6', '#a855f7'],
    label: 'Inference Request'
  },
  {
    startLat: -5, startLng: 105,
    endLat: -15, endLng: -35,
    color: ['#eab308', '#3b82f6'],
    label: 'Hardware Provisioning'
  }
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
    initial={{ x: 400, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 400, opacity: 0 }}
    className="fixed top-0 right-0 bottom-0 w-96 bg-black/90 backdrop-blur-3xl border-l border-white/10 p-10 z-50 flex flex-col gap-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
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
      <h2 className="text-5xl font-serif italic text-white leading-tight tracking-tighter">
        {selected.name}
      </h2>
      <div className="flex items-center gap-2 text-xs text-white/40 font-mono uppercase tracking-widest">
        {selected.icon && <span className="text-blue-400">{selected.icon}</span>}
        {selected.type || 'Territory'}
      </div>
    </div>

    <div className="space-y-8">
      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 group hover:bg-white/10 transition-all">
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
          <Activity size={12} /> Market Dominance
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-serif italic text-green-400">
            ${selected.value || 'N/A'}
          </span>
          {selected.value && <span className="text-[10px] text-green-500/50 font-mono">+1.2%</span>}
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
  const [showInfo, setShowInfo] = useState(true);

  // Custom globe texture placeholder (dark grid)
  const globeImageUrl = "https://unpkg.com/three-globe/example/img/earth-night.jpg";
  const bumpImageUrl = "//unpkg.com/three-globe/example/img/earth-topology.png";
  const backgroundImageUrl = "//unpkg.com/three-globe/example/img/night-sky.png";

  useEffect(() => {
    if (globeRef.current) {
      // Configure controls
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Set initial camera position
      globeRef.current.pointOfView({ lat: 20, lng: 40, altitude: 2.5 }, 4000);
    }
  }, []);

  return (
    <div className="relative h-screen w-screen bg-[#050505] overflow-hidden">
      {/* Globe Container */}
      <div className="absolute inset-0 z-0">
        <Globe
          ref={globeRef}
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
          onLabelClick={setSelectedNode}

          // Points (Tech Hubs)
          pointsData={TECH_HUBS}
          pointLat={d => (d as any).lat}
          pointLng={d => (d as any).lng}
          pointColor={d => (d as any).color}
          pointRadius={1.2}
          pointsMerge={true}
          pointAltitude={0.02}
          onPointClick={setSelectedNode}

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

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Header */}
        <header className="p-10 flex justify-between items-start pointer-events-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-blue-500" />
              <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-blue-400 font-bold">
                Digital Ecosystem v3.0
              </div>
            </div>
            <h1 className="text-6xl font-serif italic text-white tracking-tighter leading-none">
              The Global <span className="text-blue-500">Stack</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowInfo(true)}
              className="p-4 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-xl"
            >
              <Info size={24} />
            </button>
          </div>
        </header>

        {/* Bottom Stats */}
        <div className="absolute bottom-10 left-10 flex gap-16 pointer-events-auto">
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
              <Activity size={12} className="text-green-500" /> Network Load
            </div>
            <div className="text-2xl font-serif italic text-white">Optimal</div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
              <Layers size={12} className="text-blue-500" /> Active Nodes
            </div>
            <div className="text-2xl font-serif italic text-white">14,204</div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
              <Terminal size={12} className="text-purple-500" /> Latency
            </div>
            <div className="text-2xl font-serif italic text-white">12ms</div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-10 right-10 p-8 rounded-[2rem] bg-black/60 backdrop-blur-xl border border-white/10 space-y-6 pointer-events-auto shadow-2xl">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">
            Territory Legend
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <span className="text-[11px] font-mono text-white/80 uppercase tracking-wider">LLM Highlands</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span className="text-[11px] font-mono text-white/80 uppercase tracking-wider">Cloud Tundra</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <span className="text-[11px] font-mono text-white/80 uppercase tracking-wider">Semiconductors</span>
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

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-3xl bg-zinc-950 border border-white/10 p-16 rounded-[3rem] space-y-10 shadow-[0_0_100px_rgba(59,130,246,0.1)]"
            >
              <div className="flex items-center gap-6">
                <div className="p-5 rounded-[1.5rem] bg-blue-500/20 text-blue-400 shadow-inner">
                  <GlobeIcon size={48} />
                </div>
                <div>
                  <h2 className="text-6xl font-serif italic text-white leading-none">Digital Ecosystem</h2>
                  <div className="text-[10px] font-mono uppercase tracking-[0.5em] text-blue-500 mt-2">Planetary Visualization</div>
                </div>
              </div>
              
              <div className="space-y-6 text-white/60 leading-relaxed font-serif italic text-xl">
                <p>
                  This 3D interface maps the cognitive and physical geography of the global technology stack. 
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-purple-400 mb-3"><Sparkles size={24} /></div>
                    <div className="text-sm font-mono text-white uppercase mb-2">Highlands</div>
                    <div className="text-[11px] text-white/40 leading-snug">The peaks of generative intelligence and model synthesis.</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-blue-400 mb-3"><Cloud size={24} /></div>
                    <div className="text-sm font-mono text-white uppercase mb-2">Tundra</div>
                    <div className="text-[11px] text-white/40 leading-snug">The vast infrastructure layer powering global data flow.</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-yellow-400 mb-3"><Cpu size={24} /></div>
                    <div className="text-sm font-mono text-white uppercase mb-2">Archipelago</div>
                    <div className="text-[11px] text-white/40 leading-snug">The hardware foundation of pure silicon and compute.</div>
                  </div>
                </div>
                <p>
                  Interact with hubs to analyze node integrity. Arcs visualize the critical supply chains connecting intelligence to hardware.
                </p>
              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="w-full bg-white text-black font-bold py-6 rounded-[1.5rem] hover:bg-blue-500 hover:text-white transition-all text-xl shadow-2xl"
              >
                Initialize Global Interface
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
