import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Send, Key, RefreshCw, AlertCircle, HelpCircle, Volume2 } from 'lucide-react';
import { speakEnglish } from '../utils/speechEngine';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default function AiChat({ theme, nativeLang, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(
    () => import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('GROQ_API_KEY') || ''
  );
  const [tempKey, setTempKey] = useState('');
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

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!tempKey.trim()) {
      setErrorMsg(nativeLang.id === 'ml' ? 'ദയവായി ഒരു Groq API Key നൽകുക.' : 'Please enter a valid Groq API Key.');
      return;
    }
    const cleanKey = tempKey.trim();
    localStorage.setItem('GROQ_API_KEY', cleanKey);
    setApiKey(cleanKey);
    setErrorMsg('');
  };

  const handleClearKey = () => {
    localStorage.removeItem('GROQ_API_KEY');
    setApiKey('');
    setTempKey('');
    setErrorMsg('');
  };

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

    // System prompt tuned for elder translation + pronunciation
    const systemPrompt = `You are "English Companion Tutor", a warm, patient, and encouraging English language teacher for older adults.
The student's native language is ${nativeLang.name} (code: ${nativeLang.id}).

When the student asks about any English word, phrase, or a word in ${nativeLang.name}:

ALWAYS respond in this exact structure (use bold headings):

**Translation / Meaning:**
[Simple, clear translation in ${nativeLang.name}]

**English Pronunciation (ഉച്ചാരണം):**
[Write the English word's pronunciation phonetically using ${nativeLang.name} script characters. E.g. for Malayalam: "ഹോസ്പിറ്റൽ" for "Hospital", "ഗുഡ് മോണിങ്" for "Good morning"]

**Usage Example:**
English: "[A simple everyday sentence in English using the word, in double quotes]"
${nativeLang.name}: [Translation of that sentence in ${nativeLang.name}]

Rules:
- Be warm, encouraging, and brief. Maximum 5 lines total.
- If the student types a ${nativeLang.name} word, find its English equivalent and explain it the same way.
- Only help with English learning, vocabulary, translation, and pronunciation. Politely redirect off-topic queries.`;

    // Build conversation history (skip initial AI welcome, Groq starts with system + user)
    const conversationHistory = messages
      .filter((_, idx) => idx !== 0)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    conversationHistory.push({ role: 'user', content: userText });

    try {
      const model = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory
          ],
          temperature: 0.6,
          max_tokens: 300,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error?.message ||
          `HTTP ${response.status}: ${errorData?.error?.type || 'Unknown error'}`
        );
      }

      const data = await response.json();
      const aiReply =
        data?.choices?.[0]?.message?.content ||
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
      <div className="flex-1 flex flex-col justify-center items-center py-6 px-2">
        <div className="text-center mb-6">
          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-full w-max mx-auto mb-4">
            <Key className="w-10 h-10 text-purple-600 animate-bounce" />
          </div>
          <h2 className={`${theme.fontSizeTitle} ${theme.textPrimary}`}>
            Activate AI Tutor (Groq)
          </h2>
          <p className={`${theme.fontSizeSubtitle} ${theme.textSecondary} mt-2 max-w-md mx-auto`}>
            {nativeLang.id === 'ml'
              ? 'ഫ്രീ Groq API Key ഉപയോഗിച്ച് AI Tutor ആക്ടിവേറ്റ് ചെയ്യൂ.'
              : 'Enter a free Groq API Key to activate your live AI English tutor.'}
          </p>
        </div>

        <form onSubmit={handleSaveKey} className="w-full max-w-md bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
          <div>
            <label className="block text-sm font-extrabold text-slate-500 mb-2 uppercase tracking-wider">
              {nativeLang.id === 'ml' ? 'Groq API Key നൽകുക:' : 'Enter Groq API Key:'}
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="gsk_..."
              className={`w-full ${theme.input} rounded-xl px-4 py-3 text-lg font-mono outline-none`}
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className={`w-full ${theme.btnPrimary} p-4 rounded-xl text-lg font-black transition-all cursor-pointer`}
          >
            {nativeLang.id === 'ml' ? 'സേവ് ചെയ്ത് തുടങ്ങുക' : 'Save & Start Chatting'}
          </button>

          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 text-center font-bold text-sm flex items-center justify-center gap-1.5 mt-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>
              {nativeLang.id === 'ml'
                ? 'സൗജന്യ Groq Key ഉണ്ടാക്കൂ (30 സെക്കൻഡ്)'
                : 'Get a free Groq Key in 30 seconds →'}
            </span>
          </a>
        </form>
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