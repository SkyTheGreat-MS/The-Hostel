import React from 'react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { VisualNovelEngine } from '../components/VisualNovelEngine';

export const ChapterOne: React.FC = () => {
  return (
    <AtmosphericLayout
      headerTitle="ဝိညာဉ်၏ ဝင်္ကပါ"
      headerSubtitle="အခန်း ၁ • မျက်စိမှိတ် အစမှတ် (၁၉၉၈)"
      backgroundImage="/assets/uni_room_chp1_bg1.jpg"
      hideBackground
      chapterNumber={1}
      backTo="/chapters"
      backLabel="အခန်း ရွေးချယ်မှု"
      fullBleed={true}
    >
      <div className="w-full h-full flex-1 flex flex-col">
        <VisualNovelEngine initialChapter={1} />
      </div>
    </AtmosphericLayout>
  );
};
