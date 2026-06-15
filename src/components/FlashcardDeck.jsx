import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Volume2, Mic, MicOff, CheckCircle, AlertCircle,
  AlertTriangle, Trophy, ChevronRight, XCircle, Star
} from 'lucide-react';
import { LESSON_DATA } from '../data/contentData';
import { speakEnglish, getSpeechRecognitionSystem } from '../utils/speechEngine';

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const levenshteinDistance = (a, b) => {
  const tmp = [];
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  for (let i = 0; i <= a.length; i++) tmp[i] = [i];
  for (let j = 0; j <= b.length; j++) tmp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
};

const getSimilarity = (expected, actual) => {
  const clean = (s) => s.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '').trim().split(/\s+/).filter(Boolean);
  const expWords = clean(expected);
  const actWords = clean(actual);
  if (expWords.length === 0) return 0;
  let matched = 0;
  const pool = [...actWords];
  expWords.forEach((w) => {
    const idx = pool.findIndex((a) => a === w || (w.length > 3 && levenshteinDistance(w, a) <= 1));
    if (idx !== -1) { matched++; pool.splice(idx, 1); }
  });
  return (matched / expWords.length) * 100;
};

// Generate MCQ questions from the batch
const generateQuiz = (batchCards, allCards, langId, quizSize) => {
  const questions = [];
  batchCards.forEach((card) => {
    const wrongPool = shuffle(allCards.filter((c) => c.id !== card.id));
    const w3 = wrongPool.slice(0, 3);

    // Type A: English shown → pick native meaning
    questions.push({
      qType: 'toNative',
      prompt: card.english,
      answer: card.translations[langId] || card.translations.ml,
      options: shuffle([
        card.translations[langId] || card.translations.ml,
        ...w3.map((c) => c.translations[langId] || c.translations.ml),
      ]),
      speakOnShow: true, // auto-speak the English prompt
    });

    // Type B: Native shown → pick English
    questions.push({
      qType: 'toEnglish',
      prompt: card.translations[langId] || card.translations.ml,
      answer: card.english,
      options: shuffle([card.english, ...w3.map((c) => c.english)]),
      speakOnShow: false,
    });
  });
  return shuffle(questions).slice(0, quizSize);
};

// Language-specific UI strings
const L = {
  ml: {
    quizTitle: 'ചെറിയ ഒരു ടെസ്റ്റ്! 📝',
    toNative: 'ഈ ഇംഗ്ലീഷ് വാക്കിന്റെ അർത്ഥം ഏത്?',
    toEnglish: 'ഇതിന്റെ ഇംഗ്ലീഷ് ഏത്?',
    correct: 'ശരി! 🎉',
    wrong: (ans) => `ശരിയായ ഉത്തരം: "${ans}"`,
    nextQ: 'അടുത്ത ചോദ്യം',
    seeResult: 'ഫലം കാണൂ',
    resultTitle: 'ടെസ്റ്റ് കഴിഞ്ഞു!',
    excellent: 'അടിപൊളി! നിങ്ങൾ ഒരു ഇംഗ്ലീഷ് ചാമ്പ്യൻ ആണ്! 🌟',
    good: 'നന്നായി! കൂടുതൽ ശ്രമിക്കൂ! 👍',
    keepGoing: 'ശ്രമിച്ചോളൂ! ഓരോ ദിവസവും മെച്ചമാകും! 💪',
    continueLearning: 'തുടർന്ന് പഠിക്കൂ →',
    endSession: 'ഇന്ന് ഇവിടെ നിർത്തൂ',
    cardLabel: 'കാർഡ്',
    batchLabel: 'ബാച്ച്',
    listen: 'കേൾക്കുക',
    practice: 'ഉച്ചരിക്കൂ',
    speakNow: 'ഇപ്പോൾ ഉച്ചരിക്കൂ!',
    nextCard: 'അടുത്ത കാർഡ് →',
    endBtn: 'നിർത്തൂ',
    youSaid: 'നിങ്ങൾ പറഞ്ഞത്:',
    perfect: 'അതെ! കൃത്യമായി ഉച്ചരിച്ചു! 🎉',
    partial: (r) => `കൊള്ളാം! "${r}" — ഒന്നുകൂടി ശ്രമിക്കൂ!`,
    fail: (r) => `"${r}" — സാവധാനം ഉച്ചരിക്കൂ!`,
    quizComingIn: (n) => `${n} കാർഡ് കഴിഞ്ഞ് ടെസ്റ്റ്!`,
    score: (s, t) => `${s} / ${t} ശരി`,
  },
  hi: {
    quizTitle: 'एक छोटा टेस्ट! 📝',
    toNative: 'इस अंग्रेज़ी शब्द का हिन्दी अर्थ क्या है?',
    toEnglish: 'इस हिन्दी शब्द का अंग्रेज़ी क्या है?',
    correct: 'सही! 🎉',
    wrong: (ans) => `सही उत्तर: "${ans}"`,
    nextQ: 'अगला सवाल',
    seeResult: 'परिणाम देखें',
    resultTitle: 'टेस्ट पूरा!',
    excellent: 'शाबाश! आप अंग्रेज़ी चैम्पियन हैं! 🌟',
    good: 'अच्छा! थोड़ा और प्रयास करें! 👍',
    keepGoing: 'हिम्मत रखें! रोज़ बेहतर होते जाएंगे! 💪',
    continueLearning: 'पढ़ते रहें →',
    endSession: 'आज यहीं रुकें',
    cardLabel: 'कार्ड',
    batchLabel: 'बैच',
    listen: 'सुनें',
    practice: 'बोलें',
    speakNow: 'अभी बोलें!',
    nextCard: 'अगला कार्ड →',
    endBtn: 'रुकें',
    youSaid: 'आपने कहा:',
    perfect: 'बिल्कुल सही! 🎉',
    partial: (r) => `"${r}" — लगभग सही, एक बार और!`,
    fail: (r) => `"${r}" — धीरे-धीरे बोलें!`,
    quizComingIn: (n) => `${n} कार्ड बाद टेस्ट!`,
    score: (s, t) => `${s} / ${t} सही`,
  },
  ta: {
    quizTitle: 'ஒரு சிறிய தேர்வு! 📝',
    toNative: 'இந்த ஆங்கில வார்த்தையின் பொருள் என்ன?',
    toEnglish: 'இந்த வார்த்தையின் ஆங்கிலம் என்ன?',
    correct: 'சரி! 🎉',
    wrong: (ans) => `சரியான பதில்: "${ans}"`,
    nextQ: 'அடுத்த கேள்வி',
    seeResult: 'முடிவைப் பார்',
    resultTitle: 'தேர்வு முடிந்தது!',
    excellent: 'அருமை! நீங்கள் ஆங்கில சாம்பியன்! 🌟',
    good: 'நல்லது! இன்னும் முயற்சி செய்யுங்கள்! 👍',
    keepGoing: 'தொடர்ந்து முயற்சி செய்யுங்கள்! 💪',
    continueLearning: 'தொடர்ந்து படிக்கவும் →',
    endSession: 'இன்று இங்கே நிறுத்து',
    cardLabel: 'அட்டை',
    batchLabel: 'தொகுதி',
    listen: 'கேளுங்கள்',
    practice: 'பேசுங்கள்',
    speakNow: 'இப்போது பேசுங்கள்!',
    nextCard: 'அடுத்த அட்டை →',
    endBtn: 'நிறுத்து',
    youSaid: 'நீங்கள் சொன்னது:',
    perfect: 'சரியாக உச்சரித்தீர்கள்! 🎉',
    partial: (r) => `"${r}" — கிட்டத்தட்ட சரி!`,
    fail: (r) => `"${r}" — மெதுவாக பேசுங்கள்!`,
    quizComingIn: (n) => `${n} அட்டைகளுக்கு பிறகு தேர்வு!`,
    score: (s, t) => `${s} / ${t} சரி`,
  },
  es: {
    quizTitle: '¡Una pequeña prueba! 📝',
    toNative: '¿Qué significa esta palabra en inglés?',
    toEnglish: '¿Cómo se dice esto en inglés?',
    correct: '¡Correcto! 🎉',
    wrong: (ans) => `La respuesta correcta: "${ans}"`,
    nextQ: 'Siguiente pregunta',
    seeResult: 'Ver resultado',
    resultTitle: '¡Prueba completada!',
    excellent: '¡Excelente! ¡Eres un campeón de inglés! 🌟',
    good: '¡Bien! ¡Sigue practicando! 👍',
    keepGoing: '¡Ánimo! ¡Mejorarás cada día! 💪',
    continueLearning: 'Seguir aprendiendo →',
    endSession: 'Terminar por hoy',
    cardLabel: 'Tarjeta',
    batchLabel: 'Grupo',
    listen: 'Escuchar',
    practice: 'Hablar',
    speakNow: '¡Habla ahora!',
    nextCard: 'Siguiente →',
    endBtn: 'Terminar',
    youSaid: 'Dijiste:',
    perfect: '¡Perfecto! 🎉',
    partial: (r) => `"${r}" — ¡Casi! Inténtalo de nuevo.`,
    fail: (r) => `"${r}" — ¡Habla más despacio!`,
    quizComingIn: (n) => `¡Prueba en ${n} tarjetas!`,
    score: (s, t) => `${s} / ${t} correctas`,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function FlashcardDeck({ theme, nativeLang, englishLevel, categoryId, onBack, onQuizComplete }) {
  const staticCards = useMemo(() => LESSON_DATA[categoryId] || [], [categoryId]);
  const langId = nativeLang?.id || 'ml';
  const t = L[langId] || L.ml;

  // ── Infinite deck state ───────────────────────────────────────────────────
  const [quizSize, setQuizSize] = useState(() => {
    const saved = localStorage.getItem('APP_QUIZ_SIZE');
    return saved ? parseInt(saved, 10) : null;
  });
  const [allCards, setAllCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [aiError, setAiError] = useState(false);
  const [deckPointer, setDeckPointer] = useState(0);

  useEffect(() => {
    if (!quizSize) return;

    let isMounted = true;
    const fetchCards = async () => {
      if (isMounted) {
        setIsLoadingCards(true);
        setAiError(false);
      }

      try {
        const response = await fetch('/api/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nativeLang, englishLevel, categoryId, quizSize })
        });

        if (!response.ok) throw new Error("API Failed");
        const content = await response.json();
        
        if (isMounted) {
          if (content && content.cards && content.cards.length > 0) {
            setAllCards(content.cards);
            setDeck(shuffle([...content.cards]));
          } else {
            throw new Error("Invalid format");
          }
        }
      } catch (err) {
        console.error("AI Generation failed, falling back to static data", err);
        if (isMounted) {
          setAiError(true);
          setAllCards(staticCards);
          setDeck(shuffle([...staticCards]));
        }
      } finally {
        if (isMounted) {
          setIsLoadingCards(false);
        }
      }
    };

    fetchCards();
    return () => { isMounted = false; };
  }, [categoryId, englishLevel, nativeLang, staticCards, quizSize]);
  const [batchCards, setBatchCards] = useState([]); // accumulates up to quizSize
  const [totalShown, setTotalShown] = useState(0);

  // ── Mode: 'card' | 'quiz' | 'quizResult' ─────────────────────────────────
  const [mode, setMode] = useState('card');

  // ── Card practice state ───────────────────────────────────────────────────
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);

  // ── Quiz state ────────────────────────────────────────────────────────────
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const recognitionRef = useRef(null);
  const currentCard = deck[deckPointer];

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, []);

  // Auto-speak English when card changes
  useEffect(() => {
    if (mode === 'card' && currentCard) {
      const timer = setTimeout(() => speakEnglish(currentCard.english, 0.6), 400);
      return () => clearTimeout(timer);
    }
  }, [deckPointer, mode]);

  // Auto-speak quiz prompt when it's an English→Native question
  useEffect(() => {
    if (mode === 'quiz' && quizQuestions[currentQ]?.speakOnShow) {
      const timer = setTimeout(() => speakEnglish(quizQuestions[currentQ].prompt, 0.6), 300);
      return () => clearTimeout(timer);
    }
  }, [currentQ, mode]);

  // ── Advance to the next card (or trigger quiz after BATCH_SIZE) ───────────
  const goToNextCard = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    setIsListening(false);
    setFeedback(null);
    setTranscript('');

    const newBatch = [...batchCards, currentCard];

    // Advance deck pointer, reshuffle if exhausted
    let nextPtr = deckPointer + 1;
    let nextDeck = deck;
    if (nextPtr >= deck.length) {
      nextDeck = shuffle([...allCards]);
      nextPtr = 0;
      setDeck(nextDeck);
    }
    setDeckPointer(nextPtr);
    setTotalShown((prev) => prev + 1);

    if (newBatch.length >= quizSize) {
      // Launch quiz
      const qs = generateQuiz(newBatch, allCards, langId, quizSize);
      setQuizQuestions(qs);
      setBatchCards([]);
      setCurrentQ(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setMode('quiz');
    } else {
      setBatchCards(newBatch);
    }
  };

  // ── Speech recognition ────────────────────────────────────────────────────
  const handleSpeakPractice = () => {
    const SpeechRecognition = getSpeechRecognitionSystem();
    if (!SpeechRecognition) {
      setFeedback({ type: 'error', message: langId === 'ml'
        ? 'ഈ ബ്രൗസർ വോയ്സ് ഫീച്ചർ പിന്തുണയ്ക്കുന്നില്ല. Chrome ഉപയോഗിക്കൂ.'
        : 'Voice not supported. Please use Chrome or Edge browser.' });
      return;
    }
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.abort();
      setIsListening(false);
      return;
    }
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (e) { /* noop */ } }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setIsListening(true);
    setFeedback(null);
    setTranscript('');

    try {
      rec.start();
    } catch (startErr) {
      setIsListening(false);
      setFeedback({ type: 'error', message: langId === 'ml'
        ? 'മൈക്രോഫോൺ ആരംഭിക്കാൻ കഴിഞ്ഞില്ല. ദയവായി പേജ് റീലോഡ് ചെയ്യൂ.'
        : 'Could not start microphone. Please refresh the page.' });
      return;
    }

    rec.onresult = (e) => {
      if (!e.results?.length) return;
      const result = e.results[0][0].transcript;
      setTranscript(result);
      const sim = getSimilarity(currentCard.english, result);
      if (sim >= 90) {
        setFeedback({ type: 'perfect', message: t.perfect });
      } else if (sim >= 60) {
        setFeedback({ type: 'partial', message: t.partial(result) });
      } else {
        setFeedback({ type: 'fail', message: t.fail(result) });
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'aborted') return;
      setIsListening(false);

      const errorMessages = {
        'no-speech': langId === 'ml'
          ? 'ശബ്ദം കേൾക്കാൻ കഴിഞ്ഞില്ല. മൈക്രോഫോണിന് അടുത്ത് ഉറക്കെ ഉച്ചരിക്കൂ.'
          : 'No speech heard. Please speak louder and closer to the microphone.',
        'not-allowed': langId === 'ml'
          ? 'മൈക്രോഫോൺ ഉപയോഗിക്കാൻ അനുമതി നിഷേധിച്ചു. ബ്രൗസർ അഡ്രസ് ബാറിൽ ക്ലിക്ക് ചെയ്ത് മൈക്കിന് അനുമതി നൽകൂ.'
          : 'Microphone access denied. Click the 🔒 icon in your browser address bar and allow microphone.',
        'audio-capture': langId === 'ml'
          ? 'മൈക്രോഫോൺ കണ്ടെത്താൻ കഴിഞ്ഞില്ല. ഒരു മൈക്ക് ഉണ്ടെന്ന് ഉറപ്പ് വരുത്തൂ.'
          : 'No microphone found. Please connect a microphone and try again.',
        'network': langId === 'ml'
          ? 'ഇൻറർനെറ്റ് കണക്ഷൻ ആവശ്യമാണ്. Chrome-ൽ ഈ ഫീച്ചർ ഉപയോഗിക്കാൻ ഇൻറർനെറ്റ് ഉണ്ടാവണം.'
          : 'Internet connection needed. Chrome speech recognition requires an active internet connection.',
        'service-not-allowed': langId === 'ml'
          ? 'ഈ ഫീച്ചർ ഇവിടെ ഉപയോഗിക്കാൻ കഴിയില്ല. HTTPS ഉള്ള സൈറ്റിൽ ശ്രമിക്കൂ.'
          : 'Speech service not available here. Try accessing the site over HTTPS.',
      };

      setFeedback({
        type: 'error',
        message: errorMessages[e.error] || (langId === 'ml'
          ? `ഒരു പ്രശ്നം ഉണ്ടായി (${e.error}). ഒന്നുകൂടി ശ്രമിക്കൂ.`
          : `Speech error (${e.error}). Please try again.`)
      });
    };

    rec.onend = () => setIsListening(false);
  };

  // ── Quiz: select an answer ────────────────────────────────────────────────
  const handleSelectAnswer = (option) => {
    if (answered) return;
    setSelectedAnswer(option);
    setAnswered(true);
    if (option === quizQuestions[currentQ].answer) setQuizScore((s) => s + 1);
    // Auto-speak the correct English answer
    const correctEng = quizQuestions[currentQ].qType === 'toEnglish'
      ? quizQuestions[currentQ].answer
      : quizQuestions[currentQ].prompt;
    setTimeout(() => speakEnglish(correctEng, 0.6), 300);
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 >= quizQuestions.length) {
      setMode('quizResult');
      if (onQuizComplete) {
        onQuizComplete(quizScore);
      }
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const handleContinueAfterQuiz = () => {
    setMode('card');
    setFeedback(null);
    setTranscript('');
  };

  // ── Feedback helpers ──────────────────────────────────────────────────────
  const feedbackStyle = {
    perfect: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    partial: 'bg-amber-50 border-amber-300 text-amber-900',
    fail: 'bg-rose-50 border-rose-200 text-rose-900',
    error: 'bg-blue-50 border-blue-200 text-blue-900',
  };
  const feedbackIcon = {
    perfect: <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />,
    partial: <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />,
    fail: <XCircle className="w-8 h-8 text-rose-600 shrink-0" />,
    error: <AlertCircle className="w-8 h-8 text-blue-600 shrink-0" />,
  };

  if (!quizSize) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center gap-6">
        <h2 className={`${theme.fontSizeTitle} ${theme.textPrimary}`}>
          {langId === 'ml' ? 'ഇന്ന് എത്ര ചോദ്യങ്ങൾ പഠിക്കണം?' : 'How many questions do you want to practice?'}
        </h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
          {[5, 10, 15, 20].map((num) => (
            <button
              key={num}
              onClick={() => {
                localStorage.setItem('APP_QUIZ_SIZE', num.toString());
                setQuizSize(num);
              }}
              className={`${theme.btnPrimary} py-6 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer text-2xl font-black active:scale-95 transition`}
            >
              {num}
              <span className="text-sm font-semibold opacity-80">Questions</span>
            </button>
          ))}
        </div>
        <button
          onClick={onBack}
          className={`${theme.btnSecondaryLight} mt-6 px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer font-bold`}
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
      </div>
    );
  }

  const cardsUntilQuiz = quizSize - batchCards.length;

  if (isLoadingCards) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center gap-6">
         <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto shadow-sm"></div>
         <h2 className={`${theme.fontSizeTitle} ${theme.textPrimary}`}>
            {langId === 'ml' ? 'നിങ്ങൾക്കായി പാഠങ്ങൾ തയ്യാറാക്കുന്നു...' : 'Preparing personalized lessons for you...'}
         </h2>
         <p className={`${theme.fontSizeSubtitle} ${theme.textSecondary}`}>
            {langId === 'ml' ? 'AI ഉപയോഗിച്ച് ഫ്ലാഷ് കാർഡുകൾ നിർമ്മിക്കുന്നു ⚡' : 'Generating flashcards using AI ⚡'}
         </p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // QUIZ MODE
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === 'quiz') {
    const q = quizQuestions[currentQ];
    const isCorrect = selectedAnswer === q.answer;

    return (
      <div className="flex-1 flex flex-col py-2 px-1 gap-5">
        {/* Quiz header */}
        <div className="flex items-center justify-between">
          <span className={`${theme.fontSizeTitle} ${theme.textPrimary}`}>{t.quizTitle}</span>
          <span className={`${theme.fontSizeSubtitle} font-black ${theme.accentText}`}>
            {currentQ + 1} / {quizSize}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${((currentQ + 1) / quizSize) * 100}%` }}
          />
        </div>

        {/* Question card */}
        <div className={`${theme.cardBg} rounded-3xl p-6 md:p-8 flex flex-col items-center text-center gap-4 shadow-sm`}>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">
            {q.qType === 'toNative' ? t.toNative : t.toEnglish}
          </span>
          <div className={`${theme.fontSizeCardEnglish} ${theme.textPrimary} leading-tight break-words w-full px-2`}>
            {q.prompt}
          </div>
          {q.qType === 'toNative' && (
            <button
              onClick={() => speakEnglish(q.prompt, 0.6)}
              className={`flex items-center gap-2 ${theme.accentText} ${theme.accentBg} px-4 py-2 rounded-full font-bold text-sm active:scale-95 cursor-pointer`}
            >
              <Volume2 className="w-4 h-4" /> {t.listen}
            </button>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((option, i) => {
            let cls = `w-full text-left ${theme.fontSizeBody} font-bold px-4 sm:px-5 py-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer active:scale-[0.98] break-words hyphens-auto`;
            if (!answered) {
              cls += ` bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50`;
            } else if (option === q.answer) {
              cls += ` bg-emerald-50 border-emerald-500 text-emerald-900`;
            } else if (option === selectedAnswer) {
              cls += ` bg-rose-50 border-rose-400 text-rose-900`;
            } else {
              cls += ` bg-white border-slate-200 opacity-50`;
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelectAnswer(option)} disabled={answered}>
                <span className="flex items-center gap-3">
                  {answered && option === q.answer && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {answered && option === selectedAnswer && option !== q.answer && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback + Next */}
        {answered && (
          <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
            <p className={`font-extrabold text-lg ${isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
              {isCorrect ? t.correct : t.wrong(q.answer)}
            </p>
            <button
              onClick={handleNextQuestion}
              className={`${theme.btnPrimary} px-6 py-3 rounded-2xl flex items-center gap-2 shrink-0 cursor-pointer`}
            >
              {currentQ + 1 >= quizSize ? t.seeResult : t.nextQ}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // QUIZ RESULT MODE
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === 'quizResult') {
    const pct = (quizScore / quizSize) * 100;
    const resultMsg = pct >= 80 ? t.excellent : pct >= 60 ? t.good : t.keepGoing;
    const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-2 gap-6 text-center">
        <Trophy className="w-20 h-20 text-yellow-500 drop-shadow-lg" />

        <div>
          <h2 className={`${theme.fontSizeTitle} ${theme.textPrimary} mb-1`}>{t.resultTitle}</h2>
          <div className="flex justify-center gap-2 my-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-10 h-10 ${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <p className={`${theme.fontSizeCardEnglish} ${theme.accentText} font-black`}>
            {t.score(quizScore, quizSize)}
          </p>
          <p className={`${theme.fontSizeSubtitle} ${theme.textSecondary} mt-2 max-w-sm mx-auto`}>
            {resultMsg}
          </p>
        </div>

        {/* Circular progress ring */}
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#f43f5e'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
            className="transition-all duration-700"
          />
        </svg>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            onClick={handleContinueAfterQuiz}
            className={`${theme.btnPrimary} w-full py-5 rounded-2xl ${theme.fontSizeSubtitle} font-black cursor-pointer`}
          >
            {t.continueLearning}
          </button>
          <button
            onClick={onBack}
            className={`${theme.btnSecondaryLight} w-full py-4 rounded-2xl ${theme.fontSizeSubtitle} font-bold cursor-pointer`}
          >
            {t.endSession}
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CARD MODE (normal)
  // ════════════════════════════════════════════════════════════════════════════
  if (!currentCard) return null;

  return (
    <div className="flex-1 flex flex-col justify-between py-2 px-1">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 ${theme.textSecondary} font-extrabold text-xl py-2 cursor-pointer`}
        >
          <ArrowLeft className="w-6 h-6 shrink-0" /> Back
        </button>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => {
              localStorage.removeItem('APP_QUIZ_SIZE');
              setQuizSize(null);
            }}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded cursor-pointer transition"
          >
            ⚙️ Change ({quizSize})
          </button>
          <span className={`${theme.fontSizeBody} ${theme.textSecondary} font-black`}>
            #{totalShown + 1}
          </span>
          {/* Quiz countdown pill */}
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
            cardsUntilQuiz === 1
              ? 'bg-rose-100 text-rose-700 border border-rose-300'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            {t.quizComingIn(cardsUntilQuiz)}
          </span>
        </div>
      </div>

      {/* Batch progress dots */}
      <div className="flex justify-center flex-wrap gap-2 mb-4">
        {Array.from({ length: quizSize }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i < batchCards.length
                ? 'bg-emerald-500 w-6'
                : i === batchCards.length
                ? 'bg-indigo-400 w-4 animate-pulse'
                : 'bg-slate-200 w-4'
            }`}
          />
        ))}
      </div>

      {/* Main flashcard */}
      <div className={`${theme.cardBg} rounded-3xl p-5 sm:p-6 md:p-10 shadow-sm flex flex-col items-center justify-center text-center gap-5 min-h-[280px] w-full overflow-hidden`}>
        <div className="flex flex-col gap-1 w-full">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full w-max mx-auto mb-1">
            Your Language
          </span>
          <span className={`${theme.fontSizeCardMalayalam} ${theme.textPrimary} leading-relaxed px-2 break-words w-full`}>
            {currentCard.translations[langId] || currentCard.translations.ml}
          </span>
        </div>

        <hr className="w-24 border-t-2 border-slate-200" />

        <div className="w-full">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full w-max mx-auto mb-3 block">
            English
          </span>
          <h3 className={`${theme.fontSizeCardEnglish} ${theme.textPrimary} tracking-tight mb-3 break-words w-full px-2`}>
            {currentCard.english}
          </h3>
          <p className="text-sm md:text-base text-slate-500 italic max-w-lg mx-auto font-medium break-words w-full px-2">
            💡 {currentCard.context}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4 my-4">
        <button
          onClick={() => speakEnglish(currentCard.english, 0.6)}
          className={`${theme.btnPrimary} p-5 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md`}
        >
          <Volume2 className="w-9 h-9 text-white" />
          <span className={theme.fontSizeSubtitle}>{t.listen}</span>
        </button>

        <button
          onClick={handleSpeakPractice}
          className={`${isListening
            ? 'bg-amber-500 animate-pulse border-2 border-amber-600 text-white'
            : theme.btnSecondary
          } p-5 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md`}
        >
          {isListening ? <MicOff className="w-9 h-9 text-white" /> : <Mic className="w-9 h-9 text-white" />}
          <span className={theme.fontSizeSubtitle}>
            {isListening ? t.speakNow : t.practice}
          </span>
        </button>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">{t.youSaid}</p>
          <p className={`${theme.fontSizeBody} font-bold text-slate-800 italic`}>"{transcript}"</p>
        </div>
      )}

      {/* Pronunciation feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 mb-3 transition-all duration-300 ${feedbackStyle[feedback.type]}`}>
          {feedbackIcon[feedback.type]}
          <p className="text-lg font-bold leading-relaxed">{feedback.message}</p>
        </div>
      )}

      {/* Footer: Next card + End */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t-2 border-slate-100">
        <button
          onClick={onBack}
          className={`${theme.btnSecondaryLight} px-6 py-3 rounded-2xl font-black ${theme.fontSizeBody} cursor-pointer`}
        >
          {t.endBtn}
        </button>
        <button
          onClick={goToNextCard}
          className={`${theme.btnPrimary} px-8 py-4 rounded-2xl font-black ${theme.fontSizeSubtitle} flex items-center gap-2 cursor-pointer shadow-md`}
        >
          {batchCards.length + 1 === quizSize ? '📝 Quiz Time!' : t.nextCard}
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}