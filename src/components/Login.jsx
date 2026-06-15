import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';

const TRANSLATIONS = {
  ml: {
    titleLogin: 'ലോഗിൻ ചെയ്യുക',
    titleSignup: 'പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    subtitleLogin: 'നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് പ്രവേശിക്കാൻ ഇമെയിലും പാസ്‌വേഡും നൽകുക.',
    subtitleSignup: 'നിങ്ങളുടെ പുരോഗതി സുരക്ഷിതമായി സൂക്ഷിക്കാൻ ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക.',
    placeholderEmail: 'നിങ്ങളുടെ ഇമെയിൽ നൽകുക...',
    placeholderPassword: 'നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക...',
    buttonLogin: 'ലോഗിൻ ചെയ്യുക',
    buttonSignup: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    toggleToSignup: 'അക്കൗണ്ട് ഇല്ലേ? ഇവിടെ ക്ലിക്ക് ചെയ്യുക',
    toggleToLogin: 'അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ ചെയ്യുക',
    loading: 'ലോഡിംഗ്...',
    errorInvalidEmail: 'തെറ്റായ ഇമെയിൽ വിലാസം',
    errorWeakPassword: 'പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം',
    errorUserNotFound: 'അക്കൗണ്ട് കണ്ടെത്താനായില്ല',
    errorWrongPassword: 'തെറ്റായ പാസ്‌വേഡ് അഥവാ അക്കൗണ്ട് ഇല്ല',
    errorEmailInUse: 'ഈ ഇമെയിൽ നിലവിലുണ്ട്',
    errorGeneral: 'ഒരു പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.'
  },
  hi: {
    titleLogin: 'लॉग इन करें',
    titleSignup: 'नया खाता बनाएँ',
    subtitleLogin: 'अपने खाते में प्रवेश करने के लिए ईमेल और पासवर्ड दर्ज करें।',
    subtitleSignup: 'अपनी प्रगति को सुरक्षित रखने के लिए एक खाता बनाएँ।',
    placeholderEmail: 'अपना ईमेल दर्ज करें...',
    placeholderPassword: 'अपना पासवर्ड दर्ज करें...',
    buttonLogin: 'लॉग इन करें',
    buttonSignup: 'खाता बनाएँ',
    toggleToSignup: 'खाता नहीं है? यहाँ क्लिक करें',
    toggleToLogin: 'खाता है? लॉग इन करें',
    loading: 'लोड हो रहा है...',
    errorInvalidEmail: 'अमान्य ईमेल पता',
    errorWeakPassword: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
    errorUserNotFound: 'खाता नहीं मिला',
    errorWrongPassword: 'गलत पासवर्ड या खाता नहीं मिला',
    errorEmailInUse: 'यह ईमेल पहले से उपयोग में है',
    errorGeneral: 'एक त्रुटि हुई। कृपया पुन: प्रयास करें।'
  },
  ta: {
    titleLogin: 'உள்நுழையவும்',
    titleSignup: 'புதிய கணக்கை உருவாக்கவும்',
    subtitleLogin: 'உங்கள் கணக்கில் நுழைய மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.',
    subtitleSignup: 'உங்கள் முன்னேற்றத்தை பாதுகாப்பாக வைக்க ஒரு கணக்கை உருவாக்கவும்.',
    placeholderEmail: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்...',
    placeholderPassword: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்...',
    buttonLogin: 'உள்நுழையவும்',
    buttonSignup: 'கணக்கை உருவாக்கவும்',
    toggleToSignup: 'கணக்கு இல்லையா? இங்கே கிளிக் செய்யவும்',
    toggleToLogin: 'கணக்கு உள்ளதா? உள்நுழையவும்',
    loading: 'ஏற்றுகிறது...',
    errorInvalidEmail: 'தவறான மின்னஞ்சல்',
    errorWeakPassword: 'கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துகள் இருக்க வேண்டும்',
    errorUserNotFound: 'கணக்கு கிடைக்கவில்லை',
    errorWrongPassword: 'தவறான கடவுச்சொல் அல்லது கணக்கு இல்லை',
    errorEmailInUse: 'இந்த மின்னஞ்சல் பயன்பாட்டில் உள்ளது',
    errorGeneral: 'ஒரு பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.'
  },
  es: {
    titleLogin: 'Iniciar Sesión',
    titleSignup: 'Crear Cuenta Nueva',
    subtitleLogin: 'Ingrese su correo electrónico y contraseña para acceder.',
    subtitleSignup: 'Cree una cuenta para guardar su progreso de forma segura.',
    placeholderEmail: 'Ingrese su correo electrónico...',
    placeholderPassword: 'Ingrese su contraseña...',
    buttonLogin: 'Iniciar Sesión',
    buttonSignup: 'Crear Cuenta',
    toggleToSignup: '¿No tiene cuenta? Haga clic aquí',
    toggleToLogin: '¿Ya tiene cuenta? Inicie sesión',
    loading: 'Cargando...',
    errorInvalidEmail: 'Correo electrónico inválido',
    errorWeakPassword: 'La contraseña debe tener al menos 6 caracteres',
    errorUserNotFound: 'Cuenta no encontrada',
    errorWrongPassword: 'Contraseña incorrecta o cuenta no encontrada',
    errorEmailInUse: 'Este correo ya está en uso',
    errorGeneral: 'Ocurrió un error. Inténtelo de nuevo.'
  },
  en: {
    titleLogin: 'Log In',
    titleSignup: 'Create New Account',
    subtitleLogin: 'Enter your email and password to access your account.',
    subtitleSignup: 'Create an account to keep your progress safe.',
    placeholderEmail: 'Enter your email...',
    placeholderPassword: 'Enter your password...',
    buttonLogin: 'Log In',
    buttonSignup: 'Create Account',
    toggleToSignup: 'No account? Click here to create one',
    toggleToLogin: 'Already have an account? Log in',
    loading: 'Loading...',
    errorInvalidEmail: 'Invalid email address',
    errorWeakPassword: 'Password must be at least 6 characters',
    errorUserNotFound: 'Account not found',
    errorWrongPassword: 'Incorrect password or account not found',
    errorEmailInUse: 'Email is already in use',
    errorGeneral: 'An error occurred. Please try again.'
  }
};

export default function Login({ onAuth, theme, nativeLang, loginError }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const langCode = nativeLang?.id || 'en';
  const t = TRANSLATIONS[langCode] || TRANSLATIONS['en'];

  // Map Firebase error codes to friendly translations
  const getFriendlyError = (errorCode) => {
    if (!errorCode) return null;
    if (errorCode.includes('invalid-email')) return t.errorInvalidEmail;
    if (errorCode.includes('weak-password')) return t.errorWeakPassword;
    if (errorCode.includes('user-not-found') || errorCode.includes('invalid-credential')) return t.errorWrongPassword;
    if (errorCode.includes('wrong-password')) return t.errorWrongPassword;
    if (errorCode.includes('email-already-in-use')) return t.errorEmailInUse;
    return t.errorGeneral;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      setIsLoading(true);
      await onAuth(email.trim(), password.trim(), isSignUp);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 md:p-8 w-full max-w-4xl mx-auto">
      <div className={`p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] ${theme.cardBg} max-w-lg w-full shadow-xl transition-all duration-300`}>
        <div className={`mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full ${theme.accentBg} flex items-center justify-center mb-8 md:mb-10 shadow-inner`}>
          {isSignUp ? (
            <UserPlus className={`w-12 h-12 md:w-14 md:h-14 ${theme.accentText}`} />
          ) : (
            <LogIn className={`w-12 h-12 md:w-14 md:h-14 ${theme.accentText}`} />
          )}
        </div>
        
        <h2 className={`${theme.fontSizeTitle} mb-4 md:mb-6 text-center ${theme.textPrimary}`}>
          {isSignUp ? t.titleSignup : t.titleLogin}
        </h2>
        <p className={`${theme.fontSizeBody} mb-8 md:mb-10 text-center ${theme.textSecondary} max-w-sm mx-auto leading-relaxed`}>
          {isSignUp ? t.subtitleSignup : t.subtitleLogin}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholderEmail}
            className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl ${theme.input} ${theme.fontSizeBody} shadow-sm focus:shadow-md transition-all outline-none`}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.placeholderPassword}
            className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl ${theme.input} ${theme.fontSizeBody} shadow-sm focus:shadow-md transition-all outline-none`}
            required
            disabled={isLoading}
          />
          {loginError && (
            <div className="text-red-500 font-medium text-center bg-red-50 p-3 rounded-xl border border-red-200">
              {getFriendlyError(loginError)}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 ${theme.btnPrimary} ${theme.fontSizeBtn} flex justify-center items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            {isLoading ? t.loading : (isSignUp ? t.buttonSignup : t.buttonLogin)}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); }}
            className={`text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4 transition-colors ${theme.fontSizeBody}`}
            disabled={isLoading}
          >
            {isSignUp ? t.toggleToLogin : t.toggleToSignup}
          </button>
        </div>
      </div>
    </div>
  );
}
