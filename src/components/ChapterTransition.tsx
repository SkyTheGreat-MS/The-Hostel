import React from 'react';
import { ChapterTransitionModal, ChapterTransitionModalProps } from './ChapterTransitionModal';

export interface ChapterTransitionProps extends ChapterTransitionModalProps {}

/**
 * ChapterTransition — Standardized Chapter Progression Modal
 * Re-exports ChapterTransitionModal matching image_55c5c8.png specifications.
 */
export const ChapterTransition: React.FC<ChapterTransitionProps> = (props) => {
  return <ChapterTransitionModal {...props} />;
};

export { ChapterTransitionModal };
export default ChapterTransition;
