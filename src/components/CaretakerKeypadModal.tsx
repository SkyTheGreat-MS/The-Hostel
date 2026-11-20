import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { sound } from '../audioEngine';

export interface LockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  onCombinationAttemptFailed?: (attemptCount?: number, penalty?: number) => void;
  composure?: number;
  setComposure?: React.Dispatch<React.SetStateAction<number>>;
  applyDamage?: (amount: number, type: 'physical' | 'mental', source?: string) => void;
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
  applyDamage,
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

      if (applyDamage) {
        applyDamage(penalty, 'mental', 'keypad_failure');
      } else if (setComposure) {
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
        className={`relative w-full max-w-sm rounded-none bg-gradient-to-b from-[#241f18] via-[#1a1712] to-[#12100d] ${
          isJolting
            ? 'bg-red-950/40 animate-lock-jolt'
            : ''
        } p-6 flex flex-col items-center transition-colors duration-200`}
      >
        
        {/* Curved Heavy Steel Shackle */}
        <div className="w-36 h-28 -mt-20 border-[16px] border-[#383b38] rounded-t-full shadow-inner pointer-events-none" />

        {/* Lock Faceplate Plate */}
        <div className="w-full pb-3 flex items-center justify-between">
          <span className="font-burmese text-[11px] tracking-wide text-[#a37f37] leading-[1.75]">
            မူပိုင်ခွင့် ၁၉၇၄ • အကြမ်းခံကြေးဝါဂျက်ခလောက်
          </span>
          {typeof composure === 'number' && (
            <span
              className={`font-burmese text-xs font-bold tracking-wide transition-colors leading-[1.75] tabular-nums ${
                composure <= 20
                  ? 'text-red-400 animate-pulse'
                  : composure <= 45
                  ? 'text-amber-400'
                  : 'text-[#6ea889]'
              }`}
            >
              စိတ်တည်ငြိမ်မှု - {composure}%
            </span>
          )}
        </div>

        {/* 6 Rotary Number Tumblers */}
        <div className="flex gap-2 my-5 py-2 px-3 rounded-none bg-[#0d0c0a] shadow-inner">
          {digits.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1">
              <button
                type="button"
                onClick={() => cycleDigit(idx, 'up')}
                className="text-[#8c7447] hover:text-[#d4af37] text-xs font-bold p-1 cursor-pointer transition-transform active:-translate-y-0.5"
                title={`ဂဏန်းတံ မြှင့်တင်ရန် ${idx + 1}`}
              >
                ▲
              </button>
              <div className="w-9 h-12 rounded-none bg-gradient-to-b from-[#1c1813] via-[#332b1f] to-[#1c1813] flex items-center justify-center">
                <span className="font-mono text-xl font-bold text-[#e6cca0] select-none tabular-nums">
                  {digit}
                </span>
              </div>
              <button
                type="button"
                onClick={() => cycleDigit(idx, 'down')}
                className="text-[#8c7447] hover:text-[#d4af37] text-xs font-bold p-1 cursor-pointer transition-transform active:translate-y-0.5"
                title={`ဂဏန်းတံ လျှော့ချရန် ${idx + 1}`}
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        {/* Failed Attempt Warning & Composure Loss Banner */}
        {lastPenalty !== null && (
          <div className="w-full mb-4 px-3 py-2 rounded-none bg-red-950/70 flex items-center justify-between text-xs animate-pulse">
            <div className="flex flex-col">
              <span className="font-burmese text-red-300 font-bold text-[11px] flex items-center gap-1.5 leading-[1.75]">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>သော့ဂျက် တင်းကျပ်နေသည်</span>
                <span className="text-[10px] text-red-400/80 font-normal">
                  (ကုဒ်အမှား အကြိမ် #{recentAttemptNumber})
                </span>
              </span>
              <span className="text-[10px] font-burmese text-red-400/70 leading-[1.75]">
                သော့ကွင်းက တကျီကျီမြည်ကာ မပွင့်ပါ...
              </span>
            </div>
            <div className="font-mono font-bold text-red-400 text-right tracking-wider tabular-nums">
              -{lastPenalty}%
              <div className="text-[9px] font-burmese text-red-500/80 uppercase leading-[1.75]">စိတ်တည်ငြိမ်မှု</div>
            </div>
          </div>
        )}

        {/* Unlock Latch Trigger */}
        <div className="w-full flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-none bg-transparent text-xs font-burmese text-[#a37f37] hover:text-[#c7a458] cursor-pointer leading-[1.75] transition-colors"
          >
            ပြန်ထွက်မည်
          </button>
          <button
            type="button"
            onClick={handleAttemptUnlock}
            className="px-5 py-1.5 rounded-none bg-[#3d311d] hover:bg-[#524227] text-xs font-burmese tracking-wide text-[#fae1b4] font-bold uppercase transition-colors active:scale-95 cursor-pointer leading-[1.75]"
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
