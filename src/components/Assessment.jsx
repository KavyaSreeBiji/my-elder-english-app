import React from 'react';
import { BookOpen, HelpCircle, Star, GraduationCap } from 'lucide-react';

const LEVEL_OPTIONS = [
  {
    id: 'none',
    icon: <HelpCircle className="w-8 h-8 text-rose-500" />,
    enName: "I know nothing at all",
    mlName: "എനിക്ക് ഇംഗ്ലീഷ് ഒട്ടും അറിയില്ല",
    colorClass: "border-rose-200 hover:border-rose-500 bg-rose-50 hover:bg-rose-100"
  },
  {
    id: 'basic',
    icon: <BookOpen className="w-8 h-8 text-amber-500" />,
    enName: "I know a few words",
    mlName: "എനിക്ക് കുറച്ച് വാക്കുകൾ അറിയാം (ഉദാ: Hello, Thanks)",
    colorClass: "border-amber-200 hover:border-amber-500 bg-amber-50 hover:bg-amber-100"
  },
  {
    id: 'intermediate',
    icon: <Star className="w-8 h-8 text-emerald-500" />,
    enName: "I can form basic sentences",
    mlName: "എനിക്ക് ചെറിയ വാക്യങ്ങൾ ഉണ്ടാക്കാൻ കഴിയും",
    colorClass: "border-emerald-200 hover:border-emerald-500 bg-emerald-50 hover:bg-emerald-100"
  },
  {
    id: 'advanced',
    icon: <GraduationCap className="w-8 h-8 text-indigo-500" />,
    enName: "I can converse a bit",
    mlName: "എനിക്ക് അത്യാവശ്യം സംസാരിക്കാൻ കഴിയും",
    colorClass: "border-indigo-200 hover:border-indigo-500 bg-indigo-50 hover:bg-indigo-100"
  }
];

export default function Assessment({ onSelectLevel, nativeLang, theme }) {
  const isMl = nativeLang?.id === 'ml';

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-2">
      <div className="text-center mb-8">
        <h2 className={`${theme.fontSizeTitle} text-slate-800 tracking-tight font-black`}>
          {isMl ? "നിങ്ങളുടെ ഇംഗ്ലീഷ് നിലവാരം എന്താണ്?" : "What is your English level?"}
        </h2>
        <p className={`${theme.fontSizeSubtitle} text-slate-600 mt-2 font-bold`}>
          {isMl 
            ? "ഇതനുസരിച്ച് ഞങ്ങൾ പാഠങ്ങൾ ക്രമീകരിക്കുന്നതാണ്." 
            : "We will customize the lessons based on your answer."}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">
        {LEVEL_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelectLevel(opt.id)}
            className={`w-full text-left p-5 rounded-2xl border-2 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-4 ${opt.colorClass}`}
          >
            <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
              {opt.icon}
            </div>
            <div>
              <h3 className={`${theme.fontSizeBody} font-black text-slate-800`}>
                {isMl ? opt.mlName : opt.enName}
              </h3>
              {isMl && <p className="text-sm text-slate-500 font-medium mt-1">{opt.enName}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
