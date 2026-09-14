import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';

export interface Room101SeanceClimaxViewProps {
  onComplete?: () => void;
  setActiveMonologue?: (text: string | null) => void;
  backgroundImage?: string;
}

export const Room101SeanceClimaxView: React.FC<Room101SeanceClimaxViewProps> = ({
  onComplete,
  setActiveMonologue,
  backgroundImage = '/assets/scenes/well_interior_deep.jpg',
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      (sound as any).playDamage?.();
      (sound as any).playAmbientDrone?.() || (sound as any).startAmbient?.();
    } catch {}

    setActiveMonologue?.(
      "You crawl through the flooded drainage culvert into the sealed foundation beneath Room 101... The ritual chalk circle glows beneath the mud."
    );

    const timer1 = setTimeout(() => {
      setStep(1);
      setActiveMonologue?.(
        "A sudden blinding flash illuminates the darkness! Spectral memories of August 1998 violently surge across your vision..."
      );
    }, 3000);

    const timer2 = setTimeout(() => {
      setStep(2);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setActiveMonologue]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black flex items-center justify-center">
      {/* Background Graphic */}
      <img
        src={backgroundImage}
        onError={(e) => {
          e.currentTarget.src = '/assets/scenes/well_interior_deep.jpg';
        }}
        alt="Room 101 Seance Climax Flashback"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-1000 ${
          step >= 1 ? 'brightness-150 contrast-125 filter invert hue-rotate-180' : 'brightness-75'
        }`}
      />

      {/* Atmospheric Climax Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-black/40 to-black/80 pointer-events-none" />

      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.2, 0.9, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-red-600/30 mix-blend-overlay pointer-events-none"
        />
      )}

      {/* Narrative Climax Box */}
      <div className="relative z-30 max-w-xl mx-6 p-6 rounded-2xl bg-black/80 border border-red-500/40 backdrop-blur-md text-center shadow-2xl">
        <h2 className="text-2xl font-mono font-bold text-red-400 tracking-widest uppercase mb-3">
          [ CONDUIT REACHED — ROOM 101 ]
        </h2>
        <p className="text-stone-300 font-mono text-sm leading-relaxed mb-6">
          {step === 0 && "The subterranean culvert leads directly beneath the sealed floor of Room 101. The iron circle is complete."}
          {step === 1 && "May's memory fractures the veil! The monsoon of 1998 and the present day violently collide..."}
          {step >= 2 && "The investigation reaches its climax. The spirits of the hostel now acknowledge your presence."}
        </p>

        {step >= 2 && onComplete && (
          <button
            onClick={onComplete}
            className="px-6 py-2.5 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-400/60 text-red-200 font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            [ PROCEED TO INVESTIGATION EPILOGUE ]
          </button>
        )}
      </div>
    </div>
  );
};

export default Room101SeanceClimaxView;