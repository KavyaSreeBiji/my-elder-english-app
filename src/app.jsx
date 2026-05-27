import React, { useState } from 'react';
import Header from './components/Header';
import AgeSelect from './components/AgeSelect';
import LanguageSelect from './components/LanguageSelect';
import CategoryHub from './components/CategoryHub';
import FlashcardDeck from './components/FlashcardDeck';
import AiChat from './components/AiChat';

export const THEMES = {
  prime: {
    id: 'prime',
    name: "Prime (45-50)",
    desc: "Standard text size, dynamic colors",
    bg: "bg-gradient-to-br from-slate-50 via-purple-50/15 to-indigo-50/15 min-h-screen text-slate-900 font-sans p-4 md:p-8 flex flex-col items-center justify-center",
    container: "bg-white border-4 border-purple-600/20 shadow-2xl rounded-3xl",
    header: "bg-purple-600 text-white",
    headerBtn: "bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold py-2.5 px-5 rounded-full shadow-sm active:scale-95 transition",
    cardBg: "bg-white border-2 border-slate-200 hover:border-purple-500",
    textPrimary: "text-slate-800",
    textSecondary: "text-slate-600",
    accentText: "text-purple-700",
    accentBg: "bg-purple-50 border border-purple-200 text-purple-800",
    btnPrimary: "bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-200 active:scale-95 shadow-md",
    btnSecondary: "bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all duration-200 active:scale-95 shadow-md",
    btnSecondaryLight: "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100",
    chatUserBg: "bg-purple-600 text-white rounded-br-none",
    chatAiBg: "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs",
    input: "border-2 border-slate-200 focus:border-purple-500",
    fontSizeTitle: "text-xl md:text-2xl font-extrabold tracking-tight",
    fontSizeSubtitle: "text-base md:text-lg font-medium",
    fontSizeBody: "text-sm md:text-base",
    fontSizeCardEnglish: "text-2xl md:text-3xl font-black",
    fontSizeCardMalayalam: "text-xl md:text-2xl font-bold",
    fontSizeBtn: "text-base md:text-lg font-bold p-4 rounded-xl",
    speechRate: 0.95
  },
  active: {
    id: 'active',
    name: "Active (50-65)",
    desc: "Comfortable size, vibrant colors",
    bg: "bg-gradient-to-br from-slate-50 via-teal-50/15 to-indigo-50/15 min-h-screen text-slate-900 font-sans p-4 md:p-8 flex flex-col items-center justify-center",
    container: "bg-white border-4 border-emerald-600/20 shadow-2xl rounded-3xl",
    header: "bg-emerald-600 text-white",
    headerBtn: "bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold py-2.5 px-5 rounded-full shadow-sm active:scale-95 transition",
    cardBg: "bg-white border-2 border-slate-200 hover:border-emerald-500",
    textPrimary: "text-slate-800",
    textSecondary: "text-slate-600",
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all duration-200 active:scale-95 shadow-md",
    btnSecondary: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all duration-200 active:scale-95 shadow-md",
    btnSecondaryLight: "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100",
    chatUserBg: "bg-indigo-600 text-white rounded-br-none",
    chatAiBg: "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs",
    input: "border-2 border-slate-200 focus:border-indigo-500",
    fontSizeTitle: "text-2xl md:text-3xl font-extrabold tracking-tight",
    fontSizeSubtitle: "text-lg md:text-xl font-medium",
    fontSizeBody: "text-base md:text-lg",
    fontSizeCardEnglish: "text-3xl md:text-4xl font-black",
    fontSizeCardMalayalam: "text-2xl md:text-3xl font-bold",
    fontSizeBtn: "text-lg md:text-xl font-bold p-5 rounded-2xl",
    speechRate: 0.85
  },
  golden: {
    id: 'golden',
    name: "Golden (66-75)",
    desc: "Larger text, warm soothing colors",
    bg: "bg-gradient-to-br from-[#fffbeb] via-[#fef3c7]/20 to-[#fde68a]/15 min-h-screen text-[#451a03] font-sans p-4 md:p-8 flex flex-col items-center justify-center",
    container: "bg-[#fffdf9] border-4 border-[#d97706]/40 shadow-2xl rounded-[32px]",
    header: "bg-[#d97706] text-white border-b-2 border-[#b45309]",
    headerBtn: "bg-[#b45309] hover:bg-[#92400e] text-white text-base font-bold py-3 px-6 rounded-full shadow-sm active:scale-95 transition",
    cardBg: "bg-[#fffbeb] border-3 border-[#f59e0b]/40 hover:border-[#d97706]",
    textPrimary: "text-[#451a03] font-extrabold",
    textSecondary: "text-[#78350f] font-semibold",
    accentText: "text-[#b45309]",
    accentBg: "bg-[#fef3c7] border-2 border-[#fde68a] text-[#78350f] font-bold",
    btnPrimary: "bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold transition-all duration-200 active:scale-95 shadow-lg",
    btnSecondary: "bg-[#4338ca] hover:bg-[#3730a3] text-white font-extrabold transition-all duration-200 active:scale-95 shadow-lg",
    btnSecondaryLight: "bg-[#e0e7ff] text-[#3730a3] border-2 border-[#c7d2fe] hover:bg-[#c7d2fe]",
    chatUserBg: "bg-[#4338ca] text-white rounded-br-none border-2 border-indigo-700",
    chatAiBg: "bg-[#fffdf9] text-[#451a03] border-2 border-[#fde68a] rounded-bl-none shadow-md",
    input: "border-3 border-[#f59e0b]/40 focus:border-[#d97706] bg-white text-[#451a03] font-bold",
    fontSizeTitle: "text-3xl md:text-4xl font-black tracking-tight",
    fontSizeSubtitle: "text-xl md:text-2xl font-bold",
    fontSizeBody: "text-lg md:text-xl font-semibold",
    fontSizeCardEnglish: "text-4xl md:text-5xl font-black",
    fontSizeCardMalayalam: "text-3xl md:text-4xl font-extrabold",
    fontSizeBtn: "text-xl md:text-2xl font-black p-6 rounded-[24px] shadow-sm",
    speechRate: 0.70
  },
  venerable: {
    id: 'venerable',
    name: "Senior Max (76+)",
    desc: "Maximum contrast, giant buttons, slow speech",
    bg: "bg-slate-100 min-h-screen text-black font-sans p-4 md:p-8 flex flex-col items-center justify-center",
    container: "bg-white border-6 border-blue-900 shadow-2xl rounded-[36px]",
    header: "bg-blue-900 text-white border-b-6 border-blue-950",
    headerBtn: "bg-yellow-400 text-blue-950 hover:bg-yellow-500 text-lg font-black py-4 px-8 rounded-2xl shadow-md border-2 border-black active:scale-95 transition",
    cardBg: "bg-yellow-50 border-4 border-blue-900",
    textPrimary: "text-blue-950 font-black",
    textSecondary: "text-slate-900 font-bold",
    accentText: "text-blue-900 font-black",
    accentBg: "bg-yellow-100 border-4 border-yellow-400 text-blue-950 font-black",
    btnPrimary: "bg-blue-900 hover:bg-blue-950 text-white font-black border-3 border-black rounded-[24px] active:scale-95 shadow-xl transition-all duration-200",
    btnSecondary: "bg-emerald-800 hover:bg-emerald-900 text-white font-black border-3 border-black rounded-[24px] active:scale-95 shadow-xl transition-all duration-200",
    btnSecondaryLight: "bg-slate-200 text-slate-950 border-4 border-slate-400 hover:bg-slate-300 font-black",
    chatUserBg: "bg-blue-900 text-white border-2 border-black rounded-br-none",
    chatAiBg: "bg-yellow-50 text-blue-950 border-4 border-blue-900 rounded-bl-none shadow-xl",
    input: "border-4 border-blue-900 focus:border-blue-950 bg-white text-black font-black placeholder-slate-500",
    fontSizeTitle: "text-4xl md:text-5xl font-black tracking-tight",
    fontSizeSubtitle: "text-2xl md:text-3xl font-black",
    fontSizeBody: "text-xl md:text-2xl font-black",
    fontSizeCardEnglish: "text-5xl md:text-6xl font-black",
    fontSizeCardMalayalam: "text-4xl md:text-5xl font-black",
    fontSizeBtn: "text-2xl md:text-3xl font-black p-8 rounded-[28px] tracking-wide shadow-md",
    speechRate: 0.60
  }
};

export default function App() {
  const [ageGroup, setAgeGroup] = useState(null);
  const [nativeLang, setNativeLang] = useState(null);
  const [screen, setScreen] = useState('age-select'); // age-select, language-select, home, flashcard, ai-chat
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Active theme based on age group
  const theme = THEMES[ageGroup] || THEMES.active;

  const handleReset = () => {
    setNativeLang(null);
    setScreen('language-select');
    setSelectedCategory(null);
  };

  const handleResetAge = () => {
    setAgeGroup(null);
    setNativeLang(null);
    setSelectedCategory(null);
    setScreen('age-select');
  };

  return (
    <div className={theme.bg}>
      <div className={`w-full max-w-3xl ${theme.container} overflow-hidden flex flex-col my-auto min-h-[82vh] transition-all duration-300`}>
        
        <Header 
          theme={theme} 
          nativeLang={nativeLang} 
          onReset={handleReset} 
          onResetAge={handleResetAge} 
        />

        <main className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-emerald-50/5">
          {screen === 'age-select' && (
            <AgeSelect onSelectAge={(age) => { setAgeGroup(age); setScreen('language-select'); }} />
          )}

          {screen === 'language-select' && (
            <LanguageSelect 
              theme={theme} 
              onSelectLanguage={(lang) => { setNativeLang(lang); setScreen('home'); }} 
            />
          )}

          {screen === 'home' && nativeLang && (
            <CategoryHub 
              theme={theme}
              nativeLang={nativeLang} 
              onSelectCategory={(id) => { setSelectedCategory(id); setScreen('flashcard'); }}
              onNavigateToChat={() => setScreen('ai-chat')}
            />
          )}

          {screen === 'flashcard' && selectedCategory && (
            <FlashcardDeck 
              theme={theme}
              nativeLang={nativeLang} 
              categoryId={selectedCategory} 
              onBack={() => setScreen('home')} 
            />
          )}

          {screen === 'ai-chat' && (
            <AiChat 
              theme={theme}
              nativeLang={nativeLang} 
              onBack={() => setScreen('home')} 
            />
          )}
        </main>
      </div>
    </div>
  );
}