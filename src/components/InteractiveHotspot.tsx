import React from 'react';
import { sound } from '../audioEngine';

export interface InteractiveHotspotProps {
  id: string;
  name: string;
  // Optional SVG polygon points formatted as percentages: "x1,y1 x2,y2 x3,y3 ..."
  polygonPoints?: string;
  // Fallback box properties if no polygon is provided
  x?: number; // e.g. 15 for left: 15%
  y?: number; // e.g. 25 for top: 25%
  width?: number; // e.g. 18 for width: 18%
  height?: number; // e.g. 30 for height: 30%
  shape?: 'rect' | 'circle';
  rotation?: number; // e.g. 14 for rotate(14deg)
  transformOrigin?: string; // e.g. 'bottom center'
  clipPath?: string; // e.g. polygon(...)
  overlaySrc?: string; // transparent PNG cutout if available
  cursorTooltip?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const InteractiveHotspot: React.FC<InteractiveHotspotProps> = ({
  id,
  name,
  polygonPoints,
  x,
  y,
  width,
  height,
  shape = 'rect',
  rotation,
  transformOrigin = 'bottom center',
  clipPath,
  overlaySrc,
  cursorTooltip,
  onClick,
  disabled = false,
}) => {
  if (disabled) return null;

  // Mode A: Perspective-molded SVG Polygon (Tailored Shape)
  if (polygonPoints) {
    // Calculate approximate center for floating tooltip positioning
    const coords = polygonPoints
      .trim()
      .split(/\s+/)
      .map((pt) => {
        const [px, py] = pt.split(',').map(Number);
        return { x: px || 0, y: py || 0 };
      });
    const avgX = coords.reduce((acc, c) => acc + c.x, 0) / (coords.length || 1);
    const minY = Math.min(...coords.map((c) => c.y));

    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none group" data-hotspot-id={id}>
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <g
            className="group/poly pointer-events-auto cursor-pointer"
            style={{ pointerEvents: 'all' }}
            onClick={onClick}
            onMouseEnter={() => sound.playMenuHover()}
          >
            {/* Invisible Hitbox + Hover Moss/Iron Perspective Glow */}
            <polygon
              points={polygonPoints}
              style={{ pointerEvents: 'all' }}
              fill="white"
              fillOpacity={0.001}
              onClick={onClick}
              onMouseEnter={() => sound.playMenuHover()}
              className="cursor-pointer pointer-events-auto transition-all duration-300 stroke-transparent group-hover:stroke-[#82a996]/60 group-hover:stroke-[0.5] group-hover:fill-[#82a996]/10 group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(130,169,150,0.3)] hover:stroke-[#82a996]/60 hover:stroke-[0.5] hover:fill-[#82a996]/10 hover:filter hover:drop-shadow-[0_0_8px_rgba(130,169,150,0.3)]"
            />
            <title>{cursorTooltip || name}</title>
          </g>
        </svg>

        {/* Hover label / tooltip anchored above polygon center */}
        {cursorTooltip && (
          <span
            className="absolute px-2.5 py-1 rounded bg-[#121815]/95 border border-[#2c3d34] text-[10px] font-mono text-[#82a996] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full mb-2 z-30"
            style={{
              left: `${avgX}%`,
              top: `${minY}%`,
            }}
          >
            {cursorTooltip}
          </span>
        )}
      </div>
    );
  }

  // Mode B: Standard fallback bounding box
  const containerStyle: React.CSSProperties = {
    left: `${x ?? 0}%`,
    top: `${y ?? 0}%`,
    width: `${width ?? 0}%`,
    height: `${height ?? 0}%`,
    ...(rotation !== undefined ? { transform: `rotate(${rotation}deg)`, transformOrigin } : {}),
    ...(clipPath ? { clipPath } : {}),
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => sound.playMenuHover()}
      style={containerStyle}
      className={`absolute z-20 cursor-pointer group select-none ${
        shape === 'circle' ? 'rounded-full' : 'rounded-lg'
      }`}
      title={name}
      aria-label={name}
      data-hotspot-id={id}
    >
      {/* If transparent PNG overlay cutout provided */}
      {overlaySrc ? (
        <img
          src={overlaySrc}
          alt={name}
          className="w-full h-full object-contain pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:filter group-hover:drop-shadow-[0_0_18px_rgba(130,169,150,0.6)]"
        />
      ) : (
        /* Light aura / glow boundary — strictly hidden until cursor hovers */
        <div
          className="w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 border border-[#82a996]/40 bg-[#82a996]/5 shadow-[0_0_12px_rgba(130,169,150,0.25)] rounded-md"
          style={clipPath ? { clipPath } : undefined}
        />
      )}

      {/* Elegant minimalist tooltip that follows hover */}
      {cursorTooltip && (
        <span
          className={`absolute left-1/2 px-2.5 py-1 rounded bg-[#121815]/95 border border-[#2c3d34] text-[10px] font-mono text-[#82a996] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-30 ${
            (y ?? 0) < 15 ? 'top-full mt-2' : 'bottom-full mb-2'
          }`}
          style={{
            transform: rotation ? `translateX(-50%) rotate(-${rotation}deg)` : 'translateX(-50%)',
          }}
        >
          {cursorTooltip}
        </span>
      )}
    </div>
  );
};

export default InteractiveHotspot;
