import React from 'react';
import { MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/contentData';

export default function CategoryHub({ theme, nativeLang, onSelectCategory, onNavigateToChat }) {
  return (
    <div className="flex-1 flex flex-col justify-between py-2">
      <div>
        <div className={`${theme.accentBg} rounded-2xl p-5 mb-8 flex items-center gap-4 shadow-xs`}>
          <Sparkles className="w-8 h-8 shrink-0 text-amber-500 animate-pulse" />
          <p className={`${theme.fontSizeSubtitle} font-bold`}>
            {nativeLang.id === 'ml' && "പഠിക്കാൻ ആഗ്രഹിക്കുന്ന ഒരു വിഷയം തിരഞ്ഞെടുക്കൂ:"}
            {nativeLang.id === 'hi' && "वह विषय चुनें जिसे आप सीखना चाहते हैं:"}
            {nativeLang.id === 'ta' && "நீங்கள் கற்றுக்கொள்ள விரும்பும் தலைப்பைத் தேர்ந்தெடுக்கவும்:"}
            {nativeLang.id === 'es' && "Elija el tema que desea aprender:"}
            {!['ml', 'hi', 'ta', 'es'].includes(nativeLang.id) && "Choose a topic you want to learn:"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-6 ${theme.cardBg} rounded-3xl shadow-sm transition-all duration-200 text-left flex flex-col gap-3 active:scale-[0.97] cursor-pointer`}
            >
              <span className="text-5xl filter drop-shadow-sm">{cat.icon}</span>
              <div>
                <span className={`block text-2xl font-black ${theme.textPrimary}`}>
                  {cat.label[nativeLang.id] || cat.label.en}
                </span>
                <span className={`block text-sm font-extrabold tracking-wider ${theme.textSecondary} opacity-70 uppercase mt-1`}>
                  {cat.label.en}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNavigateToChat}
        className={`mt-10 ${theme.btnSecondary} p-6 rounded-3xl shadow-lg flex items-center justify-between transition-all duration-200 active:scale-[0.98] cursor-pointer`}
      >
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-white/20 rounded-2xl">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className={`${theme.fontSizeSubtitle} font-black text-white`}>
              {nativeLang.id === 'ml' ? 'AI സഹായം ചോദിക്കുക (സംശയങ്ങൾക്ക്)' : 'Ask AI Companion (Got questions?)'}
            </p>
            <p className="text-sm text-white/80 font-semibold mt-0.5">
              {nativeLang.id === 'ml' ? 'നിങ്ങളുടെ മാതൃഭാഷയിൽ ലളിതമായി സംസാരിച്ച് സംശയങ്ങൾ പരിഹരിക്കാം' : 'Get easy explanations in your own language'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-8 h-8 text-white/80" />
      </button>
    </div>
  );
}