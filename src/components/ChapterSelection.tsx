import React from 'react';
import { ChapterSelect } from '../pages/ChapterSelect';
export { ChapterPreviewModal } from './ChapterPreviewModal';
export type { ChapterPreviewModalProps } from './ChapterPreviewModal';

export const ChapterSelection: React.FC = () => {
  return <ChapterSelect />;
};

export default ChapterSelection;
