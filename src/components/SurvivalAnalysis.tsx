import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Shield, Cpu, Cloud, Sparkles, Activity, 
  Layers, Globe as GlobeIcon, Info, X, Terminal,
  Database, Network, Server, Radio, Box, Play, Pause,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  ArrowRight, Loader2, Linkedin, Plus, Trash2, UserCheck
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
    teamSize: 1,
    founderLinkedIn: ['']
  });
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const SURVIVAL_THRESHOLD = 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('analyzing');
    setError(null);

    try {
      const result = await analyzeCompanySurvival(
        formData.name,
        formData.description,
        formData.funding,
        formData.teamSize,
        formData.founderLinkedIn.filter(url => url.trim() !== '')
      );
      setAnalysis(result);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setStep('input');
    }
  };

  const handleDeploy = () => {
    if (analysis && onCompanyCreated) {
      onCompanyCreated({
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        lat: analysis.coordinates.lat,
        lng: analysis.coordinates.lng,
        color: analysis.survivalChance >= SURVIVAL_THRESHOLD ? '#22c55e' : '#ef4444',
        type: analysis.inferredDomain,
        description: analysis.prediction,
        value: formData.funding, // Use funding as initial valuation
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`,
        isUserCompany: true,
        analysis: analysis
      });
      onClose();
    }
  };

  const getTerritoryName = (id: string) => {
    const names: Record<string, string> = {
      llm: 'LLM Highlands',
      cloud: 'Cloud Tundra',
      semis: 'The Silicon Spires',
      cyber: 'The Citadel of Crypt',
      fintech: 'FinTech Nexus',
      robotics: 'The Automaton Frontier',
      biotech: 'The Genomic Archipelago',
      energy: 'The Solar Plains',
      quantum: 'The Qubit Reef',
      spatial: 'The Synthetic Valleys',
      space: 'The Celestial Harbor'
    };
    return names[id] || 'Unknown Territory';
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
          <div className="flex justify-end mb-10">
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
                    Let me <span className="text-red-500">in!</span>
                  </h2>
                  <p className="text-sm text-white/40 font-mono uppercase tracking-widest">
                    Define your company. AI will assess your survival probability and infer your global territory.
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                      placeholder="e.g. NeuralFlow"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Description & Moat</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/50 transition-colors h-32 resize-none"
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
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
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                        <Linkedin size={10} className="text-red-400" /> Founder LinkedIn Profiles
                      </label>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, founderLinkedIn: [...formData.founderLinkedIn, '']})}
                        className="text-[10px] font-mono uppercase tracking-widest text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Plus size={10} /> Add Founder
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.founderLinkedIn.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <input 
                            required
                            type="url"
                            value={url}
                            onChange={e => {
                              const newFounders = [...formData.founderLinkedIn];
                              newFounders[index] = e.target.value;
                              setFormData({...formData, founderLinkedIn: newFounders});
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                            placeholder="https://linkedin.com/in/founder"
                          />
                          {formData.founderLinkedIn.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => {
                                const newFounders = formData.founderLinkedIn.filter((_, i) => i !== index);
                                setFormData({...formData, founderLinkedIn: newFounders});
                              }}
                              className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/50 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
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
                    className="w-full py-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-serif italic text-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center gap-3 group"
                  >
                    Yalla/Vamos/Let's go!
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
                  <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl animate-pulse" />
                  <Loader2 size={80} className="text-red-500 animate-spin relative z-10" />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-serif italic text-white tracking-tighter">
                    Inferring <span className="text-red-500">Identity</span>
                  </h3>
                  <div className="space-y-2">
                    <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse">Analyzing Description...</p>
                    <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse delay-75">Determining Industry Domain...</p>
                    <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse delay-150">Locating Global Stack Territory...</p>
                    <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse delay-200">Calculating Survival Probability...</p>
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
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          {analysis.inferredDomain}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          Territory: {getTerritoryName(analysis.suggestedTerritoryId)}
                        </span>
                      </div>
                    </div>
                    <motion.div 
                      animate={analysis.survivalChance >= SURVIVAL_THRESHOLD ? {
                        scale: [1, 1.05, 1],
                        boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 20px rgba(34,197,94,0.4)", "0 0 0px rgba(34,197,94,0)"]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`px-4 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border ${
                        analysis.survivalChance >= SURVIVAL_THRESHOLD ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                        'bg-red-900/20 border-red-900/50 text-red-500'
                      }`}
                    >
                      {analysis.survivalChance >= SURVIVAL_THRESHOLD ? 'SUCCESS' : 'FAILURE'}
                    </motion.div>
                  </div>
                  
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      {analysis.survivalChance >= SURVIVAL_THRESHOLD ? <TrendingUp size={80} className="text-green-500" /> : <TrendingDown size={80} className="text-red-500" />}
                    </div>
                    <div className="grid grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">Survival Probability</div>
                        <div className={`text-7xl font-serif italic ${analysis.survivalChance >= SURVIVAL_THRESHOLD ? 'text-green-400' : 'text-red-500'}`}>
                          {analysis.survivalChance}%
                        </div>
                      </div>
                      <div className="space-y-2 border-l border-white/10 pl-8">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
                          <UserCheck size={12} className="text-red-400" /> Credibility Score
                        </div>
                        <div className="text-7xl font-serif italic text-red-500">{analysis.dueDiligence.credibilityScore}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {analysis.survivalChance >= SURVIVAL_THRESHOLD ? (
                    <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 space-y-3">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-green-400 flex items-center gap-2">
                        <CheckCircle2 size={12} /> Access Granted
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed italic">
                        Your entity has met the minimum survival threshold. You are cleared for deployment into the Global Stack.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 flex items-center gap-2">
                        <AlertCircle size={12} /> Access Denied
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed italic">
                        Survival probability is below critical threshold. Deployment into the Global Stack is prohibited to prevent ecosystem pollution.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">AI Prediction</div>
                    <p className="text-lg text-white/80 leading-relaxed font-serif italic">
                      "{analysis.prediction}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-red-400/50">Strengths</div>
                      <ul className="space-y-2">
                        {analysis.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <CheckCircle2 size={12} className="text-red-400 mt-0.5 shrink-0" />
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
                </div>

                <div className="flex flex-col gap-4">
                  {analysis.survivalChance >= SURVIVAL_THRESHOLD ? (
                    <button 
                      onClick={handleDeploy}
                      className="w-full py-6 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-serif italic text-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 group"
                    >
                      Deploy to Global Stack
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setStep('input')}
                      className="w-full py-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-serif italic text-xl transition-all flex items-center justify-center gap-3 group"
                    >
                      Recalibrate Entity
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  
                  <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-mono uppercase tracking-widest"
                  >
                    Abort Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
