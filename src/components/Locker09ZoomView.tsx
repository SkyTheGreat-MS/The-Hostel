import React from 'react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { sound } from '../audioEngine';

export interface Locker09ZoomViewProps {
  hasLocker09Candle: boolean;
  hasLocker09Matchbox: boolean;
  setHasLocker09Candle: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasLocker09Matchbox: (val: boolean | ((prev: boolean) => boolean)) => void;
  setHasBlackCandlesCount: (val: number | ((prev: number) => number)) => void;
  setHasMatchesCount: (val: number | ((prev: number) => number)) => void;
  setInventory: (val: string[] | ((prev: string[]) => string[])) => void;
  setActiveMonologue: (msg: string | null) => void;
}

export const Locker09ZoomView: React.FC<Locker09ZoomViewProps> = ({
  hasLocker09Candle,
  hasLocker09Matchbox,
  setHasLocker09Candle,
  setHasLocker09Matchbox,
  setHasBlackCandlesCount,
  setHasMatchesCount,
  setInventory,
  setActiveMonologue,
}) => {
  return (
    <>
      {/* 1. Black Beeswax Candle (Left Center) */}
      {!hasLocker09Candle && (
        <InteractiveHotspot
          id="locker-09-candle"
          name="Black Beeswax Candle"
          polygonPoints="50,29 57,29 59,85 50,85"
          cursorTooltip="Take Black Candle"
          onClick={() => {
            sound.playItemPickup();
            setHasLocker09Candle(true);
            setHasBlackCandlesCount((prev) => prev + 1);
            setInventory((prev) => [...prev, 'black_beeswax_candle']);
            setActiveMonologue(
              "A thick black beeswax candle. Heavy, cold, and smells faintly of sweet oil. Ideal for the prayer altar."
            );
          }}
        />
      )}

      {/* 2. Vintage Burmese Matchbox (Right Center) */}
      {!hasLocker09Matchbox && (
        <InteractiveHotspot
          id="locker-09-matchbox"
          name="Three-Shooting-Stars Matchbox"
          polygonPoints="65,27 87,32 87,85 65,80"
          cursorTooltip="Take Matchbox"
          onClick={() => {
            sound.playPaperRustle();
            setHasLocker09Matchbox(true);
            setHasMatchesCount(3);
            setInventory((prev) => [...prev, 'matchbox_three_stars']);
            setActiveMonologue(
              "A box of 'Three-Shooting-Stars' safety matches. There are only three dry matches left inside."
            );
          }}
        />
      )}

      {/* Emptied Feedback Hotspot */}
      {hasLocker09Candle && hasLocker09Matchbox && (
        <InteractiveHotspot
          id="locker-09-empty"
          name="Locker 09 (Emptied)"
          polygonPoints="45,25 90,25 90,88 45,88"
          cursorTooltip="Locker 09 (Emptied)"
          onClick={() => {
            sound.playPaperRustle();
            setActiveMonologue(
              "— Locker 09 is emptied. The remaining shelves hold only damp insect droppings and rusted shelf pins. —"
            );
          }}
        />
      )}
    </>
  );
};

export default Locker09ZoomView;
