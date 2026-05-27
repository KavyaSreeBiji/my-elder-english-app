import React from 'react';
import { Sparkles, Eye, ShieldAlert, Zap } from 'lucide-react';

export default function AgeSelect({ onSelectAge }) {
  const options = [
    {
      id: 'prime',
      ageRange: '45 - 50',
      name: 'Prime Learner',
      malName: 'ഊർജ്ജസ്വല പഠനം',
      desc: 'Standard text size, dynamic colors & active text pacing.',
      malDesc: 'സാധാരണ അക്ഷരങ്ങൾ, കൂടുതൽ വേഗതയുള്ള സംസാരം.',
      icon: <Zap className="w-10 h-10 text-purple-600" />,
      colorClass: 'border-purple-200 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/60',
      badge: '⚡ Energized'
    },
    {
      id: 'active',
      ageRange: '50 - 65',
      name: 'Active Learner',
      malName: 'യുവത്വം നിറഞ്ഞ പഠനം',
      desc: 'Comfortable size, vibrant colors & normal text pacing.',
      malDesc: 'വ്യക്തമായ അക്ഷരങ്ങൾ, മനോഹരമായ നിറങ്ങൾ.',
      icon: <Sparkles className="w-10 h-10 text-emerald-600" />,
      colorClass: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/60',
      badge: '👍 Balanced'
    },
    {
      id: 'golden',
      ageRange: '66 - 75',
      name: 'Golden Learner',
      malName: 'സ്വർണ്ണ പഠനം (വലിയ അക്ഷരങ്ങൾ)',
      desc: 'Larger text, soft amber backgrounds to reduce eye strain & slower voice pacing.',
      malDesc: 'കൂടുതൽ വലിയ അക്ഷരങ്ങൾ, കണ്ണിന് ആശ്വാസമേകുന്ന നിറങ്ങൾ.',
      icon: <Eye className="w-10 h-10 text-amber-600" />,
      colorClass: 'border-amber-200 hover:border-amber-500 bg-amber-50/20 hover:bg-amber-50/60',
      badge: '👁️ High Comfort'
    },
    {
      id: 'venerable',
      ageRange: '76+',
      name: 'Senior Max',
      malName: 'പരമാവധി സഹായം (വലിയ ബട്ടണുകൾ)',
      desc: 'Double-sized fonts, maximum-contrast colors, massive buttons & extra slow voice.',
      malDesc: 'വളരെ വലിയ അക്ഷരങ്ങളും ബട്ടണുകളും, വളരെ പതുക്കെയുള്ള സംസാരം.',
      icon: <ShieldAlert className="w-10 h-10 text-blue-600" />,
      colorClass: 'border-blue-200 hover:border-blue-600 bg-blue-50/20 hover:bg-blue-50/60',
      badge: '♿ Maximum Ease'
    }
  ];

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Welcome to English Companion!
        </h2>
        <p className="text-xl text-slate-600 mt-2 font-bold">
          സ്വാഗതം! ഏത് തരത്തിലുള്ള അക്ഷരങ്ങളാണ് നിങ്ങൾക്ക് കൂടുതൽ കാണാൻ എളുപ്പം?
        </p>
        <p className="text-md text-slate-400 mt-1 italic">
          (Choose the screen settings that feel most comfortable for your eyes)
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelectAge(opt.id)}
            className={`w-full text-left p-6 rounded-3xl border-3 shadow-md transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${opt.colorClass} group`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0">
                {opt.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-xs">
                    Age {opt.ageRange}
                  </span>
                  <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-100 shadow-xs">
                    {opt.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                  {opt.name} <span className="text-slate-400 font-medium">| {opt.ageRange}</span>
                </h3>
                <h4 className="text-xl font-bold text-slate-700 mt-0.5">
                  {opt.malName}
                </h4>
                <p className="text-base text-slate-500 font-medium mt-1 leading-snug">
                  {opt.desc}
                </p>
                <p className="text-sm text-slate-400 italic mt-0.5">
                  ({opt.malDesc})
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
