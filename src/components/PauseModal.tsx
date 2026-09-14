import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../audioEngine';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

export interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart?: () => void;
  onRestartChapter?: () => void;
  onQuit?: () => void;
  chapterNumber?: number;
  chapterTitle?: string;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  onRestartChapter,
  onQuit,
}) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [showSettings, setShowSettings] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleResume = () => {
    sound.playPaperRustle();
    onClose();
  };

  const handleToggleAudio = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleReturnToMainMenu = () => {
    sound.playPaperRustle();
    onClose();
    if (onQuit) {
      onQuit();
    } else {
      navigate('/');
    }
  };

  const handleRestartAction = onRestart || onRestartChapter;

  return (
    <div
      id="pause-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResume();
      }}
    >
      <div className="relative w-full max-w-md bg-[#121815] border border-[#2d4036] rounded-xl shadow-2xl p-6 flex flex-col items-center">
        {/* Modal Content */}
        <h2 className="font-mono text-lg text-[#c2d6cc] tracking-widest mb-6 uppercase">
          စုံစမ်းစစ်ဆေးမှုကို ခေတ္တရပ်ထားသည်
        </h2>

        <div className="w-full space-y-3">
          <button
            onClick={handleResume}
            className="w-full py-2.5 px-4 rounded bg-[#1e2a24] hover:bg-[#283830] border border-[#395043] text-[#c2d6cc] hover:text-[#6ee7b7] font-mono text-sm tracking-wider transition-all cursor-pointer shadow-md"
          >
            စုံစမ်းစစ်ဆေးမှု ပြန်လည်စတင်မည်
          </button>

          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="w-full py-2.5 px-4 rounded bg-[#16201b] hover:bg-[#1e2a24] border border-[#2a3c32] text-stone-300 hover:text-[#c2d6cc] font-mono text-sm tracking-wider transition-all flex items-center justify-between cursor-pointer"
          >
            <span>အသံနှင့် မျက်နှာပြင် ဆက်တင်များ</span>
            <div className="flex items-center gap-1.5 text-xs">
              {isMuted ? (
                <span className="text-rose-400 font-mono">[အသံပိတ်ထားသည်]</span>
              ) : (
                <span className="text-emerald-400 font-mono">[အသံဖွင့်ထားသည်]</span>
              )}
            </div>
          </button>

          {showSettings && (
            <div className="p-3.5 rounded-lg bg-[#0e1411] border border-[#283930] space-y-2.5 text-xs font-mono text-[#c2d6cc]">
              <div className="flex items-center justify-between">
                <span>နောက်ခံနှင့် အသံသက်ရောက်မှုများ -</span>
                <button
                  onClick={handleToggleAudio}
                  className="px-2.5 py-1 rounded bg-[#18221d] hover:bg-[#283930] border border-[#2c3d34] text-[#82a996] hover:text-[#c2d6cc] flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      <span>အသံဖွင့်မည်</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>အသံပိတ်မည်</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-[10px] text-stone-400 pt-1 border-t border-[#1f2e26]">
                မျက်နှာပြင် - 16:9 • ၁၉၉၈ မိုးရာသီ အငွေ့အသက်
              </div>
            </div>
          )}

          {handleRestartAction && (
            <button
              onClick={() => {
                sound.playPaperRustle();
                onClose();
                handleRestartAction();
              }}
              className="w-full py-2 px-4 rounded bg-[#16201b] hover:bg-[#1e2a24] border border-[#2a3c32] text-stone-400 hover:text-stone-200 font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>အခန်း ၁ ကို အစမှ ပြန်စမည်</span>
            </button>
          )}

          <button
            onClick={handleReturnToMainMenu}
            className="w-full py-2.5 px-4 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 font-mono text-sm tracking-wider transition-all cursor-pointer shadow-md"
          >
            အခန်းရွေးချယ်မှုသို့ ပြန်ထွက်မည်
          </button>
        </div>

        <p className="text-[10px] font-mono text-[#4d6e5e] mt-5 uppercase tracking-widest">
          ပြန်စတင်ရန် [ESC] ကို နှိပ်ပါ
        </p>
      </div>
    </div>
  );
};

export const PauseMenuModal = PauseModal;
export default PauseModal;
