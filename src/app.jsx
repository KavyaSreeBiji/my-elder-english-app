import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import Header from './components/Header';
import Assessment from './components/Assessment';
import LanguageSelect from './components/LanguageSelect';
import CategoryHub from './components/CategoryHub';
import FlashcardDeck from './components/FlashcardDeck';
import AiChat from './components/AiChat';
import Login from './components/Login';
import TextSizeModal from './components/TextSizeModal';
import { auth, saveUserProgress, loadUserProgress } from './firebase';

const UNIFIED_THEME_COLORS = {
  bg: "bg-gradient-to-br from-slate-50 via-teal-50/15 to-indigo-50/15 min-h-screen text-slate-900 font-sans p-4 md:p-8 flex flex-col items-center justify-center transition-all duration-300",
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
  speechRate: 0.85
};

const TEXT_SIZES = {
  small: {
    fontSizeTitle: "text-xl md:text-2xl font-extrabold tracking-tight",
    fontSizeSubtitle: "text-base md:text-lg font-medium",
    fontSizeBody: "text-sm md:text-base",
    fontSizeCardEnglish: "text-2xl md:text-3xl font-black",
    fontSizeCardMalayalam: "text-xl md:text-2xl font-bold",
    fontSizeBtn: "text-base md:text-lg font-bold p-4 rounded-xl",
  },
  medium: {
    fontSizeTitle: "text-2xl md:text-3xl font-extrabold tracking-tight",
    fontSizeSubtitle: "text-lg md:text-xl font-medium",
    fontSizeBody: "text-base md:text-lg",
    fontSizeCardEnglish: "text-3xl md:text-4xl font-black",
    fontSizeCardMalayalam: "text-2xl md:text-3xl font-bold",
    fontSizeBtn: "text-lg md:text-xl font-bold p-5 rounded-2xl",
  },
  large: {
    fontSizeTitle: "text-3xl md:text-4xl font-black tracking-tight",
    fontSizeSubtitle: "text-xl md:text-2xl font-bold",
    fontSizeBody: "text-lg md:text-xl font-semibold",
    fontSizeCardEnglish: "text-4xl md:text-5xl font-black",
    fontSizeCardMalayalam: "text-3xl md:text-4xl font-extrabold",
    fontSizeBtn: "text-xl md:text-2xl font-black p-6 rounded-[24px] shadow-sm",
  },
  xlarge: {
    fontSizeTitle: "text-4xl md:text-5xl font-black tracking-tight",
    fontSizeSubtitle: "text-2xl md:text-3xl font-black",
    fontSizeBody: "text-xl md:text-2xl font-black",
    fontSizeCardEnglish: "text-5xl md:text-6xl font-black",
    fontSizeCardMalayalam: "text-4xl md:text-5xl font-black",
    fontSizeBtn: "text-2xl md:text-3xl font-black p-8 rounded-[28px] tracking-wide shadow-md",
  }
};

export default function App() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [englishLevel, setEnglishLevel] = useState(null);
  const [textSize, setTextSize] = useState('medium');
  const [nativeLang, setNativeLang] = useState(null);
  const [screen, setScreenState] = useState('language-select');

  const setScreen = (newScreen) => {
    if (newScreen !== screen) {
      window.history.pushState({ screen: newScreen }, '', `?screen=${newScreen}`);
      setScreenState(newScreen);
    }
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.screen) {
        setScreenState(event.state.screen);
      } else {
        setScreenState(userId ? 'home' : 'language-select');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [userId]);

  useEffect(() => {
    if (isDataLoaded) {
      window.history.replaceState({ screen }, '', `?screen=${screen}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoaded]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const theme = { ...UNIFIED_THEME_COLORS, ...(TEXT_SIZES[textSize] || TEXT_SIZES.medium) };

  useEffect(() => {
    if (isDataLoaded && userId) {
      saveUserProgress(userId, {
        email: userName,
        englishLevel,
        textSize,
        nativeLang,
        screen,
        selectedCategory,
        totalCorrect,
        totalQuizzes
      });
    }
  }, [userId, userName, englishLevel, textSize, nativeLang, screen, selectedCategory, totalCorrect, totalQuizzes, isDataLoaded]);

  useEffect(() => {
    if (!auth) {
      setIsDataLoaded(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.email);
        const data = await loadUserProgress(user.uid);
        if (data) {
          setEnglishLevel(data.englishLevel || null);
          setTextSize(data.textSize || 'medium');
          setNativeLang(data.nativeLang || null);
          setScreenState(data.screen || 'assessment');
          setSelectedCategory(data.selectedCategory || null);
          setTotalCorrect(data.totalCorrect || 0);
          setTotalQuizzes(data.totalQuizzes || 0);
        } else {
          setScreenState('assessment');
        }
      } else {
        setUserId(null);
        setUserName(null);
      }
      setIsDataLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (email, password, isSignUp) => {
    setLoginError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // state will be handled by onAuthStateChanged listener
    } catch (error) {
      console.error("Auth error:", error);
      setLoginError(error.code || 'unknown-error');
    }
  };

  const handleReset = () => {
    setNativeLang(null);
    setScreen('language-select');
    setSelectedCategory(null);
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setUserId(null);
    setUserName(null);
    setEnglishLevel(null);
    setNativeLang(null);
    setSelectedCategory(null);
    setTotalCorrect(0);
    setTotalQuizzes(0);
    setScreen('language-select');
  };

  return (
    <div className={theme.bg}>
      {isTextModalOpen && (
        <TextSizeModal
          theme={theme}
          nativeLang={nativeLang}
          currentSize={textSize}
          onSizeChange={setTextSize}
          onClose={() => setIsTextModalOpen(false)}
        />
      )}

      <div className={`w-full max-w-3xl ${theme.container} overflow-hidden flex flex-col my-auto min-h-[82vh] transition-all duration-300`}>
        <Header 
          theme={theme} 
          nativeLang={nativeLang} 
          userId={userId}
          totalCorrect={totalCorrect}
          totalQuizzes={totalQuizzes}
          onReset={handleReset}
          onLogout={handleLogout}
          onToggleTextSize={() => setIsTextModalOpen(true)} 
        />

        <main className="flex-1 p-3 sm:p-6 md:p-8 flex flex-col justify-between bg-emerald-50/5">
          {screen === 'language-select' && (
            <LanguageSelect 
              theme={theme} 
              onSelectLanguage={(lang) => { setNativeLang(lang); setScreen('login'); }} 
            />
          )}

          {screen === 'login' && (
            <Login theme={theme} nativeLang={nativeLang} onAuth={handleAuth} loginError={loginError} />
          )}

          {screen === 'assessment' && (
            <Assessment 
              theme={theme}
              nativeLang={nativeLang}
              onSelectLevel={(level) => { setEnglishLevel(level); setScreen('home'); }} 
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
              englishLevel={englishLevel}
              categoryId={selectedCategory} 
              onBack={() => setScreen('home')} 
              onQuizComplete={(score) => {
                setTotalCorrect(prev => prev + score);
                setTotalQuizzes(prev => prev + 1);
              }}
            />
          )}

          {screen === 'ai-chat' && (
            <AiChat 
              theme={theme}
              nativeLang={nativeLang}
              englishLevel={englishLevel}
              onBack={() => setScreen('home')} 
            />
          )}
        </main>
      </div>
    </div>
  );
}