import React from 'react';
import { BookOpen, Languages, Sliders } from 'lucide-react';

export default function Header({ theme, nativeLang, onReset, onResetAge }) {
  return (
    <header className={`${theme.header} p-5 md:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md`}>
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 opacity-90 shrink-0" />
        <h1 className={`${theme.fontSizeTitle} tracking-wide text-center sm:text-left`}>
          English Companion
        </h1>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {/* We want the user to always be able to change text size/settings */}
        <button 
          onClick={onResetAge}
          className={`${theme.headerBtn} flex items-center gap-2 active:scale-95 transition`}
          title="Change Text Size / Age Group"
        >
          <Sliders className="w-5 h-5 shrink-0" />
          <span>Aa (അക്ഷര വലിപ്പം)</span>
        </button>

        {nativeLang && (
          <button 
            onClick={onReset}
            className={`${theme.headerBtn} flex items-center gap-2 active:scale-95 transition`}
          >
            <Languages className="w-5 h-5 shrink-0" />
            <span>{nativeLang.flag} Language</span>
          </button>
        )}
      </div>
    </header>
  );
}