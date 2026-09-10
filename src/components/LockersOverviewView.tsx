import React, { useState } from 'react';
import { sound } from '../audioEngine';
import { Phase3Location } from '../types';

export interface LockersOverviewViewProps {
  hasSmallBrassKey: boolean;
  setPhase3Location: (loc: Phase3Location) => void;
  setActiveMonologue: (msg: string | null) => void;
  applyComposureDamage?: (amount: number, reason?: string) => void;
  setComposure?: React.Dispatch<React.SetStateAction<number>>;
  setIsScreenShaking?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LockersOverviewView: React.FC<LockersOverviewViewProps> = ({
  hasSmallBrassKey,
  setPhase3Location,
  setActiveMonologue,
  applyComposureDamage,
  setComposure,
  setIsScreenShaking,
}) => {
  const [hoveredLocker, setHoveredLocker] = useState<{
    text: string;
    x: number;
    y: number;
    align?: 'center' | 'right';
  } | null>(null);

  const handleSpiderScare = () => {
    sound.playCreepInsect();
    if (setIsScreenShaking) {
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 250);
    }
    if (applyComposureDamage) {
      applyComposureDamage(2, 'supernatural_direct');
    } else if (setComposure) {
      setComposure((prev) => Math.max(0, prev - 2));
    }
    setPhase3Location('locker_spider');
    setActiveMonologue("— Gah! Scurrying cellar spiders spill from behind the rusted vent slats! (-2% Composure) —");
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* 1. Locker 14 (Top-Left Tier, marked '14') */}
        <polygon
          id="hotspot-locker-14"
          points="14,10 21.5,10 21.5,57 14,57"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#385947]/30 stroke-[#4a7a60]/50 hover:stroke-[#78b394] stroke-[0.3] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredLocker({
              text: 'Inspect Locker 14',
              x: 18.8,
              y: 9.5,
            });
          }}
          onMouseLeave={() => setHoveredLocker(null)}
          onClick={() => {
            sound.playPaperRustle();
            setPhase3Location('locker_14');
          }}
        >
          <title>Inspect Locker 14 (Mama May)</title>
        </polygon>

        {/* 2. Locker 32 (Bottom-Left Tier, marked '32') */}
        <polygon
          id="hotspot-locker-32"
          points="13.5,65 19.5,63 19.5,97 13.5,107"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#385947]/30 stroke-[#4a7a60]/50 hover:stroke-[#78b394] stroke-[0.3] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredLocker({
              text: 'Inspect Locker 32',
              x: 18.8,
              y: 59.5,
            });
          }}
          onMouseLeave={() => setHoveredLocker(null)}
          onClick={() => {
            if (!hasSmallBrassKey) {
              sound.playLockJiggle();
              setActiveMonologue("Locker 32 is locked shut. The keyhole is small and brass.");
            } else {
              sound.playKeyUnlock();
              setPhase3Location('locker_32');
            }
          }}
        >
          <title>Inspect Locker 32 (Sandar)</title>
        </polygon>

        {/* 3. Locker 09 (Top-Right Tier, marked '09') */}
        <polygon
          id="hotspot-locker-09"
          points="86.8,10 95.5,7 95.8,65 86.8,63"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-[#385947]/30 stroke-[#4a7a60]/50 hover:stroke-[#78b394] stroke-[0.3] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredLocker({
              text: 'Inspect Locker 09',
              x: 88.0,
              y: 8.0,
              align: 'right',
            });
          }}
          onMouseLeave={() => setHoveredLocker(null)}
          onClick={() => {
            sound.playPaperRustle();
            setPhase3Location('locker_09');
          }}
        >
          <title>Inspect Locker 09 (Supplies)</title>
        </polygon>

        {/* 4. Locker 21 / 37 (Spider Jump Scare Click on Left/Right middle lockers) */}
        <polygon
          id="hotspot-locker-spider"
          points="31.2,23 34.2,28 34.2,55 31.2,57"
          className="pointer-events-auto cursor-pointer fill-transparent hover:fill-red-950/20 stroke-transparent hover:stroke-red-500/40 stroke-[0.2] transition-all"
          onMouseEnter={() => {
            sound.playMenuHover();
            setHoveredLocker({
              text: 'Inspect Locker',
              x: 32.7,
              y: 19.0,
            });
          }}
          onMouseLeave={() => setHoveredLocker(null)}
          onClick={handleSpiderScare}
        >
          <title>Inspect Locker</title>
        </polygon>
      </svg>

      {/* Dynamic Cursor Hover Tooltip Badge */}
      {hoveredLocker && (
        <span
          className={`absolute px-2.5 py-1 rounded bg-[#121815]/95 border border-[#2c3d34] text-[10px] font-mono text-[#82a996] whitespace-nowrap pointer-events-none shadow-lg -translate-y-full mb-2 z-40 transition-all duration-150 ${
            hoveredLocker.align === 'right' ? '-translate-x-[85%]' : '-translate-x-1/2'
          }`}
          style={{
            left: `${hoveredLocker.x}%`,
            top: `${hoveredLocker.y}%`,
          }}
        >
          {hoveredLocker.text}
        </span>
      )}
    </div>
  );
};

export default LockersOverviewView;