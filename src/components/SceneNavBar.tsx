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
  const returnText = `${cleanDest} သို့ ပြန်သွားမည်`;

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
          className="group flex items-center gap-2 px-4 py-2 min-h-[36px] rounded-lg bg-[#060b08]/92 hover:bg-[#0b140f] border border-[#193828] hover:border-[#29543e] shadow-2xl transition-all cursor-pointer pointer-events-auto hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#6ea889] group-hover:text-[#b1d4c2] transition-colors" />
          <span className="font-burmese text-xs font-bold tracking-wide text-[#b1d4c2] group-hover:text-[#e0f0e7] transition-colors">
            {returnText}
          </span>
        </button>
      ) : (
        <div />
      )}

      {/* Right Slot: Unified AreaIndicator */}
      {fullAreaText && (
        <div className="flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-lg bg-[#060b08]/92 border border-[#193828] text-[11px] font-burmese text-[#b1d4c2] shadow-xl pointer-events-auto">
          <MapPin className="w-3 h-3 text-[#6ea889] shrink-0" />
          <span className="font-bold tracking-wide text-[#b1d4c2]">
            {fullAreaText}
          </span>
        </div>
      )}
    </div>
  );
};

export default SceneNavBar;
