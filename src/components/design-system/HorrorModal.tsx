import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { sound } from '../../audioEngine';

export interface HorrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  className?: string;
}

export const HorrorModal: React.FC<HorrorModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  className = '',
}) => {
  // ESC key listener to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        try {
          sound.playMenuSelect?.();
        } catch {}
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Ambient Backdrop Dimmer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#020504]/88 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container: Duo-Tone Obsidian & Sickly Verdigris */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full ${maxWClass} bg-[#060b08]/96 rounded-none overflow-hidden flex flex-col ${className}`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="px-5 py-3.5 bg-[#020504]/60 flex items-center justify-between">
                <div>
                  {subtitle && (
                    <span className="font-mono text-[10px] tracking-widest text-[#447d60] uppercase block">
                      {subtitle}
                    </span>
                  )}
                  {title && (
                    <h2 className="font-cinzel text-sm sm:text-base font-bold text-[#b1d4c2] tracking-wider uppercase">
                      {title}
                    </h2>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-none bg-transparent hover:bg-[#112319]/70 text-[#6ea889] hover:text-[#e0f0e7] transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HorrorModal;
