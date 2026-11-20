import React from 'react';
import { ITEM_DATABASE } from '../items';
import { Key, Hammer, Wind, Flame, Bell, Compass, Package, Zap, Mail, FileText } from 'lucide-react';

export { ITEM_DATABASE };

export interface InventoryDrawerProps {
  isOpen?: boolean;
  isInventoryDrawerOpen?: boolean;
  onClose?: () => void;
  setIsInventoryDrawerOpen?: (open: boolean) => void;
  inventory: string[];
  onSelectItem?: (itemId: string) => void;
}

export const ItemIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-3.5 h-3.5 text-[#8fa89b]',
}) => {
  if (name === 'key' || name === 'pin') return <Key className={className} />;
  if (name === 'hammer' || name === 'club') return <Hammer className={className} />;
  if (name === 'wind' || name === 'rope') return <Wind className={className} />;
  if (name === 'flame' || name === 'candle' || name === 'match') return <Flame className={className} />;
  if (name === 'bell') return <Bell className={className} />;
  if (name === 'compass') return <Compass className={className} />;
  if (name === 'zap') return <Zap className={className} />;
  if (name === 'mail' || name === 'letter') return <Mail className={className} />;
  if (name === 'paper' || name === 'file-text') return <FileText className={className} />;
  return <Package className={className} />;
};

export const InventoryDrawerModal: React.FC<InventoryDrawerProps> = ({
  isOpen,
  isInventoryDrawerOpen,
  onClose,
  setIsInventoryDrawerOpen,
  inventory,
}) => {
  const activeOpen = isOpen !== undefined ? isOpen : Boolean(isInventoryDrawerOpen);
  const handleClose = onClose || (() => setIsInventoryDrawerOpen?.(false));

  if (!activeOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none cursor-default"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#060b08]/96 rounded-none p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <span className="font-mono text-xs tracking-wider text-[#78b394] uppercase font-semibold tabular-nums">
            Carried Possessions ({inventory.length})
          </span>
          <button
            onClick={handleClose}
            className="text-xs font-mono text-[#5a7a69] hover:text-[#a3c2b2] uppercase transition-colors cursor-pointer"
          >
            [Close]
          </button>
        </div>

        {/* 3-Column Clean Grid */}
        <div className="grid grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {inventory.map((itemId, idx) => {
            const item = ITEM_DATABASE[itemId] || {
              id: itemId,
              shortLabel: itemId,
              icon: 'key',
            };
            return (
              <div
                key={`${itemId}-${idx}`}
                className="flex items-center gap-2 px-2.5 py-2 rounded-none bg-[#0b140f] select-none"
              >
                <div className="w-6 h-6 rounded-none bg-[#020504] flex items-center justify-center shrink-0">
                  <ItemIcon className="w-3.5 h-3.5 text-[#8fa89b]" name={item.icon} />
                </div>
                <span className="font-mono text-xs text-[#cce0d5] truncate font-medium">
                  {item.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryDrawerModal;
