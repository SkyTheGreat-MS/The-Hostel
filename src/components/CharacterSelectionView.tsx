import React from 'react';
import { CharacterSelectModal, CharacterSelectModalProps } from './CharacterSelectModal';

export interface CharacterSelectionViewProps extends CharacterSelectModalProps {}

export const CharacterSelectionView: React.FC<CharacterSelectionViewProps> = (props) => {
  return <CharacterSelectModal {...props} />;
};

export default CharacterSelectionView;
export { CharacterSelectModal };
