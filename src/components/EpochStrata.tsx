
import React from 'react';
import { motion } from 'motion/react';
import { Epoch } from '../types';
import { Brain, Wheat, Factory, Building2, Cpu } from 'lucide-react';

interface EpochStrataProps {
  currentEpoch: Epoch;
  onEpochChange: (epoch: Epoch) => void;
}

const EPOCHS: { id: Epoch; label: string; year: string; icon: any }[] = [
  { id: 'Cognitive', label: 'Cognitive Revolution', year: '-70,000', icon: Brain },
  { id: 'Agricultural', label: 'Agricultural Revolution', year: '-12,000', icon: Wheat },
  { id: 'Industrial', label: 'Industrial Revolution', year: '1760', icon: Factory },
  { id: 'Corporate', label: 'Corporate Epoch', year: '1950', icon: Building2 },
  { id: 'AI', label: 'AI Event Horizon', year: '2024+', icon: Cpu },
];

export const EpochStrata: React.FC<EpochStrataProps> = ({ currentEpoch, onEpochChange }) => {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 rounded-full bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl">
      {EPOCHS.map((epoch) => {
        const Icon = epoch.icon;
        const isActive = currentEpoch === epoch.id;
        return (
          <button
            key={epoch.id}
            onClick={() => onEpochChange(epoch.id)}
            className={`relative flex items-center gap-3 px-6 py-3 rounded-full transition-all group ${
              isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white/10 rounded-full border border-white/20"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className={`relative z-10 p-1.5 rounded-md ${isActive ? 'text-orange-500' : 'text-white/30 group-hover:text-white/60'}`}>
              <Icon size={18} />
            </div>
            <div className="relative z-10 text-left hidden lg:block">
              <div className="text-[8px] font-mono uppercase tracking-widest opacity-50">{epoch.year}</div>
              <div className="text-xs font-medium whitespace-nowrap">{epoch.label}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
