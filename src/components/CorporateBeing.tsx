
import React, { useState, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Entity, Epoch } from '../types';
import { User, Factory, Cpu, Users, Settings, CreditCard, ShoppingBag, Rocket, Cloud, Cpu as Chip, Sparkles, Smartphone, Share2 } from 'lucide-react';

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

  const [imageError, setImageError] = useState(false);

  const getIcon = () => {
    if (entity.logoUrl && !imageError) {
      return (
        <img 
          src={entity.logoUrl} 
          alt={entity.name} 
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-8 h-8 object-contain rounded-lg group-hover:scale-110 transition-transform duration-500"
        />
      );
    }

    // Domain-specific icons for Corporate entities
    if (entity.domains && entity.domains.length > 0) {
      const primaryDomain = entity.domains[0];
      switch (primaryDomain) {
        case 'Generative AI': return <Sparkles size={24} />;
        case 'Cloud Infrastructure': return <Cloud size={24} />;
        case 'Semiconductors': return <Chip size={24} />;
        case 'Defense & Aerospace': return <Rocket size={24} />;
        case 'Social Media': return <Share2 size={24} />;
        case 'Consumer Electronics': return <Smartphone size={24} />;
        case 'FinTech': return <CreditCard size={24} />;
        case 'E-Commerce': return <ShoppingBag size={24} />;
      }
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

  // Calculate shadow angle (pointing away from center 50, 50)
  const shadowAngle = useMemo(() => {
    const dx = pos.x - 50;
    const dy = pos.y - 50;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, [pos]);

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
        {/* Planetary Shadow - Points away from center */}
        <div 
          className="absolute w-12 h-4 bg-black/40 blur-[8px] rounded-full transition-all duration-500 group-hover:w-16 group-hover:blur-[12px]"
          style={{ 
            top: '120%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${shadowAngle}deg) translateX(10px)`,
            opacity: 0.6
          }}
        />

        {/* Silhouette */}
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
            entity.isUser 
              ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]' 
              : 'bg-white/5 border-white/10 text-white/80 group-hover:border-white/40 backdrop-blur-sm'
          }`}>
            {getIcon()}
          </div>
        </div>
        
        {/* Floating Label */}
        <div className="mt-6 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-white whitespace-nowrap font-bold">
            {entity.name}
          </div>
          <div className="text-[9px] font-mono text-green-400 text-center mt-1">
            VAL: ${entity.value.toFixed(2)}B
          </div>
        </div>
      </div>
    </motion.div>
  );
};
