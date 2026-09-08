import React from 'react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { VisualNovelEngine } from '../components/VisualNovelEngine';

export const ChapterTwo: React.FC = () => {
  return (
    <AtmosphericLayout
      headerTitle="THE SPIRIT'S LABYRINTH"
      headerSubtitle="CHAPTER 2 : UNDERSTANDING (1998)"
      backgroundImage="/assets/east_wing_fork_corridor.jpg"
      hideBackground
      chapterNumber={2}
      backTo="/chapters"
      backLabel="Chapters"
      fullBleed={true}
    >
      <div className="w-full h-full flex-1 flex flex-col">
        <VisualNovelEngine initialChapter={2} />
      </div>
    </AtmosphericLayout>
  );
};

export default ChapterTwo;
