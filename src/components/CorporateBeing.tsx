
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Entity, Epoch } from '../types';
import { User, Factory, Cpu, Users, Sparkles, Settings } from 'lucide-react';

interface CorporateBeingProps {
  entity: Entity;
  epoch: Epoch;
  onClick: (entity: Entity) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CorporateBeing: React.FC<CorporateBeingProps> = ({ 
  entity, 
  epoch, 
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const controls = useAnimation();
  const [pos, setPos] = useState(entity.position);

  // Autonomous "Walking" Behavior
  useEffect(() => {
    const walk = async () => {
      while (true) {
        const nextX = Math.max(10, Math.min(90, pos.x + (Math.random() - 0.5) * 15));
        const nextY = Math.max(10, Math.min(90, pos.y + (Math.random() - 0.5) * 15));
        
        await controls.start({
          left: `${nextX}%`,
          top: `${nextY}%`,
          transition: { duration: 5 + Math.random() * 5, ease: "easeInOut" }
        });
        setPos({ x: nextX, y: nextY });
      }
    };
    walk();
  }, []);

  const getIcon = () => {
    if (entity.logoUrl) {
      return (
        <img 
          src={entity.logoUrl} 
          alt={entity.name} 
          referrerPolicy="no-referrer"
          className="w-8 h-8 object-contain rounded-lg group-hover:scale-110 transition-transform duration-500"
        />
      );
    }
    switch (entity.type) {
      case 'Human': return <Users size={24} />;
      case 'Machine': return <Settings size={24} className="animate-spin-slow" />;
      case 'Incorporated': return <Factory size={24} />;
      case 'Synthetic': return <Cpu size={24} />;
      default: return <User size={24} />;
    }
  };

  const getAuraColor = () => {
    if (entity.isUser) return 'bg-orange-500';
    switch (entity.type) {
      case 'Human': return 'bg-amber-500';
      case 'Machine': return 'bg-zinc-500';
      case 'Incorporated': return 'bg-blue-500';
      case 'Synthetic': return 'bg-purple-500';
      default: return 'bg-white';
    }
  };

  return (
    <motion.div
      animate={controls}
      initial={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onClick={() => onClick(entity)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute cursor-pointer group z-10"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      {/* Aura / Gravitational Pull */}
      <div className={`absolute inset-0 scale-[4] blur-3xl opacity-10 rounded-full transition-all group-hover:opacity-30 ${getAuraColor()}`} />
      
      {/* The "Being" */}
      <div className="relative flex flex-col items-center">
        {/* Silhouette */}
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
            entity.isUser 
              ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]' 
              : 'bg-white/5 border-white/10 text-white/80 group-hover:border-white/40 backdrop-blur-sm'
          }`}>
            {getIcon()}
          </div>
          {/* Base Shadow */}
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full blur-[4px] transition-all duration-500 group-hover:w-8 group-hover:blur-[6px] ${entity.isUser ? 'bg-orange-500/40' : 'bg-white/10'}`} />
        </div>
        
        {/* Floating Label */}
        <div className="mt-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <div className="text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap">
            {entity.name}
          </div>
          <div className="text-[8px] font-mono text-green-500 text-center">
            {entity.value.toFixed(2)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
