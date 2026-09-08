import React from 'react';
import { CharacterSelectModal, CharacterSelectModalProps } from './CharacterSelectModal';
import { MCId } from '../types';

export interface CharacterSelectScreenProps extends CharacterSelectModalProps {
  onSelectCharacter: (characterId: MCId) => void;
}

export const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = (props) => {
  return <CharacterSelectModal {...props} />;
};

export default CharacterSelectScreen;
