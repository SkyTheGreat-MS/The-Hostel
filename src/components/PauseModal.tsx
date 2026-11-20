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
      <div className="relative w-full max-w-md bg-[#060b08]/96 rounded-none p-6 flex flex-col items-center">
        {/* Modal Content */}
        <h2 className="font-burmese font-bold text-base sm:text-lg text-[#b1d4c2] tracking-wide mb-6 text-center leading-[1.75]">
          စုံစမ်းစစ်ဆေးမှုကို ခေတ္တရပ်ထားသည်
        </h2>

        <div className="w-full space-y-3">
          <button
            onClick={handleResume}
            className="w-full py-2.5 px-4 rounded-none bg-[#193828] hover:bg-[#29543e] text-[#e0f0e7] font-burmese text-sm tracking-wide transition-colors cursor-pointer shadow-none leading-[1.75]"
          >
            စုံစမ်းစစ်ဆေးမှု ပြန်လည်စတင်မည်
          </button>

          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="w-full py-2.5 px-4 rounded-none bg-[#0b140f] hover:bg-[#101c15] text-[#b1d4c2] hover:text-[#e0f0e7] font-burmese text-sm tracking-wide transition-colors flex items-center justify-between cursor-pointer leading-[1.75]"
          >
            <span>အသံနှင့် မျက်နှာပြင် ဆက်တင်များ</span>
            <div className="flex items-center gap-1.5 text-xs font-burmese leading-[1.75]">
              {isMuted ? (
                <span className="text-[#ba2929]">[အသံပိတ်ထားသည်]</span>
              ) : (
                <span className="text-[#6ea889]">[အသံဖွင့်ထားသည်]</span>
              )}
            </div>
          </button>

          {showSettings && (
            <div className="p-3.5 rounded-none bg-[#020504]/90 space-y-2.5 text-xs font-burmese text-[#b1d4c2] leading-[1.75]">
              <div className="flex items-center justify-between">
                <span>နောက်ခံနှင့် အသံသက်ရောက်မှုများ -</span>
                <button
                  onClick={handleToggleAudio}
                  className="px-2.5 py-1 rounded-none bg-[#0b140f] hover:bg-[#101c15] text-[#6ea889] hover:text-[#b1d4c2] flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#ba2929]" />
                      <span>အသံဖွင့်မည်</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#6ea889]" />
                      <span>အသံပိတ်မည်</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-[10px] text-[#447d60] pt-1">
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
              className="w-full py-2 px-4 rounded-none bg-[#0b140f] hover:bg-[#101c15] text-[#6ea889] hover:text-[#b1d4c2] font-burmese text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer leading-[1.75]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>အခန်းကို အစမှ ပြန်စမည်</span>
            </button>
          )}

          <button
            onClick={handleReturnToMainMenu}
            className="w-full py-2.5 px-4 rounded-none bg-[#1a0404]/80 hover:bg-[#330808] text-[#fca5a5] font-burmese text-sm tracking-wide transition-colors cursor-pointer shadow-none leading-[1.75]"
          >
            အခန်းရွေးချယ်မှုသို့ ပြန်ထွက်မည်
          </button>
        </div>

        <p className="text-[10px] font-burmese text-[#447d60] mt-5 leading-[1.75]">
          ပြန်စတင်ရန် <span className="font-mono">[ESC]</span> ကို နှိပ်ပါ
        </p>
      </div>
    </div>
  );
};

export const PauseMenuModal = PauseModal;
export default PauseModal;
