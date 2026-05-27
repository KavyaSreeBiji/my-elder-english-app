import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LANGUAGES } from '../data/contentData';

export default function LanguageSelect({ theme, onSelectLanguage }) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center py-6 px-2">
      <h2 className={`${theme.fontSizeTitle} ${theme.textPrimary} mb-2`}>
        നമസ്കാരം / Welcome
      </h2>
      <p className={`${theme.fontSizeSubtitle} ${theme.textSecondary} mb-8 max-w-md`}>
        Please choose your native language to start learning English:
        <span className="block text-base opacity-75 mt-1 font-medium">
          (പഠനം ആരംഭിക്കാൻ നിങ്ങളുടെ മാതൃഭാഷ തിരഞ്ഞെടുക്കുക)
        </span>
      </p>
      
      <div className="grid grid-cols-1 gap-5 w-full max-w-md">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onSelectLanguage(lang)}
            className={`w-full ${theme.cardBg} text-left p-6 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-between group active:scale-[0.98] cursor-pointer`}
          >
            <span className={`text-2xl font-black ${theme.textPrimary} flex items-center gap-4`}>
              <span className="text-4xl filter drop-shadow-sm">{lang.flag}</span> 
              <span>{lang.name}</span>
            </span>
            <ChevronRight className={`w-8 h-8 ${theme.textSecondary} group-hover:translate-x-1 transition-transform`} />
          </button>
        ))}
      </div>
    </div>
  );
}