import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { GameProgressProvider } from './context/GameProgressContext';
import { MainMenu } from './components/MainMenu';
import { ChapterSelect } from './pages/ChapterSelect';
import { ChapterOne } from './pages/ChapterOne';
import { ChapterStub } from './pages/ChapterStub';

// Optional Diagnostic Modal components (retained for verification & dev testing)
import { TestRunner } from './components/TestRunner';
import { CodeViewer } from './components/CodeViewer';
import { DeductionMatrix } from './components/DeductionMatrix';
import { TerminalGame } from './components/TerminalGame';
import {
  Wrench,
  X,
  FileCheck,
  FileCode,
  Network,
  Terminal,
} from 'lucide-react';

/**
 * Main Menu Route Wrapper with Router Navigation & Diagnostic Tools
 */
const MainMenuRoute: React.FC = () => {
  const navigate = useNavigate();
  const [showDevModal, setShowDevModal] = useState<boolean>(false);
  const [devTab, setDevTab] = useState<'matrix' | 'tests' | 'code' | 'terminal'>('matrix');

  return (
    <div className="relative w-full min-h-screen">
      {/* Dev / Diagnostics Quick Overlay Pill */}
      <div className="absolute top-3 right-4 z-50 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800 text-[11px] font-mono shadow-2xl">
        <button
          onClick={() => setShowDevModal(true)}
          className="text-stone-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
        >
          <Wrench className="w-3 h-3 text-amber-500" />
          <span>PROLOG DEV SUITE</span>
        </button>
      </div>

      <MainMenu
        title="THE SPIRIT'S LABYRINTH"
        subtitle="A 1998 BURMESE FOLK-HORROR INVESTIGATION"
        footerPrompt="Press Enter to Continue"
        showRain={true}
        onPlay={() => navigate('/chapters')}
      />

      {/* Developer Diagnostic Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-lg">
          <div className="w-full max-w-5xl h-[85vh] bg-stone-950 border border-stone-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-900/80">
              <div className="flex items-center gap-2 text-stone-200">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  Prolog Engine Development &amp; Test Suite
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-mono">
                  <button
                    onClick={() => setDevTab('matrix')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      devTab === 'matrix' ? 'bg-amber-700 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Matrix
                  </button>
                  <button
                    onClick={() => setDevTab('tests')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      devTab === 'tests' ? 'bg-amber-700 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    PLUnit
                  </button>
                  <button
                    onClick={() => setDevTab('code')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      devTab === 'code' ? 'bg-amber-700 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Source
                  </button>
                  <button
                    onClick={() => setDevTab('terminal')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      devTab === 'terminal' ? 'bg-amber-700 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Dev CLI
                  </button>
                </div>

                <button
                  onClick={() => setShowDevModal(false)}
                  className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-black/50">
              {devTab === 'matrix' && <DeductionMatrix />}
              {devTab === 'tests' && <TestRunner />}
              {devTab === 'code' && <CodeViewer />}
              {devTab === 'terminal' && <TerminalGame />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProgressProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Menu */}
          <Route path="/" element={<MainMenuRoute />} />

          {/* Chapter Showcase Screen */}
          <Route path="/chapters" element={<ChapterSelect />} />

          {/* Chapter 1 Gameplay (Playable) */}
          <Route path="/chapters/1" element={<ChapterOne />} />

          {/* Chapter 2 Stub (Guarded) */}
          <Route
            path="/chapters/2"
            element={
              <ChapterStub
                chapterNumber={2}
                title="Chapter 2"
                subtitle="Chapter 2 — Understanding"
                tagline="CORRESPONDENCE OF THE CARETAKER & CAESAR CIPHERS"
                scopeSummary="Deepen the communion with the hostel spirits. Cross-reference the dormitory ledger with the Caretaker's sealed records to decipher the true conspiracy."
                plannedFeatures={[
                  'Cross-referencing the hostel ledger with the Caretaker old office files',
                  'Interactive multi-layer Caesar cipher decoding puzzles with shift keys',
                  'Advanced Guardian Nat paired logic puzzles with nested contradictions',
                  'Uncovering the 5,000 Kyats payoff trail to seal the dried courtyard well',
                ]}
              />
            }
          />

          {/* Chapter 3 Stub (Guarded) */}
          <Route
            path="/chapters/3"
            element={
              <ChapterStub
                chapterNumber={3}
                title="Chapter 3"
                subtitle="Chapter 3 — The Ritual"
                tagline="THE DRIED WELL CONFRONTATION & TWIST OF KINSHIP"
                scopeSummary="The dried well ceremony. Perform the ultimate Nat pacification rite, face the killer's bloodline connection, and sever the 28-year curse."
                plannedFeatures={[
                  'Descent to the overgrown courtyard Nat shrine and sealed dried well',
                  'High-stakes psychological confrontation with the Thaye spirit',
                  'Secret kinship revelation connecting Aye Aye to Aunt Sandar',
                  'Branching ritual endings: True Rest, Bloodline Twist, or Eternal Loop',
                ]}
              />
            }
          />

          {/* Fallback to Main Menu */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProgressProvider>
  );
}
