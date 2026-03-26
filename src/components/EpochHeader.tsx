import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Epoch } from '../types';
import { Key, Info, ChevronUp, ChevronDown } from 'lucide-react';

interface EpochHeaderProps {
  currentEpoch: Epoch;
  epochDescription: string;
  hasApiKey: boolean;
  onSelectKey: () => void;
  onToggleInfo: () => void;
  styles: {
    border: string;
    accent: string;
  };
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const EpochHeader: React.FC<EpochHeaderProps> = ({
  currentEpoch,
  epochDescription,
  hasApiKey,
  onSelectKey,
  onToggleInfo,
  styles,
  isVisible,
  onToggleVisibility
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className={`p-8 flex items-center justify-between border-b ${styles.border} bg-black/40 backdrop-blur-xl pointer-events-auto transition-all duration-1000`}
          >
            <div>
              <h1 className="text-4xl font-serif italic text-white tracking-tight">
                {currentEpoch} <span className="text-white/30 not-italic font-sans text-sm uppercase tracking-[0.3em] ml-4">Epoch</span>
              </h1>
              <p className="text-xs text-white/40 mt-2 max-w-xl leading-relaxed">
                {epochDescription || "Loading epoch context..."}
              </p>
            </div>
            <div className="flex gap-8 items-center">
              <div className="text-right hidden md:block">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">Temporal Flux</div>
                <div className={`text-sm font-mono ${styles.accent}`}>
                  {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
              
              <button 
                onClick={onSelectKey}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-[10px] font-mono uppercase tracking-widest ${
                  hasApiKey 
                    ? 'border-green-500/20 bg-green-500/5 text-green-500' 
                    : 'border-orange-500/20 bg-orange-500/5 text-orange-500 hover:bg-orange-500/10'
                }`}
              >
                <Key size={12} />
                {hasApiKey ? 'Paid Key Active' : 'Connect Paid Key'}
              </button>

              <button 
                onClick={onToggleInfo}
                className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white/50 hover:text-white"
                title="Toggle Founder Portal"
              >
                <Info size={20} />
              </button>
              
              <button 
                onClick={onToggleVisibility}
                className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white/50 hover:text-white"
                title="Hide Header"
              >
                <ChevronUp size={20} />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {!isVisible && (
        <div className="flex justify-center pt-4">
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={onToggleVisibility}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/30 hover:text-white transition-all pointer-events-auto shadow-2xl"
            title="Show Header"
          >
            <ChevronDown size={20} />
          </motion.button>
        </div>
      )}
    </div>
  );
};
