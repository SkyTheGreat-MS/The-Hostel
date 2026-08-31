import React from 'react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { VisualNovelEngine } from '../components/VisualNovelEngine';

export const ChapterOne: React.FC = () => {
  return (
    <AtmosphericLayout
      headerTitle="THE SPIRIT'S LABYRINTH"
      headerSubtitle="CHAPTER 1 : BLIND START (1998)"
      backgroundImage="/assets/uni_room_chp1_bg1.jpg"
      chapterNumber={1}
      backTo="/chapters"
      backLabel="Chapters"
      fullBleed={true}
    >
      <div className="w-full h-full flex-1 flex flex-col">
        <VisualNovelEngine />
      </div>
    </AtmosphericLayout>
  );
};
