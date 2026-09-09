import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../audioEngine';
import { Phase3Location } from '../types';
import { ArrowLeft, MapPin, CloudRain } from 'lucide-react';
import { SceneNavBar } from './SceneNavBar';

export interface BalconySceneViewProps {
  setPhase3Location?: (location: Phase3Location) => void;
  activeMonologue?: string | null;
  setActiveMonologue?: (msg: string | null) => void;
  currentChapter?: number;
  inventory?: string[];
  setInventory?: React.Dispatch<React.SetStateAction<string[]>>;
  composure?: number;
  setComposure?: React.Dispatch<React.SetStateAction<number>>;
  discoveredClues?: string[];
  onStepBack?: () => void;
}

export const BalconySceneView: React.FC<BalconySceneViewProps> = ({
  setPhase3Location,
  activeMonologue,
  setActiveMonologue,
  currentChapter = 2,
  inventory = [],
  setInventory,
  composure = 100,
  setComposure,
  discoveredClues = [],
  onStepBack,
}) => {
  // 1. Ambient: Start looping outdoor monsoon rain audio cue on mount, cleanup on unmount
  useEffect(() => {
    try {
      sound.startRainAmbient();
    } catch {}

    return () => {
      try {
        sound.stopRainAmbient();
      } catch {}
    };
  }, []);

  // 2. Return Navigation Handler
  const handleReturnToEastFork = () => {
    try {
      sound.playDoorCreak();
    } catch {
      try {
        sound.playDoorPush();
      } catch {}
    }
    if (onStepBack) {
      onStepBack();
    } else if (setPhase3Location) {
      setPhase3Location('east_fork');
      setActiveMonologue?.('— Stepped off the rain-swept balcony back into the East Fork corridor. —');
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden select-none bg-black pointer-events-auto">
      {/* 1. Full-viewport fixed background using matching artwork */}
      <img
        src="/assets/scenes/balcony_rain_night.jpg"
        onError={(e) => {
          e.currentTarget.src = 'assets/scenes/balcony_rain_night.jpg';
        }}
        alt="Pathway 326 The Overlook Balcony"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />

      {/* 2. Ambient Rain Effect Overlay (Monsoon Night Atmosphere) */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black/60" />

      {/* 3. Standardized Scene Navigation Bar */}
      <SceneNavBar
        onReturn={handleReturnToEastFork}
        returnDestination="EAST FORK"
        areaZone="PATHWAY 326"
        areaName="THE OVERLOOK BALCONY"
      />

      {/* 4. Subdued Narrative Monologue (Bottom Docked) */}
      <AnimatePresence>
        {activeMonologue && (
          <div className="absolute bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              onClick={() => setActiveMonologue?.(null)}
              className="max-w-xl p-3.5 rounded-xl bg-[#0b120e]/90 border border-[#23382b] backdrop-blur-md shadow-2xl text-center pointer-events-auto cursor-pointer group hover:border-[#385443] transition-all"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8fa89b]/80 uppercase tracking-wider border-b border-[#1f2d26] pb-1 mb-1.5">
                <span>Observation</span>
                <span className="group-hover:text-[#6ee7b7] transition-colors">[Click to Dismiss]</span>
              </div>
              <p className="font-serif italic text-xs md:text-sm text-[#c5ded0] leading-relaxed select-none">
                "{activeMonologue}"
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BalconySceneView;
