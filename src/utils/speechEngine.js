// Slow, clear TTS optimized for older adults
export const speakEnglish = (text, rate = 0.6) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Terminate ongoing audio queue
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate; // Custom cadence pace
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Your browser does not support text-to-speech rendering.");
  }
};

// Simple configuration utility mapping for global browser recognition engines
export const getSpeechRecognitionSystem = () => {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};