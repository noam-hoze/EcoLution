
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationResult, Epoch } from '../types';
import { simulateStartupSurvival } from '../lib/gemini';
import { Rocket, Loader2, AlertTriangle, CheckCircle2, XCircle, Plus } from 'lucide-react';

interface FounderPortalProps {
  currentEpoch: Epoch;
  onSimulationComplete: (result: SimulationResult, name: string) => void;
}

export const FounderPortal: React.FC<FounderPortalProps> = ({ currentEpoch, onSimulationComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    if (!name || !idea) return;
    setIsSimulating(true);
    setResult(null);
    try {
      const res = await simulateStartupSurvival(name, idea, currentEpoch, []);
      setResult(res);
      onSimulationComplete(res, name);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:scale-105 transition-all group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform" />
        <span className="uppercase tracking-widest text-sm">Enter the Market</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-xl w-full bg-zinc-900 border border-white/10 p-12 rounded-3xl space-y-8 relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>

              <div className="space-y-2">
                <h2 className="text-4xl font-serif italic text-white">New Mutation</h2>
                <p className="text-sm text-white/40 leading-relaxed">
                  Introduce your entity into the {currentEpoch} ecosystem. 
                  The Market Physics will decide your fate.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 block">Entity Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Neuralink, OpenAI, Standard Oil"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 block">Core Mutation (Idea)</label>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your innovation..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500/50 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={isSimulating || !name || !idea}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-white/10 disabled:text-white/20 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 transition-all text-lg"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>Simulating Physics...</span>
                    </>
                  ) : (
                    <>
                      <Rocket size={24} />
                      <span>Launch Simulation</span>
                    </>
                  )}
                </button>
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-serif italic text-white">{result.verdict}</div>
                    <div className="text-xl font-mono text-orange-500">{Math.round(result.survivalProbability * 100)}% Survival</div>
                  </div>
                  <p className="text-sm text-white/60 italic leading-relaxed">"{result.feedback}"</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
