import React from 'react';

interface LilyBorderProps {
  className?: string;
  children?: React.ReactNode;
}

export const LilyBorder: React.FC<LilyBorderProps> = ({ className = '', children }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative Corner SVG Elements: Lily of the Valley Motif */}
      {/* Top Left Corner */}
      <svg
        className="absolute -top-2.5 -left-2.5 w-8 h-8 text-red-700/60 pointer-events-none z-20"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C 2 12, 12 2, 30 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Blossom 1 */}
        <circle cx="10" cy="14" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M9 16 C 9 18, 11 18, 11 16" stroke="currentColor" strokeWidth="1" />
        {/* Blossom 2 */}
        <circle cx="18" cy="8" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M17 10 C 17 12, 19 12, 19 10" stroke="currentColor" strokeWidth="1" />
        {/* Leaf sprout */}
        <path d="M4 22 C 8 20, 10 24, 6 26" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Top Right Corner */}
      <svg
        className="absolute -top-2.5 -right-2.5 w-8 h-8 text-red-700/60 pointer-events-none z-20 scale-x-[-1]"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C 2 12, 12 2, 30 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M9 16 C 9 18, 11 18, 11 16" stroke="currentColor" strokeWidth="1" />
        <circle cx="18" cy="8" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M17 10 C 17 12, 19 12, 19 10" stroke="currentColor" strokeWidth="1" />
        <path d="M4 22 C 8 20, 10 24, 6 26" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Bottom Left Corner */}
      <svg
        className="absolute -bottom-2.5 -left-2.5 w-8 h-8 text-red-700/60 pointer-events-none z-20 scale-y-[-1]"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C 2 12, 12 2, 30 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M9 16 C 9 18, 11 18, 11 16" stroke="currentColor" strokeWidth="1" />
        <circle cx="18" cy="8" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M17 10 C 17 12, 19 12, 19 10" stroke="currentColor" strokeWidth="1" />
        <path d="M4 22 C 8 20, 10 24, 6 26" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Bottom Right Corner */}
      <svg
        className="absolute -bottom-2.5 -right-2.5 w-8 h-8 text-red-700/60 pointer-events-none z-20 scale-[-1]"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 30 C 2 12, 12 2, 30 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M9 16 C 9 18, 11 18, 11 16" stroke="currentColor" strokeWidth="1" />
        <circle cx="18" cy="8" r="2.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
        <path d="M17 10 C 17 12, 19 12, 19 10" stroke="currentColor" strokeWidth="1" />
        <path d="M4 22 C 8 20, 10 24, 6 26" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Top Header Motif Floral Accent */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-red-950 border border-red-900/80 rounded-full flex items-center gap-2 text-[10px] text-amber-200/70 tracking-widest uppercase font-sans z-20 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600/80"></span>
        <span>မြန်မာ လျှို့ဝှက်ဆန်းကြယ်</span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-600/80"></span>
      </div>

      {children}
    </div>
  );
};
