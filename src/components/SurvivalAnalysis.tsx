import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Shield, Cpu, Cloud, Sparkles, Activity, 
  Layers, Globe as GlobeIcon, Info, X, Terminal,
  Database, Network, Server, Radio, Box, Play, Pause,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  ArrowRight, Loader2
} from 'lucide-react';
import { analyzeCompanySurvival, CompanyAnalysis } from '../services/aiEngine';

interface SurvivalAnalysisProps {
  onClose: () => void;
  onCompanyCreated?: (company: any) => void;
}

export const SurvivalAnalysis: React.FC<SurvivalAnalysisProps> = ({ onClose, onCompanyCreated }) => {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [formData, setFormData] = useState({
    name: '',
    domain: 'Intelligence',
    description: '',
    funding: '',
    teamSize: 1
  });
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const domains = ['Intelligence', 'Infrastructure', 'Compute', 'Foundry', 'Lithography'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('analyzing');
    setError(null);

    try {
      const result = await analyzeCompanySurvival(
        formData.name,
        formData.description,
        formData.funding,
        formData.teamSize
      );
      setAnalysis(result);
      setStep('result');
      
      if (onCompanyCreated) {
        onCompanyCreated({
          id: formData.name.toLowerCase().replace(/\s+/g, '-'),
          name: formData.name,
          lat: result.coordinates.lat,
          lng: result.coordinates.lng,
          color: result.verdict === 'SURVIVE' ? '#22c55e' : result.verdict === 'ACQUIRED' ? '#3b82f6' : '#ef4444',
          type: result.inferredDomain,
          description: result.prediction,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`,
          isUserCompany: true,
          analysis: result
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setStep('input');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-12 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-purple-500/50" />
              <div className="text-[11px] font-mono uppercase tracking-[0.4em] text-purple-400 font-bold">
                Survival Engine v1.1
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-6xl font-serif italic text-white tracking-tighter">
                    Let me <span className="text-purple-500">in!</span>
                  </h2>
                  <p className="text-sm text-white/40 font-mono uppercase tracking-widest">
                    Define your company. Domain and territory will be inferred by AI.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Company Name</label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      placeholder="e.g. NeuralFlow"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Description & Moat</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors h-32 resize-none"
                      placeholder="What do you build? Why can't the giants copy you?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Initial Funding</label>
                      <input 
                        required
                        type="text"
                        value={formData.funding}
                        onChange={e => setFormData({...formData, funding: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                        placeholder="e.g. $5M"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Team Size</label>
                      <input 
                        required
                        type="number"
                        min="1"
                        value={formData.teamSize}
                        onChange={e => setFormData({...formData, teamSize: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-serif italic text-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3 group"
                  >
                    Start
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'analyzing' && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex-1 flex flex-col items-center justify-center space-y-8 py-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse" />
                  <Loader2 size={80} className="text-purple-500 animate-spin relative z-10" />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-serif italic text-white tracking-tighter">
                    Inferring <span className="text-purple-500">Identity</span>
                  </h3>
                  <div className="space-y-2">
                    <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse">Analyzing Description...</p>
                    <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse delay-75">Determining Industry Domain...</p>
                    <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse delay-150">Locating Global Stack Territory...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'result' && analysis && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-5xl font-serif italic text-white tracking-tighter">
                        {formData.name}
                      </h2>
                      <div className="flex gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {analysis.inferredDomain}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          Territory: {analysis.suggestedTerritoryId === 'llm' ? 'LLM Highlands' : analysis.suggestedTerritoryId === 'cloud' ? 'Cloud Tundra' : 'Semiconductor Archipelago'}
                        </span>
                      </div>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border ${
                      analysis.verdict === 'SURVIVE' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                      analysis.verdict === 'ACQUIRED' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' :
                      'bg-red-500/10 border-red-500/50 text-red-400'
                    }`}>
                      {analysis.verdict}
                    </div>
                  </div>
                  
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      {analysis.survivalChance > 50 ? <TrendingUp size={80} /> : <TrendingDown size={80} />}
                    </div>
                    <div className="relative z-10 space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">Survival Probability</div>
                      <div className="text-7xl font-serif italic text-white">{analysis.survivalChance}%</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">AI Prediction</div>
                    <p className="text-lg text-white/80 leading-relaxed font-serif italic">
                      "{analysis.prediction}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-green-500/50">Strengths</div>
                      <ul className="space-y-2">
                        {analysis.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-red-500/50">Weaknesses</div>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((w, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <AlertCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400">Competitive Landscape</div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {analysis.competitiveLandscape}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">Suggested Strategy</div>
                    <p className="text-sm text-white/70 leading-relaxed italic">
                      {analysis.suggestedStrategy}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setStep('input')}
                  className="w-full py-4 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-widest"
                >
                  Analyze Another Entity
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
