import React from 'react';
import { CharacterSelectScreen } from './CharacterSelectScreen';
import { MCId } from '../types';

export interface CharacterSelectModalProps {
  onSelectCharacter: (characterId: MCId) => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({ onSelectCharacter }) => {
  return <CharacterSelectScreen onSelectCharacter={onSelectCharacter} />;
};

export default CharacterSelectModal;
