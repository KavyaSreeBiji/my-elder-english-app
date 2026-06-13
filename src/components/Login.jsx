import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

const TRANSLATIONS = {
  ml: {
    title: 'തിരികെ സ്വാഗതം!',
    subtitle: 'നിങ്ങളുടെ പുരോഗതി ലോഡ് ചെയ്യാൻ പേരും പിൻ നമ്പറും നൽകുക.',
    placeholderName: 'നിങ്ങളുടെ പേര് നൽകുക...',
    placeholderPin: 'നിങ്ങളുടെ പിൻ നൽകുക...',
    button: 'തുടങ്ങുക / തുടരുക',
    loading: 'ലോഡിംഗ്...',
    errorIncorrectPin: 'തെറ്റായ പിൻ'
  },
  hi: {
    title: 'वापसी पर स्वागत है!',
    subtitle: 'अपनी प्रगति लोड करने के लिए कृपया अपना नाम और पिन दर्ज करें।',
    placeholderName: 'अपना नाम दर्ज करें...',
    placeholderPin: 'अपना पिन दर्ज करें...',
    button: 'शुरू करें / जारी रखें',
    loading: 'लोड हो रहा है...',
    errorIncorrectPin: 'गलत पिन'
  },
  ta: {
    title: 'மீண்டும் நல்வரவு!',
    subtitle: 'உங்கள் முன்னேற்றத்தை ஏற்ற உங்கள் பெயர் மற்றும் பின்னை உள்ளிடவும்.',
    placeholderName: 'உங்கள் பெயரை உள்ளிடவும்...',
    placeholderPin: 'உங்கள் பின்னை உள்ளிடவும்...',
    button: 'தொடங்கு / தொடரவும்',
    loading: 'ஏற்றுகிறது...',
    errorIncorrectPin: 'தவறான பின்'
  },
  es: {
    title: '¡Bienvenido de nuevo!',
    subtitle: 'Por favor, ingrese su nombre y PIN para cargar su progreso.',
    placeholderName: 'Ingrese su nombre...',
    placeholderPin: 'Ingrese su PIN...',
    button: 'Empezar / Continuar',
    loading: 'Cargando...',
    errorIncorrectPin: 'PIN incorrecto'
  },
  en: {
    title: 'Welcome Back!',
    subtitle: 'Please enter your name and PIN to load your progress.',
    placeholderName: 'Enter your name...',
    placeholderPin: 'Enter your PIN...',
    button: 'Start / Resume',
    loading: 'Loading...',
    errorIncorrectPin: 'Incorrect PIN'
  }
};

export default function Login({ onLogin, theme, nativeLang, loginError }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const langCode = nativeLang?.id || 'en';
  const t = TRANSLATIONS[langCode] || TRANSLATIONS['en'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() && pin.trim()) {
      setIsLoading(true);
      await onLogin(name.trim(), pin.trim());
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
            type="password"
            inputMode="numeric"
            maxLength={6}
            pattern="\d*"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder={t.placeholderPin}
            className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl ${theme.input} ${theme.fontSizeBody} shadow-sm focus:shadow-md transition-all outline-none`}
            required
            disabled={isLoading}
          />
          {loginError && (
            <div className="text-red-500 font-medium text-center bg-red-50 p-3 rounded-xl border border-red-200">
              {loginError === 'INCORRECT_PIN' ? t.errorIncorrectPin : loginError}
            </div>
          )}
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
