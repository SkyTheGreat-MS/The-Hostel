import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LilyBorder } from './LilyBorder';
import { sound } from '../audioEngine';
import {
  Play,
  RotateCcw,
  LogOut,
  Volume2,
  VolumeX,
  ShieldAlert,
} from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartChapter?: () => void;
  chapterNumber?: number;
  chapterTitle?: string;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onClose,
  onRestartChapter,
  chapterNumber = 1,
  chapterTitle = 'Blind Start',
}) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = React.useState<boolean>(sound.getMuted());

  if (!isOpen) return null;

  const toggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleExitToMenu = () => {
    sound.playPaperRustle();
    onClose();
    navigate('/');
  };

  const handleExitToChapters = () => {
    sound.playPaperRustle();
    onClose();
    navigate('/chapters');
  };

  const handleResume = () => {
    sound.playPaperRustle();
    onClose();
  };

  return (
    <div
      id="pause-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-md">
        <LilyBorder className="w-full bg-red-950/95 border-2 border-red-900/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center pb-4 border-b border-red-900/60 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 border border-red-800/80 rounded-full text-xs font-mono text-amber-300 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>INVESTIGATION PAUSED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bebas font-black text-amber-100 tracking-wider">
              THE SPIRIT&apos;S LABYRINTH
            </h2>
            <p className="text-xs font-mono text-red-300/80 mt-1">
              Chapter {chapterNumber}: {chapterTitle} • August 1998
            </p>
          </div>

          {/* Action Menu Buttons */}
          <div className="space-y-3">
            {/* Resume */}
            <button
              id="pause-resume-btn"
              onClick={handleResume}
              className="w-full py-3 px-4 bg-red-900/70 hover:bg-red-800/90 border border-red-700/80 rounded-xl text-amber-100 font-bebas text-lg tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>RESUME INVESTIGATION</span>
            </button>

            {/* Audio Toggle */}
            <button
              id="pause-audio-btn"
              onClick={toggleSound}
              className="w-full py-2.5 px-4 bg-black/60 hover:bg-black/80 border border-red-900/60 rounded-xl text-neutral-200 text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer"
            >
              <span className="font-sans text-neutral-300">Monsoon &amp; Spirit Audio</span>
              <div className="flex items-center gap-2 text-amber-300">
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-mono text-red-400">[MUTED]</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono text-emerald-400">[ACTIVE]</span>
                  </>
                )}
              </div>
            </button>

            {/* Restart Chapter */}
            {onRestartChapter && (
              <button
                id="pause-restart-btn"
                onClick={() => {
                  sound.playPaperRustle();
                  onRestartChapter();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-black/60 hover:bg-black/80 border border-red-900/60 rounded-xl text-neutral-300 hover:text-amber-200 font-bebas tracking-wider text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTART CHAPTER 1</span>
              </button>
            )}

            {/* Chapter Showcase */}
            <button
              id="pause-chapters-btn"
              onClick={handleExitToChapters}
              className="w-full py-2.5 px-4 bg-black/60 hover:bg-black/80 border border-red-900/60 rounded-xl text-neutral-300 hover:text-amber-200 font-bebas tracking-wider text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>CHAPTER SHOWCASE</span>
            </button>

            {/* Save & Exit to Menu */}
            <button
              id="pause-exit-btn"
              onClick={handleExitToMenu}
              className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-900 border border-red-900/80 rounded-xl text-amber-200/90 font-bebas tracking-widest text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>SAVE &amp; EXIT TO MAIN MENU</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-5 pt-3 border-t border-red-900/40 text-center">
            <p className="text-[11px] font-mono text-neutral-400">
              [ESC] or [RESUME] to return to the 1998 hostel
            </p>
          </div>
        </LilyBorder>
      </div>
    </div>
  );
};
