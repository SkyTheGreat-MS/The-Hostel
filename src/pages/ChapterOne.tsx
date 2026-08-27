import React from 'react';
import { AtmosphericLayout } from '../components/AtmosphericLayout';
import { VisualNovelEngine } from '../components/VisualNovelEngine';

export const ChapterOne: React.FC = () => {
  return (
    <AtmosphericLayout chapterNumber={1}>
      <div className="w-full h-full flex-1 flex flex-col">
        <VisualNovelEngine />
      </div>
    </AtmosphericLayout>
  );
};
