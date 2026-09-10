import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../audioEngine';
import { Phase3Location } from '../types';
import { ArrowLeft, MapPin, CloudRain } from 'lucide-react';
import { SceneNavBar } from './SceneNavBar';
import { InteractiveHotspot } from './InteractiveHotspot';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

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
  radioTuned?: boolean;
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
  radioTuned = false,
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

      <InteractiveHotspot
        id="balcony_transistor_radio"
        name="Transistor Radio"
        polygonPoints="60,51 73,53 73,70 60,70"
        cursorTooltip="[Inspect Transistor Radio]"
        onClick={() => {
          sound.playBenchInspect();
          setActiveMonologue?.(null);
          setPhase3Location?.('radio_bench_inspection');
        }}
      />

      {radioTuned && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src="/assets/characters/may_spectral_balcony.png"
          alt="Spectral May"
          className="absolute bottom-0 left-[7%] z-10 h-[68%] max-w-[38%] object-contain pointer-events-none drop-shadow-[0_0_24px_rgba(177,235,206,0.7)]"
        />
      )}
    </div>
  );
};

export default BalconySceneView;
