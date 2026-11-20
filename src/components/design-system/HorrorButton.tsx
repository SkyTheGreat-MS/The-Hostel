import React from 'react';
import { sound } from '../../audioEngine';

export interface HorrorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'verdigris' | 'obsidian' | 'event-danger' | 'event-sanctum';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const HorrorButton: React.FC<HorrorButtonProps> = ({
  variant = 'verdigris',
  icon,
  children,
  className = '',
  disabled = false,
  onClick,
  onMouseEnter,
  ...props
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      try {
        sound.playMenuHover?.();
      } catch {}
    }
    onMouseEnter?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      try {
        sound.playMenuSelect?.();
      } catch {}
    }
    onClick?.(e);
  };

  // Base styling: borderless duo-tone baseline vs event-driven accents
  let variantClasses = '';
  switch (variant) {
    case 'event-danger':
      // Eye-breaking Arterial Crimson
      variantClasses =
        'bg-[#1a0404]/90 text-[#fca5a5] hover:bg-[#330808] hover:text-white';
      break;
    case 'event-sanctum':
      // Eye-breaking Cursed Grave Brass
      variantClasses =
        'bg-[#241b0b]/90 text-[#f7eed8] hover:bg-[#382a12] hover:text-[#fff4db]';
      break;
    case 'obsidian':
      // Subtle Obsidian minimal
      variantClasses =
        'bg-[#060b08]/85 text-[#6ea889] hover:bg-[#0b140f] hover:text-[#b1d4c2]';
      break;
    case 'verdigris':
    default:
      // Duo-tone standard: Stagnant Obsidian surface with Sickly Verdigris pale phosphor text
      variantClasses =
        'bg-[#112319]/80 text-[#b1d4c2] hover:bg-[#193828] hover:text-[#e0f0e7]';
      break;
  }

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-none text-xs font-mono tracking-wider transition-colors duration-150 cursor-pointer select-none active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default HorrorButton;
