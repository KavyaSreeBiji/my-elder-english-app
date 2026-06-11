import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

const TRANSLATIONS = {
  ml: {
    title: 'തിരികെ സ്വാഗതം!',
    subtitle: 'നിങ്ങളുടെ പുരോഗതി ലോഡ് ചെയ്യാൻ പേരും ഫോൺ നമ്പറും നൽകുക.',
    placeholderName: 'നിങ്ങളുടെ പേര് നൽകുക...',
    placeholderPhone: 'നിങ്ങളുടെ ഫോൺ നമ്പർ നൽകുക...',
    button: 'തുടങ്ങുക / തുടരുക',
    loading: 'ലോഡിംഗ്...'
  },
  hi: {
    title: 'वापसी पर स्वागत है!',
    subtitle: 'अपनी प्रगति लोड करने के लिए कृपया अपना नाम और फोन नंबर दर्ज करें।',
    placeholderName: 'अपना नाम दर्ज करें...',
    placeholderPhone: 'अपना फोन नंबर दर्ज करें...',
    button: 'शुरू करें / जारी रखें',
    loading: 'लोड हो रहा है...'
  },
  ta: {
    title: 'மீண்டும் நல்வரவு!',
    subtitle: 'உங்கள் முன்னேற்றத்தை ஏற்ற உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.',
    placeholderName: 'உங்கள் பெயரை உள்ளிடவும்...',
    placeholderPhone: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்...',
    button: 'தொடங்கு / தொடரவும்',
    loading: 'ஏற்றுகிறது...'
  },
  es: {
    title: '¡Bienvenido de nuevo!',
    subtitle: 'Por favor, ingrese su nombre y número de teléfono para cargar su progreso.',
    placeholderName: 'Ingrese su nombre...',
    placeholderPhone: 'Ingrese su número de teléfono...',
    button: 'Empezar / Continuar',
    loading: 'Cargando...'
  },
  en: {
    title: 'Welcome Back!',
    subtitle: 'Please enter your name and phone number to load your progress.',
    placeholderName: 'Enter your name...',
    placeholderPhone: 'Enter your phone number...',
    button: 'Start / Resume',
    loading: 'Loading...'
  }
};

export default function Login({ onLogin, theme, nativeLang }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const langCode = nativeLang?.id || 'en';
  const t = TRANSLATIONS[langCode] || TRANSLATIONS['en'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      setIsLoading(true);
      await onLogin(name.trim(), phone.trim());
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto">
      <div className={`p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] ${theme.cardBg} max-w-lg w-full shadow-xl transition-all duration-300`}>
        <div className={`mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full ${theme.accentBg} flex items-center justify-center mb-8 md:mb-10 shadow-inner`}>
          <LogIn className={`w-12 h-12 md:w-14 md:h-14 ${theme.accentText}`} />
        </div>
        
        <h2 className={`${theme.fontSizeTitle} mb-4 md:mb-6 text-center ${theme.textPrimary}`}>{t.title}</h2>
        <p className={`${theme.fontSizeBody} mb-8 md:mb-10 text-center ${theme.textSecondary} max-w-sm mx-auto leading-relaxed`}>
          {t.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.placeholderName}
            className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl ${theme.input} ${theme.fontSizeBody} shadow-sm focus:shadow-md transition-all outline-none`}
            required
            disabled={isLoading}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.placeholderPhone}
            className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl ${theme.input} ${theme.fontSizeBody} shadow-sm focus:shadow-md transition-all outline-none`}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 ${theme.btnPrimary} ${theme.fontSizeBtn} flex justify-center items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            {isLoading ? t.loading : t.button}
          </button>
        </form>
      </div>
    </div>
  );
}
