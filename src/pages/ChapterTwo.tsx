import React from 'react';
import { Navigate } from 'react-router-dom';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { VisualNovelEngine } from '../components/VisualNovelEngine';
import { hasActiveChapterTwoSave, hasActiveChapterThreeSave, loadActiveGameProgress } from '../gameStore';

export const ChapterTwo: React.FC = () => {
  if (!hasActiveChapterTwoSave() && !hasActiveChapterThreeSave()) {
    return <Navigate to="/chapters" replace />;
  }

  const activeSave = loadActiveGameProgress();
  const isCh3 = hasActiveChapterThreeSave() || activeSave?.chapter === 3 || Boolean(activeSave?.chapter3Unlocked);
  const currentChapter = isCh3 ? 3 : 2;

  return (
    <AtmosphericLayout
      headerTitle="THE SPIRIT'S LABYRINTH"
      headerSubtitle={
        isCh3
          ? 'CHAPTER 3 : ESCAPE / THE OUTSIDE GROUNDS (1998)'
          : 'CHAPTER 2 : UNDERSTANDING (1998)'
      }
      backgroundImage={
        isCh3
          ? '/assets/scenes/hostel_outer_grounds_rain.jpg'
          : '/assets/east_wing_fork_corridor.jpg'
      }
      hideBackground
      chapterNumber={currentChapter}
      backTo="/chapters"
      backLabel="Chapters"
      fullBleed={true}
    >
      <div className="w-full h-full flex-1 flex flex-col">
        <VisualNovelEngine initialChapter={currentChapter} />
      </div>
    </AtmosphericLayout>
  );
};

export default ChapterTwo;
