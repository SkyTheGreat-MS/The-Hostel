import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

export interface SceneNavBarProps {
  onReturn?: () => void;
  returnDestination?: string; // e.g. "EAST FORK", "CORRIDOR", "HALLWAY", "THRESHOLD", "LOCKER BAY", "WASHROOM", "LANDING"
  areaZone?: string;           // e.g. "EAST WING", "PATHWAY 326", "ROOM 101", "WEST WING", "WASHROOM", "LOCKER BAY"
  areaName?: string;           // e.g. "STUDENT LOCKER BAY", "THE OVERLOOK BALCONY", "CARETAKER ARCHIVE"
  areaLabel?: string;          // Direct override for full label, e.g. "PATHWAY 326 • THE OVERLOOK BALCONY"
  showReturn?: boolean;        // Default true
}

export const SceneNavBar: React.FC<SceneNavBarProps> = ({
  onReturn,
  returnDestination = 'EAST FORK',
  areaZone,
  areaName,
  areaLabel,
  showReturn = true,
}) => {
  // Format return text to standard convention: "← RETURN TO [DESTINATION]"
  const cleanDest = returnDestination
    .replace(/^←?\s*(RETURN TO|EXIT TO|STEP BACK TO|ASCEND BACK TO)\s*/i, '')
    .trim();
  const returnText = `RETURN TO ${cleanDest}`;

  // Format sub-area breadcrumb standard: "[ZONE] • [ROOM NAME]"
  const fullAreaText =
    areaLabel ||
    (areaZone && areaName
      ? `${areaZone} • ${areaName}`
      : areaName || areaZone || '');

  return (
    <div className="fixed top-20 sm:top-24 inset-x-4 z-40 flex items-center justify-between pointer-events-none select-none">
      {/* Left Slot: Unified ReturnButton */}
      {showReturn && onReturn ? (
        <button
          onClick={onReturn}
          className="group flex items-center gap-2 px-4 py-2 min-h-[36px] rounded-lg bg-[#0b120e]/90 hover:bg-[#16241c] border border-[#23382b] hover:border-[#3d5e48] shadow-2xl transition-all cursor-pointer pointer-events-auto hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#688a77] group-hover:text-[#a2c9b4] transition-colors" />
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#a2c9b4] group-hover:text-[#d3e8dc] uppercase transition-colors">
            {returnText}
          </span>
        </button>
      ) : (
        <div />
      )}

      {/* Right Slot: Unified AreaIndicator */}
      {fullAreaText && (
        <div className="flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-lg bg-[#0b120e]/90 border border-[#23382b] text-[10px] sm:text-[11px] font-mono text-[#8fa89b] shadow-xl pointer-events-auto">
          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="font-bold tracking-wider uppercase text-emerald-400/90">
            {fullAreaText}
          </span>
        </div>
      )}
    </div>
  );
};

export default SceneNavBar;
