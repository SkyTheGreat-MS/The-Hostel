import React from 'react';
import { ITEM_DATABASE } from '../items';
import { ItemIcon } from './InventoryDrawerModal';

export { ITEM_DATABASE };

export interface TopInventoryBarProps {
  inventory: string[];
  setIsInventoryDrawerOpen?: (open: boolean) => void;
  onOpen?: () => void;
  onItemClick?: (itemId: string) => void;
}

export const TopInventoryBar: React.FC<TopInventoryBarProps> = ({
  inventory,
  setIsInventoryDrawerOpen,
  onOpen,
  onItemClick,
}) => {
  const handleOpen = () => {
    if (setIsInventoryDrawerOpen) {
      setIsInventoryDrawerOpen(true);
    } else if (onOpen) {
      onOpen();
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#060b08]/90 border border-[#193828] px-2.5 py-1 rounded-lg">
      {/* Up to 3 visible quick-slots */}
      <div className="flex items-center gap-1">
        {inventory.slice(0, 3).map((itemId, idx) => {
          const item = ITEM_DATABASE[itemId] || { id: itemId, shortLabel: itemId, icon: 'key' };
          return (
            <div
              key={`${itemId}-${idx}`}
              title={item.shortLabel}
              onClick={() => onItemClick?.(itemId)}
              className="w-7 h-7 rounded border border-[#193828] bg-[#0b140f] flex items-center justify-center p-1 cursor-pointer hover:border-[#29543e] hover:scale-105 transition-all"
            >
              <ItemIcon className="w-3.5 h-3.5 text-[#6ea889]" name={item.icon} />
            </div>
          );
        })}
      </div>

      {/* Collapsible Drawer Trigger Button */}
      <button
        onClick={handleOpen}
        className="ml-1 px-2.5 py-1 rounded bg-[#0b140f] hover:bg-[#101c15] border border-[#193828] hover:border-[#29543e] text-[11px] font-burmese text-[#b1d4c2] hover:text-[#e0f0e7] flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
      >
        <span>ပစ္စည်း</span>
        {inventory.length > 3 && (
          <span className="text-[10px] font-mono text-[#c7a458] font-bold">+{inventory.length - 3}</span>
        )}
      </button>
    </div>
  );
};

export default TopInventoryBar;
