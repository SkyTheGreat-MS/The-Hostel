import React, { useState } from 'react';
import { sound } from '../audioEngine';

export interface LockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  onCombinationAttemptFailed?: (attemptCount?: number, penalty?: number) => void;
  composure?: number;
  setComposure?: React.Dispatch<React.SetStateAction<number>>;
  setIsScreenShaking?: React.Dispatch<React.SetStateAction<boolean>>;
  failedAttempts?: number;
  setFailedAttempts?: React.Dispatch<React.SetStateAction<number>>;
}

export const CaretakerLockModal: React.FC<LockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  onCombinationAttemptFailed,
  composure,
  setComposure,
  setIsScreenShaking,
  failedAttempts,
  setFailedAttempts,
}) => {
  const [digits, setDigits] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [internalFailCount, setInternalFailCount] = useState<number>(0);
  const [lastPenalty, setLastPenalty] = useState<number | null>(null);
  const [recentAttemptNumber, setRecentAttemptNumber] = useState<number | null>(null);
  const [isJolting, setIsJolting] = useState<boolean>(false);

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
      // Escalating composure decay system:
      // 1st failed attempt = -5% Composure
      // Each subsequent failed attempt increases by +3% (5% -> 8% -> 11% -> 14%...)
      const currentFails = failedAttempts !== undefined ? failedAttempts : internalFailCount;
      const penalty = 5 + currentFails * 3;
      const nextFails = currentFails + 1;

      if (setFailedAttempts) {
        setFailedAttempts(nextFails);
      } else {
        setInternalFailCount(nextFails);
      }

      setLastPenalty(penalty);
      setRecentAttemptNumber(nextFails);
      setIsJolting(true);
      setTimeout(() => setIsJolting(false), 450);

      sound.playLockStuckRattle();
      sound.playDamage();

      if (setIsScreenShaking) {
        setIsScreenShaking(true);
        setTimeout(() => setIsScreenShaking(false), 300);
      }

      if (setComposure) {
        setComposure((prev) => Math.max(0, prev - penalty));
      }

      if (onCombinationAttemptFailed) {
        onCombinationAttemptFailed(nextFails, penalty);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Keyframe animation for lock shudder */}
      <style>{`
        @keyframes lockJolt {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-5px, 2px) rotate(-1.5deg); }
          40% { transform: translate(5px, -2px) rotate(1.5deg); }
          60% { transform: translate(-4px, 1px) rotate(-1deg); }
          80% { transform: translate(4px, -1px) rotate(0.5deg); }
        }
        .animate-lock-jolt {
          animation: lockJolt 0.4s ease-in-out;
        }
      `}</style>

      {/* Heavy Weathered Iron / Brass Padlock Body */}
      <div
        className={`relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#241f18] via-[#1a1712] to-[#12100d] border-4 ${
          isJolting
            ? 'border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-lock-jolt'
            : 'border-[#3f3526] shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
        } p-6 flex flex-col items-center transition-colors duration-200`}
      >
        
        {/* Curved Heavy Steel Shackle */}
        <div className="w-36 h-28 -mt-20 border-[16px] border-[#383b38] rounded-t-full shadow-inner pointer-events-none" />

        {/* Lock Faceplate Plate */}
        <div className="w-full pb-3 border-b border-[#352c1e] flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-widest text-[#8a7a5e] uppercase">
            မူပိုင်ခွင့် ၁၉၇၄ • အကြမ်းခံကြေးဝါဂျက်ခလောက်
          </span>
          {typeof composure === 'number' && (
            <span
              className={`font-mono text-[10px] tracking-wider font-bold transition-colors ${
                composure <= 20
                  ? 'text-red-400 animate-pulse'
                  : composure <= 45
                  ? 'text-amber-400'
                  : 'text-emerald-400/80'
              }`}
            >
              စိတ်တည်ငြိမ်မှု - {composure}%
            </span>
          )}
        </div>

        {/* 6 Rotary Number Tumblers */}
        <div className="flex gap-2 my-5 py-2 px-3 rounded-xl bg-[#0d0c0a] border border-[#2b251a] shadow-inner">
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

        {/* Failed Attempt Warning & Composure Loss Banner */}
        {lastPenalty !== null && (
          <div className="w-full mb-4 px-3 py-2 rounded-xl bg-red-950/70 border border-red-800/80 flex items-center justify-between text-xs animate-pulse">
            <div className="flex flex-col">
              <span className="font-mono text-red-300 font-bold text-[11px] flex items-center gap-1.5">
                <span>⚠️ သော့ဂျက် တင်းကျပ်နေသည်</span>
                <span className="text-[10px] text-red-400/80 font-normal">
                  (ကုဒ်အမှား အကြိမ် #{recentAttemptNumber})
                </span>
              </span>
              <span className="text-[10px] font-mono text-red-400/70">
                သော့ကွင်းက တကျီကျီမြည်ကာ မပွင့်ပါ...
              </span>
            </div>
            <div className="font-mono font-bold text-red-400 text-right tracking-wider">
              -{lastPenalty}%
              <div className="text-[9px] text-red-500/80 uppercase">စိတ်တည်ငြိမ်မှု</div>
            </div>
          </div>
        )}

        {/* Unlock Latch Trigger */}
        <div className="w-full flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-[#382f21] text-xs font-mono text-[#736348] hover:text-[#ab9776] cursor-pointer"
          >
            ပြန်ထွက်မည်
          </button>
          <button
            type="button"
            onClick={handleAttemptUnlock}
            className="px-5 py-1.5 rounded-lg bg-[#3d311d] hover:bg-[#524227] border border-[#695431] text-xs font-serif tracking-wider text-[#fae1b4] font-semibold uppercase shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            သော့ဂျက်ဆွဲဖွင့်မည်
          </button>
        </div>
      </div>
    </div>
  );
};

export const CaretakerKeypadModal = CaretakerLockModal;
export default CaretakerLockModal;
