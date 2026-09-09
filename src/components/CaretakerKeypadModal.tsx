import React, { useState } from 'react';
import { sound } from '../audioEngine';

export interface LockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  onCombinationAttemptFailed?: () => void;
}

export const CaretakerLockModal: React.FC<LockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  onCombinationAttemptFailed,
}) => {
  const [digits, setDigits] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const TARGET_COMBINATION = [2, 9, 0, 4, 1, 8];

  const cycleDigit = (index: number, direction: 'up' | 'down') => {
    sound.playMetallicTumblerClick();
    setDigits((prev) => {
      const next = [...prev];
      if (direction === 'up') {
        next[index] = (next[index] + 1) % 10;
      } else {
        next[index] = (next[index] - 1 + 10) % 10;
      }
      return next;
    });
  };

  const handleAttemptUnlock = () => {
    const isMatch = digits.every((val, idx) => val === TARGET_COMBINATION[idx]);
    if (isMatch) {
      sound.playHeavyLatchClank();
      onUnlockSuccess();
    } else {
      sound.playLockStuckRattle();
      if (onCombinationAttemptFailed) {
        onCombinationAttemptFailed();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Heavy Weathered Iron / Brass Padlock Body */}
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#241f18] via-[#1a1712] to-[#12100d] border-4 border-[#3f3526] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col items-center">
        
        {/* Curved Heavy Steel Shackle */}
        <div className="w-36 h-28 -mt-20 border-[16px] border-[#383b38] rounded-t-full shadow-inner pointer-events-none" />

        {/* Lock Faceplate Plate */}
        <div className="w-full text-center pb-3 border-b border-[#352c1e]">
          <span className="font-mono text-[10px] tracking-widest text-[#8a7a5e] uppercase">
            PATENT 1974 • HEAVY BRASS LATCH
          </span>
        </div>

        {/* 6 Rotary Number Tumblers */}
        <div className="flex gap-2 my-6 py-2 px-3 rounded-xl bg-[#0d0c0a] border border-[#2b251a] shadow-inner">
          {digits.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <button
                type="button"
                onClick={() => cycleDigit(idx, 'up')}
                className="text-[#8c7447] hover:text-[#d4af37] text-xs font-bold p-1 cursor-pointer transition-transform active:-translate-y-0.5"
                title={`Increment tumbler ${idx + 1}`}
              >
                ▲
              </button>
              <div className="w-9 h-12 rounded bg-gradient-to-b from-[#1c1813] via-[#332b1f] to-[#1c1813] border border-[#52442e] flex items-center justify-center shadow-md">
                <span className="font-serif text-xl font-bold text-[#e6cca0] select-none">
                  {digit}
                </span>
              </div>
              <button
                type="button"
                onClick={() => cycleDigit(idx, 'down')}
                className="text-[#8c7447] hover:text-[#d4af37] text-xs font-bold p-1 cursor-pointer transition-transform active:translate-y-0.5"
                title={`Decrement tumbler ${idx + 1}`}
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        {/* Unlock Latch Trigger */}
        <div className="w-full flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-[#382f21] text-xs font-mono text-[#736348] hover:text-[#ab9776] cursor-pointer"
          >
            Leave
          </button>
          <button
            type="button"
            onClick={handleAttemptUnlock}
            className="px-5 py-1.5 rounded-lg bg-[#3d311d] hover:bg-[#524227] border border-[#695431] text-xs font-serif tracking-wider text-[#fae1b4] font-semibold uppercase shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Pull Latch
          </button>
        </div>
      </div>
    </div>
  );
};

export const CaretakerKeypadModal = CaretakerLockModal;
export default CaretakerLockModal;
