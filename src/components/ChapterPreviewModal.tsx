import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../audioEngine';

export interface ChapterPreviewModalProps {
  isOpen?: boolean;
  isModal?: boolean;
  onClose?: () => void;
  onReplayChapterOne?: () => void;
  chapterNumber?: 2 | 3;
  title?: string;
  subtitle?: string;
  tagline?: string;
  scopeSummary?: string;
  plannedFeatures?: string[];
}

const DEFAULT_CHAPTER_2_DATA = {
  title: 'အခန်း ၂',
  subtitle: 'အခန်း ၂ — နားလည်ခြင်း',
  tagline: 'အဆောင်စောင့် စာနှီးဖလှယ်မှု နှင့် ဆီဇာ လျှို့ဝှက်ကုဒ်များ',
  scopeSummary:
    'အဆောင်ဝိညာဉ်များနှင့် ဆက်သွယ်မှုကို ပိုမိုနက်ရှိုင်းစေပါ။ အဆောင်မှတ်တမ်းစာအုပ်ကို အဆောင်စောင့်၏ တံဆိပ်ခတ်ထားသော မှတ်တမ်းများနှင့် ကန့်လန့်စစ်ဆေးကာ အမှန်တကယ် လျှို့ဝှက်ကြံစည်မှုကို ဖော်ထုတ်ပါ။',
  plannedFeatures: [
    'အဆောင်စောင့်၏ ရုံးဟောင်းဖိုင်များနှင့် အဆောင်မှတ်တမ်းကို ကန့်လန့်စစ်ဆေးခြင်း',
    'ရွှေ့လှည့်သော့များပါသည့် အလွှာပေါင်းစုံ ဆီဇာ လျှို့ဝှက်ကုဒ်ဖော်ထုတ်ရေး ပဟေဠိများ',
    'အဆင့်ဆင့် ကွဲလွဲချက်များပါ အဆင့်မြင့် အစောင့်နတ် ယုတ္တိပဟေဠိများ',
    'ခန်းခြောက်နေသော ဝင်းရေတွင်းဟောင်းကို ပိတ်ဆို့ရန် ကျပ် ၅၀၀၀ လာဘ်ငွေလမ်းကြောင်းကို ဖော်ထုတ်ခြင်း',
  ],
};

export const ChapterPreviewModal: React.FC<ChapterPreviewModalProps> = ({
  isOpen = true,
  isModal = false,
  onClose,
  onReplayChapterOne,
  chapterNumber = 2,
  title = DEFAULT_CHAPTER_2_DATA.title,
  subtitle = DEFAULT_CHAPTER_2_DATA.subtitle,
  tagline = DEFAULT_CHAPTER_2_DATA.tagline,
  scopeSummary = DEFAULT_CHAPTER_2_DATA.scopeSummary,
  plannedFeatures = DEFAULT_CHAPTER_2_DATA.plannedFeatures,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleReturn = () => {
    sound.playMenuSelect();
    if (onClose) {
      onClose();
    } else {
      navigate('/chapters');
    }
  };

  const handleReplay = () => {
    sound.playMenuSelect();
    if (onReplayChapterOne) {
      onReplayChapterOne();
    } else {
      navigate('/chapters/1');
    }
  };

  const formattedChapterNum = chapterNumber < 10 ? `0${chapterNumber}` : `${chapterNumber}`;

  const cardContent = (
    <div className="relative w-full max-w-2xl bg-[#060b08]/96 rounded-none backdrop-blur-md p-8 select-none">
      {/* Header & Status Badges */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-6">
        {/* Route Access Badge (Top Left) */}
        <div className="flex items-center gap-2 text-xs font-burmese tracking-wide text-[#7fa391]">
          <span className="w-1.5 h-1.5 rounded-none bg-[#4d6e5e]" />
          <span>လမ်းကြောင်း ဖွင့်လှစ်ပြီး</span> &bull; <span>အခန်း</span> <span className="font-mono tabular-nums">{formattedChapterNum}</span>
        </div>

        {/* Gate Pass Verified Badge (Top Right) */}
        <span className="px-2.5 py-1 rounded-none bg-[#101c15] text-[#86af99] text-xs font-burmese">
          တံခါးဖြတ်သန်းခွင့် အတည်ပြုပြီး
        </span>
      </div>

      {/* Chapter Titles & In Development Tag */}
      <div className="space-y-2 mb-6">
        <div className="text-xs font-burmese text-[#7fa391] tracking-wide">
          {tagline}
        </div>
        <h2
          className="text-2xl sm:text-3xl font-bold text-[#b1d4c2] tracking-wide font-burmese leading-tight"
        >
          {subtitle}
        </h2>
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#0b140f] text-[#8fa89b] text-xs font-burmese">
            <span>အခန်း {chapterNumber}</span> &bull; <span>ဆက်လက်ဖန်တီးနေဆဲ</span>
          </span>
        </div>
      </div>

      {/* Inner Card & Bullet Point Sections */}
      <div className="bg-[#0b140f]/80 rounded-none p-4 mb-6 space-y-2">
        <p className="text-[#b4c9bf] font-burmese leading-[1.75] text-xs sm:text-sm">
          {scopeSummary}
        </p>
        <p className="text-[#6e8a7d] italic text-xs font-burmese leading-[1.75]">
          (မှတ်ချက် - အခန်း ၁ ကို ယခုအခါ အပြည့်အစုံ ကစားနိုင်ပါသည်။ အခန်း ၂ နှင့် ၃ လမ်းကြောင်းများသည် ကစားပွဲ လမ်းကြောင်းစစ်ဆေးမှုနှင့် တံခါးဖွင့်လှစ်မှု စနစ်ကို ပြသထားခြင်း ဖြစ်ပါသည်)။
        </p>
      </div>

      {/* Planned Investigation Beats List */}
      <div className="space-y-2.5 mb-8">
        <div className="text-xs font-burmese tracking-wide text-[#7fa391] mb-3">
          အပြည့်အစုံထွက်ရှိချိန်တွင် ပါဝင်မည့် စုံစမ်းစစ်ဆေးမှု အစီအစဉ်များ -
        </div>
        <ul className="space-y-1.5">
          {plannedFeatures.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#4d6e5e] font-mono">›</span>
              <span className="text-[#9db3a8] text-xs font-burmese leading-[1.75]">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handleReturn}
          className="px-5 py-2.5 rounded-none bg-[#0b140f] hover:bg-[#101c15] text-[#a1b8ac] font-burmese text-xs tracking-wider transition-colors"
        >
          အခန်းရွေးချယ်မှုသို့ ပြန်သွားရန်
        </button>

        <button
          onClick={handleReplay}
          className="px-6 py-2.5 rounded-none bg-[#193828] hover:bg-[#29543e] text-[#d1e3da] font-burmese text-xs tracking-wider transition-colors shadow-none"
        >
          အခန်း ၁ ပြန်လည်ကစားရန်
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        {cardContent}
      </div>
    );
  }

  return cardContent;
};

export default ChapterPreviewModal;
