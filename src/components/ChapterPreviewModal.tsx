import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../audioEngine';

export interface ChapterPreviewModalProps {
  isOpen?: boolean;
  isModal?: boolean;
  onClose?: () => void;
  onReplayChapterOne?: () => void;
  chapterNumber?: 2 | 3;
  title?: string;
  subtitle?: string;
  tagline?: string;
  scopeSummary?: string;
  plannedFeatures?: string[];
}

const DEFAULT_CHAPTER_2_DATA = {
  title: 'Chapter 2',
  subtitle: 'Chapter 2 — Understanding',
  tagline: 'CORRESPONDENCE OF THE CARETAKER & CAESAR CIPHERS',
  scopeSummary:
    'Deepen the communion with the hostel spirits. Cross-reference the dormitory ledger with the Caretaker\'s sealed records to decipher the true conspiracy.',
  plannedFeatures: [
    'Cross-referencing the hostel ledger with the Caretaker old office files',
    'Interactive multi-layer Caesar cipher decoding puzzles with shift keys',
    'Advanced Guardian Nat paired logic puzzles with nested contradictions',
    'Uncovering the 5,000 Kyats payoff trail to seal the dried courtyard well',
  ],
};

export const ChapterPreviewModal: React.FC<ChapterPreviewModalProps> = ({
  isOpen = true,
  isModal = false,
  onClose,
  onReplayChapterOne,
  chapterNumber = 2,
  title = DEFAULT_CHAPTER_2_DATA.title,
  subtitle = DEFAULT_CHAPTER_2_DATA.subtitle,
  tagline = DEFAULT_CHAPTER_2_DATA.tagline,
  scopeSummary = DEFAULT_CHAPTER_2_DATA.scopeSummary,
  plannedFeatures = DEFAULT_CHAPTER_2_DATA.plannedFeatures,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleReturn = () => {
    sound.playMenuSelect();
    if (onClose) {
      onClose();
    } else {
      navigate('/chapters');
    }
  };

  const handleReplay = () => {
    sound.playMenuSelect();
    if (onReplayChapterOne) {
      onReplayChapterOne();
    } else {
      navigate('/chapters/1');
    }
  };

  const formattedChapterNum = chapterNumber < 10 ? `0${chapterNumber}` : `${chapterNumber}`;

  const cardContent = (
    <div className="relative w-full max-w-2xl bg-[#111714]/95 border border-[#26382f] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md p-8 select-none">
      {/* Header & Status Badges */}
      <div className="flex items-center justify-between gap-4 border-b border-[#223229] pb-4 mb-6">
        {/* Route Access Badge (Top Left) */}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#7fa391] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#4d6e5e]" />
          ROUTE ACCESS GRANTED • CHAPTER {formattedChapterNum}
        </div>

        {/* Gate Pass Verified Badge (Top Right) */}
        <span className="px-2.5 py-1 rounded bg-[#16241d] border border-[#2b4235] text-[#86af99] text-[10px] font-mono tracking-wider">
          GATE PASS VERIFIED
        </span>
      </div>

      {/* Chapter Titles & In Development Tag */}
      <div className="space-y-2 mb-6">
        <div className="text-xs font-mono text-[#7fa391] tracking-widest uppercase">
          {tagline}
        </div>
        <h2
          className="text-3xl sm:text-4xl font-bold text-[#d1e3da] tracking-wider uppercase"
          style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
        >
          {subtitle}
        </h2>
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#17201b] border border-[#283930] text-[#8fa89b] text-[10px] font-mono tracking-wider">
            CHAPTER {chapterNumber} • IN DEVELOPMENT
          </span>
        </div>
      </div>

      {/* Inner Card & Bullet Point Sections */}
      <div className="bg-[#151f1a]/80 border border-[#223229] rounded-xl p-4 mb-6 space-y-2">
        <p className="text-[#b4c9bf] font-sans leading-relaxed text-sm">
          {scopeSummary}
        </p>
        <p className="text-[#6e8a7d] italic text-xs">
          (Note: Chapter 1 is fully playable in this pass. Chapters 2 &amp; 3 route skeletons prove client-side route guarding and gate unlocking).
        </p>
      </div>

      {/* Planned Investigation Beats List */}
      <div className="space-y-2.5 mb-8">
        <div className="text-[11px] font-mono tracking-widest text-[#7fa391] uppercase mb-3">
          Planned Investigation Beats in Full Release:
        </div>
        <ul className="space-y-1.5">
          {plannedFeatures.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#4d6e5e] font-mono">›</span>
              <span className="text-[#9db3a8] text-xs font-mono">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#223229]">
        <button
          onClick={handleReturn}
          className="px-5 py-2.5 rounded-lg bg-[#151e19] hover:bg-[#1b2721] border border-[#283830] text-[#a1b8ac] font-mono text-xs tracking-wider transition-all duration-200"
        >
          RETURN TO CHAPTER SELECT
        </button>

        <button
          onClick={handleReplay}
          className="px-6 py-2.5 rounded-lg bg-[#22352b] hover:bg-[#2d4639] border border-[#3f5c4c] text-[#d1e3da] font-mono text-xs tracking-wider transition-all duration-200 shadow-md"
        >
          REPLAY CHAPTER 1
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        {cardContent}
      </div>
    );
  }

  return cardContent;
};

export default ChapterPreviewModal;
