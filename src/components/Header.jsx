import React from 'react';
import { BookOpen, Languages, Type, LogOut, Star, Trophy } from 'lucide-react';

export default function Header({ theme, nativeLang, userId, totalCorrect, totalQuizzes, onReset, onLogout, onToggleTextSize }) {
  return (
    <header className={`${theme.header} p-5 md:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md`}>
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 opacity-90 shrink-0" />
        <div>
          <h1 className={`${theme.fontSizeTitle} tracking-wide text-center sm:text-left`}>
            English Companion
          </h1>
          {userId && (
            <div className="flex items-center gap-3 mt-1 text-emerald-100 font-bold text-sm">
              <span className="flex items-center gap-1" title="Total Correct Answers">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {totalCorrect || 0}
              </span>
              <span className="flex items-center gap-1" title="Quizzes Completed">
                <Trophy className="w-4 h-4 fill-amber-500 text-amber-500" /> {totalQuizzes || 0}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {/* We want the user to always be able to change text size/settings */}
        <button 
          onClick={onToggleTextSize}
          className={`${theme.headerBtn} flex items-center gap-2 active:scale-95 transition cursor-pointer`}
          title="Change Text Size"
        >
          <Type className="w-5 h-5 shrink-0" />
          <span>Aa (അക്ഷര വലിപ്പം)</span>
        </button>

        {nativeLang && (
          <button 
            onClick={onReset}
            className={`${theme.headerBtn} flex items-center gap-2 active:scale-95 transition cursor-pointer`}
          >
            <Languages className="w-5 h-5 shrink-0" />
            <span>{nativeLang.flag} Language</span>
          </button>
        )}

        {userId && (
          <button 
            onClick={onLogout}
            className={`${theme.headerBtn} bg-rose-600 hover:bg-rose-700 flex items-center gap-2 active:scale-95 transition cursor-pointer`}
            title="Log out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Exit</span>
          </button>
        )}
      </div>
    </header>
  );
}