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
      headerTitle="ဝိညာဉ်၏ ဝင်္ကပါ"
      headerSubtitle={
        isCh3
          ? 'အခန်း ၃ • ထွက်ပေါက် / အဆောင်ပြင်ပ ခြံဝင်း (၁၉၉၈)'
          : 'အခန်း ၂ • နားလည်သဘောပေါက်ခြင်း (၁၉၉၈)'
      }
      backgroundImage={
        isCh3
          ? '/assets/scenes/hostel_outer_grounds_rain.jpg'
          : '/assets/east_wing_fork_corridor.jpg'
      }
      hideBackground
      chapterNumber={currentChapter}
      backTo="/chapters"
      backLabel="အခန်း ရွေးချယ်မှု"
      fullBleed={true}
    >
      <div className="w-full h-full flex-1 flex flex-col">
        <VisualNovelEngine initialChapter={currentChapter} />
      </div>
    </AtmosphericLayout>
  );
};

export default ChapterTwo;
