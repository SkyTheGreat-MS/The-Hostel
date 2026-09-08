import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { useGameProgress } from '../context/GameProgressContext';
import { ChapterPreviewModal } from '../components/ChapterPreviewModal';

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
        <ChapterPreviewModal
          chapterNumber={chapterNumber}
          title={title}
          subtitle={subtitle}
          tagline={tagline}
          scopeSummary={scopeSummary}
          plannedFeatures={plannedFeatures}
          onClose={() => navigate('/chapters')}
          onReplayChapterOne={() => navigate('/chapters/1')}
        />
      </div>
    </AtmosphericLayout>
  );
};

export default ChapterStub;
