import React from 'react';

interface HostelRitualSceneProps {
  colorGradeClass?: string;
}

/**
 * 1998 Abandoned Hostel Séance Circle Ritual Background Artwork
 * Faithfully matches the user's uploaded artwork:
 * - 6 Burmese university students sitting in a circle on the floor
 * - Joined hands in center with glowing mystical violet/purple occult runes
 * - Dark abandoned hall with tiled floor, stacked chairs, rolled mats, water cooler, warm back window & swirling mist
 */
export const HostelRitualScene: React.FC<HostelRitualSceneProps> = ({
  colorGradeClass = '',
}) => {
  return (
    <div className={`w-full h-full bg-[#050b0f] relative overflow-hidden ${colorGradeClass}`}>
      <svg
        className="w-full h-full absolute inset-0 select-none pointer-events-none"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Background Room Walls & Lighting Gradients */}
          <linearGradient id="ritual-dark-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04090c" />
            <stop offset="40%" stopColor="#091419" />
            <stop offset="70%" stopColor="#0c1b22" />
            <stop offset="100%" stopColor="#060e12" />
          </linearGradient>

          <linearGradient id="ritual-tiled-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#081418" />
            <stop offset="35%" stopColor="#10252c" />
            <stop offset="70%" stopColor="#0d1f25" />
            <stop offset="100%" stopColor="#050d10" />
          </linearGradient>

          {/* Central Mystical Purple Glow */}
          <radialGradient id="ritual-purple-core" cx="50%" cy="56%" r="48%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="8%" stopColor="#f3e8ff" stopOpacity="0.88" />
            <stop offset="22%" stopColor="#c084fc" stopOpacity="0.75" />
            <stop offset="42%" stopColor="#9333ea" stopOpacity="0.45" />
            <stop offset="68%" stopColor="#581c87" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="ritual-ground-shockwave" cx="50%" cy="57%" r="55%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#7e22ce" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#3b0764" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Right Window Warm Lamp Glow */}
          <radialGradient id="ritual-window-warmth" cx="80%" cy="22%" r="35%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#d97706" stopOpacity="0.28" />
            <stop offset="75%" stopColor="#78350f" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Top Spotlight Overhead Cone */}
          <linearGradient id="ritual-spotlight-beam" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Water Dispenser Bottle Gradient */}
          <linearGradient id="ritual-cooler-bottle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* 1. Base Room Wall & Large Tiled Floor Canvas */}
        <rect width="1920" height="1080" fill="#03080b" />

        {/* Back Wall Upper Section */}
        <polygon points="0,0 1920,0 1920,440 0,440" fill="url(#ritual-dark-wall)" />

        {/* Perspective Tiled Floor */}
        <polygon points="0,440 1920,440 1920,1080 0,1080" fill="url(#ritual-tiled-floor)" />

        {/* Perspective Floor Grid Lines */}
        <g stroke="#091b22" strokeWidth="2" opacity="0.8">
          {/* Vanishing diagonals converging near (960, 260) */}
          <line x1="960" y1="260" x2="-200" y2="1080" />
          <line x1="960" y1="260" x2="150" y2="1080" />
          <line x1="960" y1="260" x2="480" y2="1080" />
          <line x1="960" y1="260" x2="780" y2="1080" />
          <line x1="960" y1="260" x2="960" y2="1080" />
          <line x1="960" y1="260" x2="1140" y2="1080" />
          <line x1="960" y1="260" x2="1440" y2="1080" />
          <line x1="960" y1="260" x2="1770" y2="1080" />
          <line x1="960" y1="260" x2="2120" y2="1080" />

          {/* Horizontal Transverse Grid Lines */}
          <line x1="0" y1="465" x2="1920" y2="465" strokeWidth="1.5" />
          <line x1="0" y1="500" x2="1920" y2="500" strokeWidth="1.5" />
          <line x1="0" y1="550" x2="1920" y2="550" strokeWidth="2" />
          <line x1="0" y1="620" x2="1920" y2="620" strokeWidth="2" />
          <line x1="0" y1="710" x2="1920" y2="710" strokeWidth="2.5" />
          <line x1="0" y1="830" x2="1920" y2="830" strokeWidth="3" />
          <line x1="0" y1="980" x2="1920" y2="980" strokeWidth="3.5" />
        </g>

        {/* Damp Water Stains & Discoloration on Abandoned Tiles */}
        <ellipse cx="680" cy="620" rx="140" ry="40" fill="#040b0e" opacity="0.65" />
        <ellipse cx="1320" cy="780" rx="220" ry="60" fill="#061217" opacity="0.55" />
        <ellipse cx="420" cy="820" rx="280" ry="75" fill="#050e12" opacity="0.7" />

        {/* 2. Background Architecture & Props */}
        {/* Back Door Center */}
        <g id="hall-backdoor" opacity="0.85">
          <rect x="860" y="180" width="200" height="260" fill="#050d11" stroke="#0d212a" strokeWidth="3" />
          <line x1="960" y1="180" x2="960" y2="440" stroke="#09171d" strokeWidth="3" />
          <rect x="880" y="210" width="65" height="90" fill="#09181f" />
          <rect x="975" y="210" width="65" height="90" fill="#09181f" />
          <rect x="880" y="320" width="65" height="90" fill="#09181f" />
          <rect x="975" y="320" width="65" height="90" fill="#09181f" />
          <circle cx="945" cy="310" r="4" fill="#64748b" />
          <circle cx="975" cy="310" r="4" fill="#64748b" />
        </g>

        {/* Left Wall Paneling & Tall Glass Panes */}
        <g id="hall-left-panes" opacity="0.75">
          <line x1="160" y1="0" x2="160" y2="440" stroke="#0a1920" strokeWidth="4" />
          <line x1="320" y1="0" x2="320" y2="440" stroke="#0a1920" strokeWidth="4" />
          <line x1="480" y1="0" x2="480" y2="440" stroke="#0a1920" strokeWidth="4" />
          <rect x="40" y="60" width="100" height="300" fill="#0b1e26" opacity="0.4" />
          <rect x="180" y="60" width="120" height="300" fill="#0b1e26" opacity="0.4" />
          <rect x="340" y="60" width="120" height="300" fill="#0b1e26" opacity="0.4" />
        </g>

        {/* Stacked Chairs Row on Left Wall */}
        <g id="hall-left-chairs" stroke="#0c1f26" strokeWidth="3" fill="#061014" opacity="0.85">
          <rect x="50" y="270" width="55" height="75" rx="4" />
          <line x1="55" y1="345" x2="45" y2="440" />
          <line x1="100" y1="345" x2="110" y2="440" />
          <rect x="115" y="260" width="55" height="75" rx="4" />
          <line x1="120" y1="335" x2="110" y2="440" />
          <line x1="165" y1="335" x2="175" y2="440" />
          <rect x="180" y="250" width="55" height="75" rx="4" />
          <line x1="185" y1="325" x2="175" y2="440" />
          <line x1="230" y1="325" x2="240" y2="440" />
          <rect x="245" y="240" width="55" height="75" rx="4" />
          <line x1="250" y1="315" x2="240" y2="440" />
          <line x1="295" y1="315" x2="305" y2="440" />
          <rect x="310" y="235" width="55" height="75" rx="4" />
          <line x1="315" y1="310" x2="305" y2="440" />
          <line x1="360" y1="310" x2="370" y2="440" />
          <rect x="375" y="230" width="55" height="75" rx="4" />
          <line x1="380" y1="305" x2="370" y2="440" />
          <line x1="425" y1="305" x2="435" y2="440" />
        </g>

        {/* Rolled Mats Propped on Left Corner */}
        <g id="hall-rolled-mats" opacity="0.9">
          <rect x="180" y="320" width="300" height="42" rx="10" transform="rotate(-18 330 340)" fill="#1c2826" stroke="#0e1716" strokeWidth="3" />
          <rect x="210" y="350" width="300" height="38" rx="8" transform="rotate(-15 360 370)" fill="#141f1d" stroke="#091110" strokeWidth="3" />
          <rect x="160" y="380" width="320" height="40" rx="8" transform="rotate(-8 320 400)" fill="#0f1715" stroke="#070c0b" strokeWidth="3" />
        </g>

        {/* Right Wall Back Window with Warm Lamplight Glow */}
        <g id="hall-right-window">
          <circle cx="1180" cy="180" r="320" fill="url(#ritual-window-warmth)" />
          {/* Window Frame */}
          <rect x="1100" y="60" width="160" height="200" fill="#2b1c09" stroke="#52320e" strokeWidth="6" />
          <rect x="1110" y="70" width="65" height="85" fill="#fef08a" opacity="0.75" />
          <rect x="1185" y="70" width="65" height="85" fill="#fde047" opacity="0.65" />
          <rect x="1110" y="165" width="65" height="85" fill="#eab308" opacity="0.7" />
          <rect x="1185" y="165" width="65" height="85" fill="#ca8a04" opacity="0.6" />
        </g>

        {/* Right Wall Stacked Chairs */}
        <g id="hall-right-chairs" stroke="#0c1f26" strokeWidth="2.5" fill="#071217" opacity="0.8">
          <rect x="1000" y="240" width="45" height="65" rx="3" />
          <line x1="1005" y1="305" x2="995" y2="440" />
          <line x1="1040" y1="305" x2="1050" y2="440" />
          <rect x="1050" y="240" width="45" height="65" rx="3" />
          <line x1="1055" y1="305" x2="1045" y2="440" />
          <line x1="1090" y1="305" x2="1100" y2="440" />
          <rect x="1100" y="240" width="45" height="65" rx="3" />
          <line x1="1105" y1="305" x2="1095" y2="440" />
          <line x1="1140" y1="305" x2="1150" y2="440" />
          <rect x="1150" y="240" width="45" height="65" rx="3" />
          <line x1="1155" y1="305" x2="1145" y2="440" />
          <line x1="1190" y1="305" x2="1200" y2="440" />
          <rect x="1200" y="240" width="45" height="65" rx="3" />
          <line x1="1205" y1="305" x2="1195" y2="440" />
          <line x1="1240" y1="305" x2="1250" y2="440" />
          <rect x="1250" y="240" width="45" height="65" rx="3" />
          <line x1="1255" y1="305" x2="1245" y2="440" />
          <line x1="1290" y1="305" x2="1300" y2="440" />
        </g>

        {/* Right Corner Water Cooler Dispenser */}
        <g id="hall-water-cooler" opacity="0.9">
          <rect x="1300" y="290" width="60" height="150" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
          <rect x="1310" y="320" width="40" height="35" rx="2" fill="#1e293b" />
          <circle cx="1320" cy="335" r="4" fill="#ef4444" />
          <circle cx="1340" cy="335" r="4" fill="#3b82f6" />
          <ellipse cx="1330" cy="245" rx="26" ry="48" fill="url(#ritual-cooler-bottle)" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="1322" y="285" width="16" height="10" fill="#0284c7" />
        </g>

        {/* Top Spotlight Beam */}
        <polygon points="860,0 1060,0 1480,950 440,950" fill="url(#ritual-spotlight-beam)" />

        {/* 3. Mystical Talismanic Burmese Script Inscribed on Floor */}
        <g id="hall-floor-runes" opacity="0.45" fill="none" stroke="#c084fc" strokeWidth="1.2">
          <path d="M 580,720 Q 480,820 620,920 Q 760,1020 960,1020 Q 1160,1020 1300,920 Q 1440,820 1340,720" strokeDasharray="4 6" />
          <path d="M 640,680 Q 560,780 680,870 Q 800,960 960,960 Q 1120,960 1240,870 Q 1360,780 1280,680" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="8 4" />
          <text x="500" y="780" fill="#a855f7" fontSize="16" fontFamily="sans-serif" transform="rotate(-25 500 780)">ဝိညာဉ်တံခါး (၁၉၉၈)</text>
          <text x="440" y="850" fill="#c084fc" fontSize="14" fontFamily="sans-serif" transform="rotate(-15 440 850)">နတ်ဆိုးဝင်္ကပါ မမမေ</text>
          <text x="580" y="960" fill="#a855f7" fontSize="15" fontFamily="sans-serif" transform="rotate(10 580 960)">အမှန်တရား သစ္စာ</text>
          <text x="1350" y="790" fill="#c084fc" fontSize="15" fontFamily="sans-serif" transform="rotate(25 1350 790)">ကျိန်စာဖြေလွှတ်ခြင်း</text>
          <text x="1380" y="860" fill="#a855f7" fontSize="14" fontFamily="sans-serif" transform="rotate(15 1380 860)">အမြစ်တွယ်နေသော သွေး</text>
        </g>

        {/* 4. The 6 Students in Circle performing Séance (Detailed Vector Figures) */}
        <g id="ritual-students-group">
          {/* STUDENT 1: Top Center (Female facing down-forward with glasses) */}
          <g id="student-top-center">
            <ellipse cx="960" cy="510" rx="90" ry="30" fill="#020507" opacity="0.8" />
            <path d="M 915,435 Q 890,490 920,520 L 1000,520 Q 1030,490 1005,435 Z" fill="#0f3428" stroke="#061812" strokeWidth="2" />
            <path d="M 910,500 Q 960,530 1010,500" stroke="#164e3b" strokeWidth="2" fill="none" />
            <path d="M 920,360 L 1000,360 L 1005,440 L 915,440 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
            <path d="M 945,360 L 945,440" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 975,360 L 975,440" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 920,380 Q 940,480 970,550" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
            <path d="M 920,380 Q 940,480 970,550" stroke="#1e293b" strokeWidth="2" fill="none" />
            <path d="M 1000,380 Q 980,480 975,550" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
            <path d="M 1000,380 Q 980,480 975,550" stroke="#1e293b" strokeWidth="2" fill="none" />
            <ellipse cx="960" cy="335" rx="20" ry="24" fill="#fed7aa" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="952" cy="336" r="6" stroke="#475569" strokeWidth="1.5" fill="none" />
            <circle cx="968" cy="336" r="6" stroke="#475569" strokeWidth="1.5" fill="none" />
            <line x1="958" y1="336" x2="962" y2="336" stroke="#475569" strokeWidth="1.5" />
            <path d="M 935,320 Q 960,290 985,320 Q 990,360 990,410 L 980,410 Q 980,350 970,335 Q 950,335 940,350 Q 940,410 930,410 Z" fill="#0b1317" stroke="#050a0d" strokeWidth="2" />
          </g>

          {/* STUDENT 2: Top Right (Male with glasses & wristwatch) */}
          <g id="student-top-right">
            <ellipse cx="1110" cy="510" rx="90" ry="30" fill="#020507" opacity="0.8" />
            <path d="M 1070,440 Q 1050,490 1080,525 L 1155,525 Q 1180,485 1150,440 Z" fill="#133e30" stroke="#061812" strokeWidth="2" />
            <path d="M 1065,365 L 1145,365 L 1150,445 L 1070,445 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
            <line x1="1105" y1="365" x2="1105" y2="445" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="1090,365 1105,385 1120,365" fill="#f8fafc" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 1070,390 Q 1040,480 990,555" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
            <path d="M 1070,390 Q 1040,480 990,555" stroke="#1e293b" strokeWidth="2" fill="none" />
            <path d="M 1140,390 Q 1080,480 995,555" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
            <path d="M 1140,390 Q 1080,480 995,555" stroke="#1e293b" strokeWidth="2" fill="none" />
            <rect x="1035" y="475" width="8" height="12" rx="2" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <ellipse cx="1105" cy="335" rx="22" ry="25" fill="#fed7aa" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="1092" y="330" width="10" height="8" rx="1" stroke="#334155" strokeWidth="1.5" fill="none" />
            <rect x="1108" y="330" width="10" height="8" rx="1" stroke="#334155" strokeWidth="1.5" fill="none" />
            <line x1="1102" y1="334" x2="1108" y2="334" stroke="#334155" strokeWidth="1.5" />
            <path d="M 1080,335 Q 1105,295 1130,330 Q 1135,350 1125,350 Q 1120,330 1105,325 Q 1090,330 1085,345 Z" fill="#0f171d" stroke="#050a0d" strokeWidth="2" />
          </g>

          {/* STUDENT 3: Right (Male side profile seated) */}
          <g id="student-right-side">
            <ellipse cx="1280" cy="620" rx="110" ry="40" fill="#020507" opacity="0.85" />
            <path d="M 1240,550 Q 1340,560 1370,610 Q 1330,660 1220,630 Z" fill="#0e3327" stroke="#061812" strokeWidth="2" />
            <path d="M 1245,430 L 1320,445 L 1310,555 L 1235,550 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
            <path d="M 1260,455 Q 1130,510 1015,560" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
            <path d="M 1260,455 Q 1130,510 1015,560" stroke="#1e293b" strokeWidth="2" fill="none" />
            <ellipse cx="1290" cy="385" rx="24" ry="28" fill="#fed7aa" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="1268" y1="385" x2="1285" y2="385" stroke="#334155" strokeWidth="2" />
            <circle cx="1272" cy="385" r="7" stroke="#334155" strokeWidth="1.5" fill="none" />
            <path d="M 1265,385 Q 1285,340 1320,370 Q 1325,410 1300,410 Q 1295,385 1280,380 Z" fill="#0a1217" stroke="#050a0d" strokeWidth="2" />
          </g>

          {/* STUDENT 4: Bottom Right (Back view student with white shirt) */}
          <g id="student-bottom-right">
            <ellipse cx="1140" cy="810" rx="120" ry="45" fill="#020507" opacity="0.9" />
            <path d="M 1040,730 Q 1150,750 1260,770 Q 1210,880 1030,860 Q 990,790 1040,730 Z" fill="#0a2a20" stroke="#061812" strokeWidth="2.5" />
            <path d="M 1070,760 Q 1150,830 1220,780" stroke="#051c14" strokeWidth="2" fill="none" />
            <path d="M 1050,600 L 1180,610 L 1195,735 L 1055,730 Z" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
            <path d="M 1115,600 Q 1125,660 1120,730" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <path d="M 1060,650 Q 1110,670 1180,655" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <path d="M 1060,630 Q 1020,590 990,570" stroke="#f1f5f9" strokeWidth="22" strokeLinecap="round" />
            <path d="M 1060,630 Q 1020,590 990,570" stroke="#1e293b" strokeWidth="2.5" fill="none" />
            <ellipse cx="1120" cy="545" rx="26" ry="30" fill="#0a1216" stroke="#050a0d" strokeWidth="2" />
            <path d="M 1100,530 Q 1120,515 1140,530 Q 1145,560 1120,570 Q 1095,560 1100,530 Z" fill="#152129" />
          </g>

          {/* STUDENT 5: Bottom Left (Female from back with lace eyelet blouse & long dark hair) */}
          <g id="student-bottom-left">
            <ellipse cx="800" cy="790" rx="130" ry="45" fill="#020507" opacity="0.9" />
            <path d="M 700,720 Q 820,730 920,750 Q 900,860 740,840 Q 670,780 700,720 Z" fill="#0b2e23" stroke="#061812" strokeWidth="2.5" />
            <path d="M 725,580 L 850,580 L 865,715 L 720,715 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
            <g fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1">
              <circle cx="735" cy="710" r="4" />
              <circle cx="750" cy="710" r="4" />
              <circle cx="765" cy="710" r="4" />
              <circle cx="780" cy="710" r="4" />
              <circle cx="795" cy="710" r="4" />
              <circle cx="810" cy="710" r="4" />
              <circle cx="825" cy="710" r="4" />
              <circle cx="840" cy="710" r="4" />
              <circle cx="855" cy="710" r="4" />
            </g>
            <path d="M 785,580 L 785,705" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 740,630 Q 785,650 835,630" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <path d="M 830,600 Q 880,580 945,565" stroke="#f8fafc" strokeWidth="20" strokeLinecap="round" />
            <path d="M 830,600 Q 880,580 945,565" stroke="#1e293b" strokeWidth="2" fill="none" />
            <ellipse cx="785" cy="515" rx="26" ry="32" fill="#080e12" stroke="#050a0d" strokeWidth="2" />
            <path d="M 760,500 Q 785,465 810,500 Q 820,560 810,630 L 760,630 Q 750,560 760,500 Z" fill="#0c151b" stroke="#050a0d" strokeWidth="2" />
            <path d="M 775,510 Q 785,485 795,510 Q 800,550 795,600 L 775,600 Z" fill="#182730" opacity="0.6" />
          </g>

          {/* STUDENT 6: Left (Female side profile) */}
          <g id="student-left-side">
            <ellipse cx="700" cy="580" rx="100" ry="35" fill="#020507" opacity="0.85" />
            <path d="M 640,510 Q 720,530 750,580 Q 710,640 600,600 Z" fill="#0f3428" stroke="#061812" strokeWidth="2" />
            <path d="M 645,410 L 720,420 L 730,520 L 650,515 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />
            <path d="M 700,435 Q 810,490 935,555" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
            <path d="M 700,435 Q 810,490 935,555" stroke="#1e293b" strokeWidth="2" fill="none" />
            <ellipse cx="680" cy="365" rx="22" ry="26" fill="#fed7aa" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 655,365 Q 675,325 705,355 Q 710,390 690,390 Q 685,365 670,360 Z" fill="#0a1217" stroke="#050a0d" strokeWidth="2" />
            <path d="M 655,365 Q 630,380 620,430 L 635,430 Q 645,390 660,375 Z" fill="#080e12" stroke="#050a0d" strokeWidth="1.5" />
          </g>
        </g>

        {/* 5. Central Occult Convergence (Hands Touching + Glowing Purple Ritual Core) */}
        <g id="ritual-hands-and-portal">
          <circle cx="960" cy="565" r="420" fill="url(#ritual-ground-shockwave)" />
          <circle cx="960" cy="565" r="280" fill="url(#ritual-purple-core)" />

          {/* Concentric Magic Circles with Glyphs */}
          <ellipse cx="960" cy="565" rx="220" ry="90" fill="none" stroke="#c084fc" strokeWidth="3" opacity="0.85" />
          <ellipse cx="960" cy="565" rx="180" ry="74" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 4" opacity="0.9" />
          <ellipse cx="960" cy="565" rx="140" ry="58" fill="none" stroke="#e9d5ff" strokeWidth="2.5" opacity="0.95" />
          <ellipse cx="960" cy="565" rx="90" ry="38" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.95" />

          {/* 6-Pointed Occult Energy Geometry connecting the 6 students */}
          <polygon
            points="960,490 1080,530 1080,600 960,640 840,600 840,530"
            fill="none"
            stroke="#d8b4fe"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          <polygon
            points="960,510 1040,615 880,615"
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.5"
            opacity="0.75"
          />
          <polygon
            points="960,620 880,515 1040,515"
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.5"
            opacity="0.75"
          />

          {/* Glowing Talismanic Characters around center */}
          <text x="960" y="525" fill="#f3e8ff" fontSize="16" fontWeight="bold" textAnchor="middle" opacity="0.9">က</text>
          <text x="1030" y="550" fill="#f3e8ff" fontSize="16" fontWeight="bold" textAnchor="middle" opacity="0.9">ခ</text>
          <text x="1030" y="595" fill="#f3e8ff" fontSize="16" fontWeight="bold" textAnchor="middle" opacity="0.9">ဂ</text>
          <text x="960" y="618" fill="#f3e8ff" fontSize="16" fontWeight="bold" textAnchor="middle" opacity="0.9">ဃ</text>
          <text x="890" y="595" fill="#f3e8ff" fontSize="16" fontWeight="bold" textAnchor="middle" opacity="0.9">င</text>
          <text x="890" y="550" fill="#f3e8ff" fontSize="16" fontWeight="bold" textAnchor="middle" opacity="0.9">စ</text>

          {/* The 12 Hands Converging at the Exact Center Point */}
          <g fill="#fed7aa" stroke="#1e293b" strokeWidth="1.5">
            <ellipse cx="960" cy="552" rx="7" ry="12" transform="rotate(-10 960 552)" />
            <ellipse cx="968" cy="552" rx="7" ry="12" transform="rotate(10 968 552)" />
            <ellipse cx="980" cy="558" rx="12" ry="7" transform="rotate(-25 980 558)" />
            <ellipse cx="985" cy="565" rx="12" ry="7" transform="rotate(-15 985 565)" />
            <ellipse cx="982" cy="572" rx="12" ry="7" transform="rotate(10 982 572)" />
            <ellipse cx="975" cy="578" rx="7" ry="12" transform="rotate(25 975 578)" />
            <ellipse cx="965" cy="580" rx="7" ry="12" transform="rotate(10 965 580)" />
            <ellipse cx="952" cy="578" rx="7" ry="12" transform="rotate(-20 952 578)" />
            <ellipse cx="945" cy="572" rx="12" ry="7" transform="rotate(-10 945 572)" />
            <ellipse cx="942" cy="562" rx="12" ry="7" transform="rotate(15 942 562)" />
            <ellipse cx="948" cy="555" rx="12" ry="7" transform="rotate(25 948 555)" />
          </g>

          {/* Central Blinding Supernal Star / Node Burst */}
          <circle cx="960" cy="565" r="26" fill="#ffffff" />
          <circle cx="960" cy="565" r="42" fill="#e9d5ff" opacity="0.8" />
          <circle cx="960" cy="565" r="70" fill="#c084fc" opacity="0.45" />

          {/* Light Rays Erupting from center point */}
          <g stroke="#ffffff" strokeWidth="2.5" opacity="0.9">
            <line x1="960" y1="565" x2="960" y2="460" />
            <line x1="960" y1="565" x2="1050" y2="510" />
            <line x1="960" y1="565" x2="1060" y2="620" />
            <line x1="960" y1="565" x2="960" y2="670" />
            <line x1="960" y1="565" x2="860" y2="620" />
            <line x1="960" y1="565" x2="870" y2="510" />
          </g>
        </g>

        {/* 6. Volumetric Monsoon Smoke & Floor Fog Layers */}
        <g id="hall-fog-mist">
          <ellipse cx="960" cy="565" rx="550" ry="120" fill="#a855f7" opacity="0.1" />
          <ellipse cx="680" cy="680" rx="380" ry="80" fill="#38bdf8" opacity="0.08" />
          <ellipse cx="1240" cy="720" rx="420" ry="90" fill="#c084fc" opacity="0.09" />
          <ellipse cx="520" cy="850" rx="480" ry="110" fill="#64748b" opacity="0.14" />
          <ellipse cx="1400" cy="880" rx="520" ry="120" fill="#64748b" opacity="0.14" />
          <ellipse cx="960" cy="950" rx="700" ry="140" fill="#1e293b" opacity="0.25" />
        </g>
      </svg>
    </div>
  );
};
