import React from 'react';
import { ChevronRight, Globe2 } from 'lucide-react';
import { LANGUAGES } from '../data/contentData';

export default function LanguageSelect({ theme, onSelectLanguage }) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto">
      <div className={`mb-6 md:mb-8 p-4 md:p-6 rounded-full ${theme.accentBg} inline-flex shadow-inner`}>
        <Globe2 className={`w-12 h-12 md:w-16 md:h-16 ${theme.accentText}`} />
      </div>

      <h1 className={`${theme.fontSizeTitle} ${theme.textPrimary} mb-3 md:mb-4 tracking-tight`}>
        Welcome / സ്വാഗതം / नमस्ते / வணக்கம் / Bienvenido
      </h1>
      <p className={`${theme.fontSizeBody} ${theme.textSecondary} mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed`}>
        Please select your preferred language to begin. We will customize your learning experience based on your choice.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onSelectLanguage(lang)}
            className={`w-full ${theme.cardBg} text-left p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group active:scale-[0.98] cursor-pointer`}
          >
            <span className={`text-xl md:text-2xl font-black ${theme.textPrimary} flex items-center gap-4 md:gap-6`}>
              <span className="text-4xl md:text-5xl filter drop-shadow-sm">{lang.flag}</span> 
              <span>{lang.name}</span>
            </span>
            <ChevronRight className={`w-8 h-8 md:w-10 md:h-10 ${theme.textSecondary} group-hover:translate-x-2 group-hover:text-emerald-600 transition-all duration-300`} />
          </button>
        ))}
      </div>
    </div>
  );
}