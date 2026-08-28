import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { useGameProgress } from '../context/GameProgressContext';
import { sound } from '../audioEngine';
import {
  Lock,
  Compass,
  Scroll,
  Clock,
  Sparkles,
  Construction,
  ChevronLeft,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';

interface ChapterStubProps {
  chapterNumber: 2 | 3;
  title: string;
  subtitle: string;
  tagline: string;
  scopeSummary: string;
  plannedFeatures: string[];
}

export const ChapterStub: React.FC<ChapterStubProps> = ({
  chapterNumber,
  title,
  subtitle,
  tagline,
  scopeSummary,
  plannedFeatures,
}) => {
  const { isChapterUnlocked } = useGameProgress();
  const navigate = useNavigate();

  // Enforce server-side equivalent route guard: redirect if player tries to access while locked
  const unlocked = isChapterUnlocked(chapterNumber);

  if (!unlocked) {
    // Immediate programmatic redirect to /chapters if access is unauthorized
    return <Navigate to="/chapters" replace />;
  }

  return (
    <AtmosphericLayout
      headerTitle="THE SPIRIT'S LABYRINTH"
      headerSubtitle={`CHAPTER ${chapterNumber} • STUB INTERFACE`}
      backTo="/chapters"
      backLabel="Chapter Select"
      backgroundImage={`/assets/chapter_${chapterNumber}.jpg`}
      chapterNumber={chapterNumber}
      colorGrade={chapterNumber === 3 ? 'guttering_wax' : 'monsoon_green'}
    >
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-2xl bg-stone-950/90 border border-stone-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Unlocked & Verified Badge */}
          <div className="flex items-center justify-between gap-4 border-b border-stone-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                ROUTE ACCESS GRANTED • CHAPTER 0{chapterNumber} UNLOCKED
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GATE PASS VERIFIED</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className="text-xs font-mono text-amber-500/80 tracking-widest uppercase">
              {tagline}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bebas font-bold text-stone-100 tracking-wider">
              {subtitle}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-900 border border-stone-700 text-stone-400 text-xs font-mono">
              <Construction className="w-4 h-4 text-amber-400" />
              <span className="text-stone-300 font-semibold">CHAPTER {chapterNumber} — IN DEVELOPMENT</span>
            </div>
          </div>

          {/* Scope Note */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 mb-6 text-xs sm:text-sm text-stone-300 leading-relaxed space-y-2">
            <p>{scopeSummary}</p>
            <p className="text-stone-400 text-xs italic">
              (Note: Chapter 1 is fully playable in this pass. Chapters 2 &amp; 3 route skeletons prove client-side route guarding and gate unlocking).
            </p>
          </div>

          {/* Planned Features List */}
          <div className="space-y-2.5 mb-8">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Planned Investigation Beats in Full Release:
            </div>
            <ul className="space-y-1.5 text-xs text-stone-300 font-mono">
              {plannedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">›</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Action */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800/80">
            <button
              onClick={() => {
                sound.playMenuSelect();
                navigate('/chapters');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/60 text-xs font-mono font-bold text-stone-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>RETURN TO CHAPTER SELECT</span>
            </button>

            <button
              onClick={() => {
                sound.playMenuSelect();
                navigate('/chapters/1');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-700/80 hover:bg-amber-600 border border-amber-500 text-xs font-mono font-bold text-stone-950 transition-colors"
            >
              <span>REPLAY CHAPTER 1</span>
            </button>
          </div>
        </div>
      </div>
    </AtmosphericLayout>
  );
};
