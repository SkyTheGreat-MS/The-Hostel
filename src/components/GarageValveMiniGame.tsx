import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, AlertTriangle, CheckCircle2, X, Droplets, Waves } from 'lucide-react';
import { sound } from '../utils/audio';

export interface GarageValveMiniGameProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

/**
 * GarageValveMiniGame
 * 
 * An authentic 1990s rusted sluice valve mini-game where the player must
 * repeatedly tap Spacebar with continuous momentum to turn a stiff iron valve
 * and drain the flooded subterranean garage.
 * 
 * Mechanics:
 * - Each Spacebar press increases progress (+4.5%) and rotates the valve wheel.
 * - If the player stops pressing for >300ms, the valve begins to slip and progress regresses.
 * - As progress advances, the garage water visually recedes across 5 distinct stages (0-25%, 25-50%, 50-75%, 75-99%, 100%).
 * - At 100%, the valve locks open, the garage is permanently drained, and items become accessible.
 */
export const GarageValveMiniGame: React.FC<GarageValveMiniGameProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [valveAngle, setValveAngle] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isDecaying, setIsDecaying] = useState<boolean>(false);
  const [isPressedVisual, setIsPressedVisual] = useState<boolean>(false);

  const lastPressTimeRef = useRef<number>(Date.now());
  const progressRef = useRef<number>(0);
  const isCompletedRef = useRef<boolean>(false);
  const lastAudioTimeRef = useRef<number>(0);

  // Sync refs with state
  progressRef.current = progress;
  isCompletedRef.current = isCompleted;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setValveAngle(0);
      setIsCompleted(false);
      setIsDecaying(false);
      setIsPressedVisual(false);
      lastPressTimeRef.current = Date.now();
      progressRef.current = 0;
      isCompletedRef.current = false;
    }
  }, [isOpen]);

  // Turn Valve Action (triggered by Spacebar or Click)
  const handleTurnValve = useCallback(() => {
    if (isCompletedRef.current) return;

    const now = Date.now();
    lastPressTimeRef.current = now;

    // Throttle turn audio for a realistic ratchet / metallic creak feel
    if (now - lastAudioTimeRef.current > 90) {
      lastAudioTimeRef.current = now;
      try {
        sound.playMetallicTumblerClick?.();
      } catch {}
      if (Math.random() < 0.3) {
        try {
          sound.playMetalCreak?.();
        } catch {}
      }
    }

    // Visual press feedback
    setIsPressedVisual(true);
    setTimeout(() => setIsPressedVisual(false), 90);

    const increment = 4.5;
    const nextProgress = Math.min(100, progressRef.current + increment);
    const nextAngle = (valveAngle + 18) % 360;

    setProgress(nextProgress);
    setValveAngle(nextAngle);
    progressRef.current = nextProgress;

    // Check completion condition
    if (nextProgress >= 100 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      setIsCompleted(true);
      setIsDecaying(false);

      // Play victory / heavy valve lock audio
      try {
        sound.playMetalGateSlide?.();
      } catch {}
      setTimeout(() => {
        try {
          sound.playPhaseComplete?.();
        } catch {}
      }, 300);

      onComplete();

      // Automatically dismiss modal after showing the fully open completion state
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [valveAngle, onComplete, onClose]);

  // Regression / Decay Loop (Keep the momentum going)
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const decayInterval = setInterval(() => {
      if (isCompletedRef.current) return;

      const now = Date.now();
      const elapsedSincePress = now - lastPressTimeRef.current;
      const gracePeriodMs = 320; // Player has ~320ms between keypresses before regression kicks in

      if (elapsedSincePress > gracePeriodMs && progressRef.current > 0) {
        setIsDecaying(true);

        // Decay starts gentle and accelerates if player stays inactive
        const inactiveSeconds = (elapsedSincePress - gracePeriodMs) / 1000;
        const decayPerSecond = Math.min(22, 9 + inactiveSeconds * 6);
        const dt = 0.04; // 40ms tick
        const decayAmount = decayPerSecond * dt;

        const nextProgress = Math.max(0, progressRef.current - decayAmount);
        progressRef.current = nextProgress;
        setProgress(nextProgress);

        // Slightly rotate valve backward to visually represent loss of progress
        setValveAngle((prev) => Math.max(0, prev - decayAmount * 2));
      } else {
        setIsDecaying(false);
      }
    }, 40);

    return () => clearInterval(decayInterval);
  }, [isOpen, isCompleted]);

  // Exclusive Keyboard Input Handling (Spacebar to turn, Escape to close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && !isCompletedRef.current) {
          handleTurnValve();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (!isCompletedRef.current) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, handleTurnValve, onClose]);

  if (!isOpen) return null;

  // Determine active drainage stage based on progress
  const getStageInfo = () => {
    if (progress >= 100) {
      return {
        stage: 5,
        title: 'အဆင့် ၅ - ရေအားလုံး ခန်းခြောက်သွားပြီ',
        desc: 'အဆို့ရှင်ကို အပြည့်ဖွင့်ပြီး သော့ခတ်လိုက်ပြီ။ နောက်ကျိနေသော ရေဆိုးများ အကုန်စီးထွက်သွားပြီ။',
        color: 'text-emerald-400 border-emerald-500/80 bg-emerald-950/40',
        waterHeightPct: 0,
        swirlOpacity: 0,
      };
    }
    if (progress >= 75) {
      return {
        stage: 4,
        title: 'အဆင့် ၄ - ရေကျလုနီးပါးဖြစ်နေပြီ (၇၅–၉၉%)',
        desc: 'မြေအောက်ကြမ်းပြင် ကြွေပြားများနှင့် ကိရိယာလှောင်အိမ် နုန်းများကြားမှ ပေါ်ထွက်လာသည်။',
        color: 'text-cyan-300 border-cyan-500/70 bg-cyan-950/30',
        waterHeightPct: 10,
        swirlOpacity: 0.4,
      };
    }
    if (progress >= 50) {
      return {
        stage: 3,
        title: 'အဆင့် ၃ - ရေအရှိန်အဟုန်ဖြင့် စီးဆင်းနေသည် (၅၀–၇၅%)',
        desc: 'ကြမ်းခင်းသံဆန်ခါပေါက်များပေါ်တွင် ရေဝဲကြီးတစ်ခု ဖြစ်ပေါ်နေသည်။ ရေမျက်နှာပြင် လျင်မြန်စွာ ကျဆင်းနေသည်။',
        color: 'text-amber-300 border-amber-500/70 bg-amber-950/30',
        waterHeightPct: 22,
        swirlOpacity: 0.75,
      };
    }
    if (progress >= 25) {
      return {
        stage: 2,
        title: 'အဆင့် ၂ - ရေစတင် စီးထွက်နေသည် (၂၅–၅၀%)',
        desc: 'အတွင်းဘက် ရေနုတ်ပေါက်သည် သံသံမြည်လျက် ပွင့်သွားသည်။ ရေမျက်နှာပြင် စတင်ကျဆင်းလာသည်။',
        color: 'text-amber-400/80 border-amber-600/50 bg-amber-950/20',
        waterHeightPct: 32,
        swirlOpacity: 0.35,
      };
    }
    return {
      stage: 1,
      title: 'အဆင့် ၁ - ရေလျှံနေဆဲဖြစ်သည် (၀–၂၅%)',
      desc: 'မှောင်မည်းနေသော ရေပုပ်များအောက် နစ်မြုပ်နေသည်။ ရေဖိအားကြောင့် အဆို့ရှင်လှည့်ရ လေးလံနေသည်။',
      color: 'text-stone-400 border-stone-700 bg-stone-900/40',
      waterHeightPct: 40,
      swirlOpacity: 0,
    };
  };

  const stageInfo = getStageInfo();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden"
      >
        {/* Backdrop: Dynamic Cross-Fading Garage Images to Show Live Water Level Receding */}
        <div className="absolute inset-0 bg-black pointer-events-none">
          {/* 1. Drained Garage Background (Gains opacity as progress increases) */}
          <img
            src="/assets/scenes/garage_subterranean_rain.jpg"
            alt="Drained Garage Background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: Math.max(0.15, progress / 100) }}
            onError={(e) => {
              e.currentTarget.src = 'assets/scenes/garage_subterranean_rain.jpg';
            }}
          />

          {/* 2. Submerged Garage Background (Fades out as progress increases) */}
          <img
            src="/assets/scenes/garage_subterranean_rain_submerged.jpg"
            alt="Submerged Garage Background"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - progress / 90) }}
            onError={(e) => {
              e.currentTarget.src = 'assets/scenes/garage_subterranean_rain_submerged.jpg';
            }}
          />

          {/* 3. Physical Water Overlay (Height drops dynamically with drainage stages) */}
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#04120e]/95 via-[#08221b]/80 to-transparent transition-all duration-300 pointer-events-none"
            style={{
              height: `${stageInfo.waterHeightPct}%`,
              opacity: stageInfo.waterHeightPct > 0 ? 0.95 : 0,
            }}
          >
            {/* Water Surface Ripple / Siphon Vortex Line */}
            {stageInfo.swirlOpacity > 0 && (
              <div
                className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse"
                style={{ opacity: stageInfo.swirlOpacity }}
              />
            )}
          </div>

          {/* Atmospheric Darkening & Vignette Overlay */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
        </div>

        {/* Step Back / Close Button in Header */}
        <button
          onClick={onClose}
          disabled={isCompleted}
          className="absolute top-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b1410]/90 hover:bg-[#15271e] text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-emerald-800 font-mono text-xs tracking-wider transition-all cursor-pointer shadow-xl disabled:opacity-30 disabled:pointer-events-none"
        >
          <X className="w-3.5 h-3.5" />
          <span>[ ESC / ပြန်ထွက်မည် ]</span>
        </button>

        {/* Main Focused Mini-Game Container */}
        <div className="relative z-20 w-full max-w-xl mx-4 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131a16]/95 via-[#0c120f]/95 to-[#080d0a]/95 border-2 border-[#223329] shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
          
          {/* Header Bar: Industrial Apparatus Plate */}
          <div className="w-full text-center pb-4 border-b border-[#1c2b22] space-y-1">
            <div className="flex items-center justify-center gap-2 text-[#799988] font-mono text-[11px] tracking-[0.25em] uppercase">
              <Droplets className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SUBTERRANEAN SLUICE SYSTEM • မြေအောက် ရေနုတ်အဆို့ရှင်</span>
            </div>
            <h2 className="font-serif italic text-lg sm:text-2xl text-[#d4e4db] tracking-wide">
              လေးလံသော ရေနုတ်အဆို့ရှင်ဘီး (Drainage Valve)
            </h2>
          </div>

          {/* Stage & Status Readout Card */}
          <div className="w-full my-4 px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-colors duration-300 backdrop-blur-sm shadow-inner"
            style={{
              borderColor: isDecaying ? 'rgba(239, 68, 68, 0.6)' : isCompleted ? 'rgba(16, 185, 129, 0.7)' : 'rgba(52, 211, 153, 0.3)',
              backgroundColor: isDecaying ? 'rgba(69, 10, 10, 0.35)' : 'rgba(10, 20, 15, 0.6)',
            }}
          >
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              ) : isDecaying ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
              )}
              <span className={`font-bold tracking-wider uppercase ${isDecaying ? 'text-amber-300' : isCompleted ? 'text-emerald-300' : 'text-[#a3c2b2]'}`}>
                {stageInfo.title}
              </span>
            </div>
            <span className="font-bold text-sm sm:text-base font-mono text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Interactive Cast-Iron Valve Wheel Graphic */}
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 my-2 flex items-center justify-center cursor-pointer group"
            onClick={handleTurnValve}
            title="Click or press Spacebar to turn valve"
          >
            {/* Pressure / Momentum Ripple on Keypress */}
            {isPressedVisual && (
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/80 animate-ping pointer-events-none" />
            )}

            {/* Inactive Decay Pulse Ring */}
            {isDecaying && (
              <div className="absolute inset-0 rounded-full border border-red-500/40 animate-pulse pointer-events-none" />
            )}

            {/* SVG Industrial Valve Wheel */}
            <svg
              viewBox="0 0 240 240"
              className={`w-full h-full transition-transform duration-75 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] ${
                isPressedVisual ? 'scale-[1.03]' : 'scale-100'
              }`}
              style={{
                transform: `rotate(${valveAngle}deg)`,
              }}
            >
              <defs>
                {/* Heavy Cast Iron Radial Gradient */}
                <radialGradient id="ironRimGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#434945" />
                  <stop offset="65%" stopColor="#252c28" />
                  <stop offset="90%" stopColor="#141916" />
                  <stop offset="100%" stopColor="#0a0e0c" />
                </radialGradient>
                {/* Brass Center Nut Gradient */}
                <radialGradient id="brassHubGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="45%" stopColor="#967824" />
                  <stop offset="85%" stopColor="#574411" />
                  <stop offset="100%" stopColor="#2e2308" />
                </radialGradient>
                {/* Oxidized Spoke Gradient */}
                <linearGradient id="spokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#353e39" />
                  <stop offset="50%" stopColor="#546059" />
                  <stop offset="100%" stopColor="#222825" />
                </linearGradient>
              </defs>

              {/* Heavy Outer Cast-Iron Rim */}
              <circle cx="120" cy="120" r="102" fill="none" stroke="url(#ironRimGrad)" strokeWidth="18" />
              <circle cx="120" cy="120" r="111" fill="none" stroke="#121714" strokeWidth="2" />
              <circle cx="120" cy="120" r="93" fill="none" stroke="#101512" strokeWidth="2" />

              {/* 8 Outer Grip Knobs on the Rim */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const x = 120 + 102 * Math.cos(rad);
                const y = 120 + 102 * Math.sin(rad);
                return (
                  <circle
                    key={deg}
                    cx={x}
                    cy={y}
                    r="8"
                    fill="#1f2522"
                    stroke="#505e56"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* 4 Curved Cast-Iron Spokes connecting to central hub */}
              {/* Vertical Spoke */}
              <rect x="113" y="28" width="14" height="184" rx="6" fill="url(#spokeGrad)" stroke="#1a221e" strokeWidth="1.5" />
              {/* Horizontal Spoke */}
              <rect x="28" y="113" width="184" height="14" rx="6" fill="url(#spokeGrad)" stroke="#1a221e" strokeWidth="1.5" />

              {/* Diagonal Strengthening Ribs */}
              <line x1="60" y1="60" x2="180" y2="180" stroke="#1c2420" strokeWidth="7" strokeLinecap="round" />
              <line x1="180" y1="60" x2="60" y2="180" stroke="#1c2420" strokeWidth="7" strokeLinecap="round" />

              {/* Center Mounting Hub Flange */}
              <circle cx="120" cy="120" r="42" fill="#1b231f" stroke="#36453d" strokeWidth="3" />
              <circle cx="120" cy="120" r="34" fill="#121815" stroke="#25302a" strokeWidth="2" />

              {/* Heavy Brass Center Hexagonal Nut */}
              <polygon
                points="120,96 140,108 140,132 120,144 100,132 100,108"
                fill="url(#brassHubGrad)"
                stroke="#634f19"
                strokeWidth="2"
              />
              <circle cx="120" cy="120" r="8" fill="#18150d" />

              {/* Directional Turn Arrow Indicator */}
              <path
                d="M 80,48 A 82,82 0 0,1 155,46"
                fill="none"
                stroke={isCompleted ? '#34d399' : '#a3c2b2'}
                strokeWidth="2.5"
                strokeDasharray="4,3"
                opacity="0.75"
              />
              <polygon points="159,42 165,51 152,50" fill={isCompleted ? '#34d399' : '#a3c2b2'} />
            </svg>

            {/* Center Status Glow / Percentage Readout Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/85 border border-[#2b3d33] backdrop-blur-md flex items-center gap-1.5 shadow-2xl">
                <RotateCw className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : 'text-[#87a897] animate-spin'}`} style={{ animationDuration: '3s' }} />
                <span className="font-mono text-xs font-bold text-[#d4e4db]">
                  {isCompleted ? 'ပွင့်ပြီ' : `${Math.round(progress)}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Progress / Cycle Meter Bar with Ticks at 25%, 50%, 75%, 100% */}
          <div className="w-full mt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#7e9c8c]">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                <span>ရေနုတ်အဆို့ရှင် လှည့်ပတ်မှုအဆင့်</span>
              </span>
              <span className="font-bold text-emerald-400">
                {progress >= 100 ? '၁၀၀% ပြီးစီးပြီ' : `${Math.round(progress)}% / ၁၀၀%`}
              </span>
            </div>

            {/* Meter Bar Slot */}
            <div className="relative w-full h-4 rounded-full bg-[#09100d] border border-[#1e2d24] p-0.5 overflow-hidden shadow-inner">
              {/* Milestone Tick Marks (25%, 50%, 75%) */}
              <div className="absolute inset-y-0 left-[25%] w-px bg-[#263b2f] z-10" />
              <div className="absolute inset-y-0 left-[50%] w-px bg-[#263b2f] z-10" />
              <div className="absolute inset-y-0 left-[75%] w-px bg-[#263b2f] z-10" />

              {/* Progress Fill Bar with Dynamic Gradient */}
              <motion.div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${progress}%`,
                  background: isCompleted
                    ? 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)'
                    : isDecaying
                    ? 'linear-gradient(90deg, #991b1b 0%, #b45309 50%, #d97706 100%)'
                    : 'linear-gradient(90deg, #164e3f 0%, #0d9488 50%, #10b981 100%)',
                  boxShadow: isCompleted
                    ? '0 0 15px rgba(52, 211, 153, 0.8)'
                    : '0 0 10px rgba(16, 185, 129, 0.4)',
                }}
              />
            </div>

            {/* Tick Mark Labels */}
            <div className="flex justify-between text-[9px] font-mono text-stone-500 px-1">
              <span>၀% (ပိတ်ထားသည်)</span>
              <span>၂၅%</span>
              <span>၅၀%</span>
              <span>၇၅%</span>
              <span>၁၀၀% (ရေကျသွားပြီ)</span>
            </div>
          </div>

          {/* Dynamic Momentum Guidance Message */}
          <div className="w-full mt-3 text-center min-h-[22px]">
            {isCompleted ? (
              <span className="font-mono text-xs font-bold text-emerald-300 tracking-wider flex items-center justify-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                အဆို့ရှင် အပြည့်ပွင့်သွားပြီ • ရေများ အကုန်စီးထွက်သွားခဲ့ပြီ!
              </span>
            ) : isDecaying ? (
              <span className="font-mono text-xs font-bold text-amber-400 tracking-wider flex items-center justify-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                အဆို့ရှင် ပြန်လည်လျောကျနေသည်! အရှိန်မပျက်စေရန် ဆက်တိုက်နှိပ်ပေးပါ!
              </span>
            ) : progress > 0 ? (
              <span className="font-mono text-xs text-[#a2c9b4] tracking-wider">
                အဆို့ရှင်ကို လှည့်နေသည်... အရှိန်မပျက်စေရန် ဆက်တိုက်နှိပ်ပါ!
              </span>
            ) : (
              <span className="font-mono text-xs text-stone-400 tracking-wider">
                သံချေးတက်နေသည် — လှည့်နိုင်ရန် လျင်မြန်ပြီး စဉ်ဆက်မပြတ် ဖိအားပေးရန် လိုအပ်သည်
              </span>
            )}
          </div>

          {/* Large Tactile Spacebar Action Button Prompt */}
          <div className="w-full mt-5 pt-4 border-t border-[#1c2b22] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleTurnValve}
              disabled={isCompleted}
              className={`w-full sm:flex-1 py-3 px-5 rounded-2xl border flex items-center justify-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 pointer-events-none'
                  : isPressedVisual
                  ? 'bg-emerald-600 text-stone-950 border-emerald-400 scale-[0.98]'
                  : 'bg-[#15231c] hover:bg-[#1f3329] border-[#314a3b] hover:border-emerald-500 text-[#d4e4db] hover:text-emerald-200 hover:scale-[1.01] active:scale-95'
              }`}
            >
              <kbd className="px-2.5 py-1 rounded bg-[#090e0b] border border-[#263b2f] text-emerald-400 text-xs font-mono shadow-inner">
                SPACE
              </kbd>
              <span>{isCompleted ? 'အဆို့ရှင် အပြည့်ပွင့်သွားပြီ' : 'SPACEBAR ကို အဆက်မပြတ် နှိပ်ပါ'}</span>
            </button>

            <span className="text-[10px] font-mono text-stone-500 text-center sm:text-right">
              {isCompleted ? 'ရေဖောက်ထုတ်မှု ပြီးဆုံးပြီ' : 'သို့မဟုတ် လှည့်ရန် အဆို့ရှင်ကို ကလစ်နှိပ်ပါ'}
            </span>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GarageValveMiniGame;
