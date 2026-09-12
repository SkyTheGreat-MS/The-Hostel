import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { SceneNavBar } from './SceneNavBar';

export interface RadioBenchInspectionViewProps {
  inventory: string[];
  setInventory: React.Dispatch<React.SetStateAction<string[]>>;
  radioHasBatteries: boolean;
  setRadioHasBatteries: React.Dispatch<React.SetStateAction<boolean>>;
  onReturn: () => void;
  onTuned: () => void;
  setActiveMonologue: (message: string | null) => void;
}

export const RadioBenchInspectionView: React.FC<RadioBenchInspectionViewProps> = ({
  inventory,
  setInventory,
  radioHasBatteries,
  setRadioHasBatteries,
  onReturn,
  onTuned,
  setActiveMonologue,
}) => {
  const [showBatteryPrompt, setShowBatteryPrompt] = useState(false);
  const [isTuning, setIsTuning] = useState(false);
  const [frequency, setFrequency] = useState(88.0);
  const [hoveredHotspot, setHoveredHotspot] = useState<{ text: string; x: number; y: number } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const staticAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastClickFreq = useRef<number>(Math.floor(88.0));
  const sliderRef = useRef<HTMLInputElement>(null);

  const MIN_FREQ = 80.0;
  const MAX_FREQ = 120.0;
  const TARGET_FREQ = 104.2;
  const LOCK_MIN = 104.1;
  const LOCK_MAX = 104.3;

  const startStaticLoop = useCallback(() => {
    if (staticAudioRef.current) return;
    try {
      const audio = new Audio('/assets/audio/sfx/radio_static.mp3');
      audio.loop = true;
      audio.volume = 0.25;
      audio.play().catch(() => { });
      staticAudioRef.current = audio;
    } catch { }
  }, []);

  const stopStaticLoop = useCallback(() => {
    if (!staticAudioRef.current) return;
    try {
      staticAudioRef.current.pause();
      staticAudioRef.current.currentTime = 0;
    } catch { }
    staticAudioRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      stopStaticLoop();
    };
  }, [stopStaticLoop]);

  const hasBatteries = inventory.includes('battery_pair');

  const handleBatteryCompartmentClick = () => {
    if (radioHasBatteries) {
      setActiveMonologue(
        '— Two zinc-carbon batteries are fitted tightly into the coils. The power circuit is closed. —'
      );
      return;
    }
    if (!hasBatteries) {
      setActiveMonologue(
        '— The compartment is empty. The contact springs are dry. It takes two heavy D-cell batteries to operate. —'
      );
      return;
    }
    setActiveMonologue(null);
    setShowBatteryPrompt(true);
  };

  const insertBatteries = () => {
    sound.playBatteryInsert();
    setInventory((items) => {
      const index = items.indexOf('battery_pair');
      return index === -1 ? items : [...items.slice(0, index), ...items.slice(index + 1)];
    });
    setRadioHasBatteries(true);
    setShowBatteryPrompt(false);
    setActiveMonologue(
      '— The springs bite into the terminals. Faint hum vibrates through the speaker grille. —'
    );
  };

  const handleTuningDialClick = () => {
    if (!radioHasBatteries) {
      setActiveMonologue(
        '— No power. The frequency needle won\'t move until batteries are installed. —'
      );
      return;
    }
    setIsTuning(true);
    startStaticLoop();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    const val = parseFloat(e.target.value);
    setFrequency(val);

    if (!staticAudioRef.current) startStaticLoop();

    const wholeNum = Math.floor(val);
    if (wholeNum !== lastClickFreq.current) {
      lastClickFreq.current = wholeNum;
      sound.playDialClick();
    }

    if (staticAudioRef.current) {
      const inProximity = val >= 102.0 && val <= 106.0;
      staticAudioRef.current.volume = inProximity ? 0.12 : 0.25;
    }
  };

  const handleSliderRelease = () => {
    if (isLocked) return;
    if (frequency >= LOCK_MIN && frequency <= LOCK_MAX) {
      setIsLocked(true);
      stopStaticLoop();
      sound.playRadioBallad();
      setActiveMonologue(
        '— The harsh static dissolves into an acoustic melody... echoing out into the monsoon rain. —'
      );
      setTimeout(() => {
        setIsTuning(false);
        onTuned();
      }, 1500);
    }
  };

  const sliderPercent = ((frequency - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;

  const batteryCompartmentTooltip = radioHasBatteries
    ? 'Battery Compartment (Powered)'
    : 'Inspect Battery Compartment';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black select-none">
      <img
        src="/assets/scenes/radio_bench_inspection.jpg"
        alt="Transistor radio on the balcony bench"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      <SceneNavBar
        onReturn={onReturn}
        returnDestination="BALCONY"
        areaZone="PATHWAY 326"
        areaName="RADIO BENCH"
      />

      <div className="absolute inset-0 z-30 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Battery Compartment - Lower right open hatch with spring terminals */}
          <polygon
            id="hotspot-battery-compartment"
            points="65,50 77.2,50.0 77.0,84 65,88"
            className="pointer-events-auto cursor-pointer fill-transparent hover:fill-emerald-500/15 stroke-transparent hover:stroke-emerald-400 hover:stroke-[0.8] hover:[stroke-dasharray:2,2] transition-all duration-200"
            onMouseEnter={() => {
              sound.playMenuHover();
              setHoveredHotspot({ text: batteryCompartmentTooltip, x: 69.4, y: 46 });
            }}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={handleBatteryCompartmentClick}
          >
            <title>{batteryCompartmentTooltip}</title>
          </polygon>

          {/* Tuning Dial - Center frequency knob */}
          <ellipse
            cx="53"   // center x-coordinate
            cy="40"   // center y-coordinat
            rx="8"
            ry="16"   // radius
            className="pointer-events-auto cursor-pointer fill-transparent hover:fill-emerald-500/15 stroke-transparent hover:stroke-emerald-400 hover:stroke-[0.8] hover:[stroke-dasharray:2,2] transition-all duration-200"
            onMouseEnter={() => {
              sound.playMenuHover();
              setHoveredHotspot({ text: 'Adjust Tuning Dial', x: 50, y: 30 });
            }}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={handleTuningDialClick}
          >
            <title>Adjust Tuning Dial</title>
          </ellipse>
        </svg>

        {/* Hover tooltip anchored above the hovered hotspot */}
        {hoveredHotspot && (
          <span
            className="absolute px-2.5 py-1 rounded bg-[#121815]/95 border border-[#2c3d34] text-[10px] font-mono text-[#82a996] whitespace-nowrap pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full mb-2 z-40"
            style={{ left: `${hoveredHotspot.x}%`, top: `${hoveredHotspot.y}%` }}
          >
            {hoveredHotspot.text}
          </span>
        )}
      </div>

      <AnimatePresence>
        {showBatteryPrompt && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={insertBatteries}
            className="absolute bottom-10 left-1/2 z-40 -translate-x-1/2 rounded-full border border-[#587867] bg-[#0b120e]/95 px-5 py-3 font-mono text-xs font-bold tracking-wider text-[#c5ded0] shadow-2xl transition hover:border-[#9cc7aa] hover:text-white"
          >
            [ Insert 2x D-Cell Batteries ]
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTuning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="absolute left-1/2 top-1/2 z-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#41594b] bg-[#08100c]/90 p-5 text-center shadow-2xl backdrop-blur-md"
          >
            {/* Frequency Readout */}
            <div className={`mb-5 font-mono text-3xl tracking-wider transition-colors duration-300 ${isLocked ? 'text-emerald-400' : 'text-[#d9eadf]'}`}>
              {frequency.toFixed(1)} <span className="text-sm text-[#8fa89b]">AM kHz</span>
            </div>

            {/* Analog Slider Track */}
            <div className="relative mb-3 h-8">
              {/* Track background */}
              <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-[#1a2b22]" />

              {/* Filled portion */}
              <div
                className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-all duration-75"
                style={{
                  width: `${sliderPercent}%`,
                  background: isLocked
                    ? 'linear-gradient(90deg, #385443, #4ade80)'
                    : 'linear-gradient(90deg, #385443, #587867)',
                }}
              />

              {/* Tick marks */}
              {[80, 90, 100, 110, 120].map((tick) => {
                const pos = ((tick - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;
                return (
                  <div
                    key={tick}
                    className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-[#4a7a60]/40"
                    style={{ left: `${pos}%` }}
                  />
                );
              })}

              {/* Native range input (invisible, handles drag) */}
              <input
                ref={sliderRef}
                type="range"
                min={MIN_FREQ}
                max={MAX_FREQ}
                step={0.1}
                value={frequency}
                onChange={handleSliderChange}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
                disabled={isLocked}
                className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#82a996] [&::-webkit-slider-thumb]:bg-[#0b120e] [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(130,169,150,0.4)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:border-emerald-400 [&::-webkit-slider-thumb]:hover:shadow-[0_0_12px_rgba(52,211,153,0.5)] [&::-webkit-slider-thumb]:disabled:cursor-default [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#82a996] [&::-moz-range-thumb]:bg-[#0b120e]"
              />
            </div>

            {/* Band labels */}
            <div className="flex justify-between px-1 font-mono text-[9px] text-[#4a7a60]/60">
              <span>80</span>
              <span>90</span>
              <span>100</span>
              <span>110</span>
              <span>120</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadioBenchInspectionView;
