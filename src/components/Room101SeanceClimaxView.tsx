import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';

export interface Room101SeanceClimaxViewProps {
  onComplete?: () => void;
  setActiveMonologue?: (text: string | null) => void;
  backgroundImage?: string;
}

export const Room101SeanceClimaxView: React.FC<Room101SeanceClimaxViewProps> = ({
  onComplete,
  setActiveMonologue,
  backgroundImage = '/assets/scenes/well_interior_deep.jpg',
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      (sound as any).playDamage?.();
      (sound as any).playAmbientDrone?.() || (sound as any).startAmbient?.();
    } catch {}

    setActiveMonologue?.(
      "ရေလျှံနေသော မြေအောက်ရေမြောင်းပေါက်မှတစ်ဆင့် အခန်း ၁၀၁ ၏ အောက်ခြေမြေအောက်ခန်းသို့ တွားသွားဝင်ရောက်ခဲ့သည်... ရွှံ့နွံများအောက်တွင် ယဇ်ပူဇော်ရာ မြေဖြူစက်ဝိုင်းသည် မှိန်ဖျော့ဖျော့ လင်းလက်နေသည်။"
    );

    const timer1 = setTimeout(() => {
      setStep(1);
      setActiveMonologue?.(
        "ရုတ်တရက် မျက်စိကျိန်းမတတ် အလင်းရောင်တစ်ခုက အမှောင်ထုကို ထိုးခွဲလိုက်သည်! ၁၉၉၈ ခုနှစ် ဩဂုတ်လ၏ ဝိညာဉ်အမှတ်တရများသည် မျက်စိရှေ့တွင် ပြင်းထန်စွာ ရစ်ဝဲပေါ်ပေါက်လာသည်..."
      );
    }, 3000);

    const timer2 = setTimeout(() => {
      setStep(2);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setActiveMonologue]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black flex items-center justify-center">
      {/* Background Graphic */}
      <img
        src={backgroundImage}
        onError={(e) => {
          e.currentTarget.src = '/assets/scenes/well_interior_deep.jpg';
        }}
        alt="Room 101 Seance Climax Flashback"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-1000 ${
          step >= 1 ? 'brightness-150 contrast-125 filter invert hue-rotate-180' : 'brightness-75'
        }`}
      />

      {/* Atmospheric Climax Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-black/40 to-black/80 pointer-events-none" />

      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.2, 0.9, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-red-600/30 mix-blend-overlay pointer-events-none"
        />
      )}

      {/* Narrative Climax Box */}
      <div className="relative z-30 max-w-xl mx-6 p-6 rounded-2xl bg-black/80 border border-red-500/40 backdrop-blur-md text-center shadow-2xl">
        <h2 className="text-2xl font-mono font-bold text-red-400 tracking-widest uppercase mb-3">
          [ ရေမြောင်းပေါက်သို့ ရောက်ရှိ — အခန်း ၁၀၁ ]
        </h2>
        <p className="text-stone-300 font-mono text-sm leading-relaxed mb-6">
          {step === 0 && "မြေအောက်ရေမြောင်းသည် အခန်း ၁၀၁ ၏ ပိတ်ထားသော ကြမ်းပြင်အောက်သို့ တိုက်ရိုက်ရောက်ရှိနေသည်။ သံစက်ဝိုင်း ပြီးပြည့်စုံသွားပြီ။"}
          {step === 1 && "မေ၏ အမှတ်တရများသည် အမှောင်လွှာကို ထိုးဖောက်လိုက်သည်! ၁၉၉၈ မိုးရာသီနှင့် ယနေ့ကာလတို့ ပြင်းထန်စွာ ရိုက်ခတ်ဆုံစည်းသွားသည်..."}
          {step >= 2 && "စုံစမ်းစစ်ဆေးမှုသည် အထွတ်အထိပ်သို့ ရောက်ရှိသွားပြီ။ အဆောင်၏ ဝိညာဉ်များသည် သင်ရောက်ရှိနေခြင်းကို အသိအမှတ်ပြုလိုက်ကြပြီ။"}
        </p>

        {step >= 2 && onComplete && (
          <button
            onClick={onComplete}
            className="px-6 py-2.5 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-400/60 text-red-200 font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            [ စုံစမ်းစစ်ဆေးမှု နိဂုံးသို့ ဆက်သွားမည် ]
          </button>
        )}
      </div>
    </div>
  );
};

export default Room101SeanceClimaxView;