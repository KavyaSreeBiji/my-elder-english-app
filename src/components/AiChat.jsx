import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Send, Key, RefreshCw, AlertCircle, HelpCircle, Volume2 } from 'lucide-react';
import { speakEnglish } from '../utils/speechEngine';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default function AiChat({ theme, nativeLang, englishLevel, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const [errorMsg, setErrorMsg] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll to bottom on every new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initial welcome message
  useEffect(() => {
    const defaultWelcomes = {
      ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഇംഗ്ലീഷ് ട്യൂട്ടർ ആണ്. ഏത് ഇംഗ്ലീഷ് വാക്കും ചോദിക്കൂ. ഞാൻ മലയാളത്തിൽ അർത്ഥം, ഉച്ചാരണം, ഉദാഹരണം എല്ലാം തരാം! (ഉദാഹരണം: 'hospital', 'good morning', 'thank you')",
      hi: "नमस्ते! मैं आपका अंग्रेजी शिक्षक हूँ। कोई भी अंग्रेजी शब्द पूछें और मैं हिंदी में अर्थ, उच्चारण और उदाहरण दूँगा!",
      ta: "வணக்கம்! நான் உங்கள் ஆங்கில ஆசிரியர். எந்த ஆங்கில வார்த்தையும் கேளுங்கள் — பொருள், உச்சரிப்பு, உதாரணம் தமிழில் தருகிறேன்!",
      es: "¡Hola! Soy tu tutor de inglés. Pregunta cualquier palabra en inglés y te daré el significado, pronunciación y un ejemplo en español."
    };
    setMessages([{
      sender: 'ai',
      text: defaultWelcomes[nativeLang.id] || "Hello! I'm your English tutor. Ask me any word and I'll explain it clearly!"
    }]);
  }, [nativeLang]);



  // Extract English words/phrases for TTS pronunciation
  const extractEnglishToSpeak = (text) => {
    const lines = text.split('\n');
    const toSpeak = [];

    for (const line of lines) {
      const lower = line.toLowerCase();
      // Grab quoted usage example first
      if (lower.includes('usage') || lower.includes('example') || lower.includes('ഉദാഹരണം') || lower.includes('उदाहरण') || lower.includes('உதாரணம்') || lower.includes('uso')) {
        const quoted = line.match(/"([^"]+)"/);
        if (quoted) toSpeak.push(quoted[1]);
      }
    }

    // Fallback: extract any continuous English word sequences
    if (toSpeak.length === 0) {
      const englishChunks = text.match(/[a-zA-Z][a-zA-Z\s,?!'.\-]{3,}/g) || [];
      const skipWords = ['meaning', 'translation', 'pronunciation', 'usage', 'example', 'significado', 'uso', 'ammachi', 'companion', 'english', 'tutor'];
      const filtered = englishChunks
        .map(s => s.trim())
        .filter(s => s.length > 2 && !skipWords.some(sw => s.toLowerCase().includes(sw)));
      return filtered.join('. ');
    }

    return toSpeak.join('. ');
  };

  const handleSpeakText = (text) => {
    const cleanText = extractEnglishToSpeak(text);
    speakEnglish(cleanText || text, 0.6);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);
    setErrorMsg('');

    // Build conversation history (skip initial AI welcome)
    const conversationHistory = messages
      .filter((_, idx) => idx !== 0)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    conversationHistory.push({ role: 'user', content: userText });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          nativeLang,
          englishLevel
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'API Failed');
      }

      const data = await response.json();
      const aiReply =
        data?.message ||
        (nativeLang.id === 'ml'
          ? 'ക്ഷമിക്കണം, മറുപടി ലഭിച്ചില്ല. വീണ്ടും ശ്രമിക്കുക.'
          : 'Sorry, I could not generate a response. Please try again.');

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);

      // Auto-pronounce English parts of the reply
      setTimeout(() => handleSpeakText(aiReply), 300);
    } catch (e) {
      console.error('Groq API Error:', e);

      let alertMsg =
        nativeLang.id === 'ml'
          ? 'മറുപടി ലഭിച്ചില്ല. ദയവായി ഇൻറർനെറ്റ് കണക്ഷൻ അല്ലെങ്കിൽ API Key പരിശോധിക്കുക.'
          : 'Failed to get a response. Please check your internet or API Key.';

      if (e.message.toLowerCase().includes('invalid api key') || e.message.includes('401')) {
        alertMsg =
          nativeLang.id === 'ml'
            ? '❌ തെറ്റായ Groq API Key! "Change Key" ബട്ടൺ ക്ലിക്ക് ചെയ്ത് ശരിയായ Key നൽകുക.'
            : '❌ Invalid Groq API Key! Click "Change Key" and provide a valid key from console.groq.com/keys';
      } else if (e.message.includes('429') || e.message.toLowerCase().includes('rate limit') || e.message.toLowerCase().includes('quota')) {
        alertMsg =
          nativeLang.id === 'ml'
            ? '⚠️ ഒരു മിനിട്ട് ആയി ചോദ്യങ്ങൾ ധാരാളം ആയി. ഒന്ന് കാത്തിരിക്കൂ, പിന്നീട് ചോദിക്കൂ.'
            : '⚠️ Too many requests! Please wait a moment and try again.';
      }

      setErrorMsg(alertMsg);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // ── Setup screen when no API key ──────────────────────────────────────────
  if (!apiKey) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-6 px-2 text-center gap-4">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <h2 className={`${theme.fontSizeTitle} text-rose-600`}>
          API Key Missing
        </h2>
        <p className={`${theme.fontSizeSubtitle} ${theme.textSecondary} max-w-md`}>
          Please add your VITE_GROQ_API_KEY to the <b>.env.local</b> file to use the AI features.
        </p>
        <button
          onClick={onBack}
          className={`${theme.btnSecondaryLight} mt-4 px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer font-bold`}
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
      </div>
    );
  }

  // ── Main Chat UI ─────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col justify-between min-h-[500px] py-1 px-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 ${theme.textSecondary} font-extrabold text-xl py-2 cursor-pointer`}
        >
          <ArrowLeft className="w-6 h-6 shrink-0" /> Exit Chat
        </button>

        <span className="text-purple-700 font-extrabold text-sm bg-purple-50 px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-purple-100">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse shrink-0" /> Groq AI Active ⚡
        </span>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border-2 border-rose-200 text-rose-900 rounded-2xl flex items-start gap-3 mb-4 font-bold text-base shadow-sm">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-600 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Chat scroll area */}
      <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 overflow-y-auto mb-6 flex flex-col gap-4 max-h-[360px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[88%] p-5 rounded-2xl ${theme.fontSizeBody} font-bold shadow-xs leading-relaxed flex flex-col gap-2 ${
              msg.sender === 'user'
                ? `${theme.chatUserBg} self-end`
                : `${theme.chatAiBg} self-start`
            }`}
          >
            <div className="whitespace-pre-line">{msg.text}</div>

            {msg.sender === 'ai' && (
              <button
                onClick={() => handleSpeakText(msg.text)}
                className="self-start mt-2 flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition border border-purple-100 cursor-pointer active:scale-95"
                title="Listen to English Pronunciation"
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>Listen (കേൾക്കുക)</span>
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className={`${theme.chatAiBg} self-start p-5 rounded-2xl flex items-center gap-2`}>
            <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
            <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={chatBottomRef} />
      </div>

      {/* Input row */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
          placeholder={
            nativeLang.id === 'ml'
              ? 'ഒരു ഇംഗ്ലീഷ് വാക്ക് ചോദിക്കൂ... (e.g. hospital)'
              : 'Ask any English word... (e.g. hospital)'
          }
          className={`flex-1 ${theme.input} rounded-2xl px-5 py-4 ${theme.fontSizeBody} outline-none transition-all duration-200`}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className={`${theme.btnSecondary} px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading
            ? <RefreshCw className="w-6 h-6 text-white animate-spin" />
            : <Send className="w-6 h-6 text-white" />}
          <span className="hidden sm:inline font-bold">Ask</span>
        </button>
      </div>
    </div>
  );
}