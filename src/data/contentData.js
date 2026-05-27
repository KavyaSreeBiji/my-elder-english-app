export const LANGUAGES = [
  { id: 'ml', name: 'മലയാളം (Malayalam)', flag: '🌴' },
  { id: 'hi', name: 'हिन्दी (Hindi)', flag: '🌸' },
  { id: 'ta', name: 'தமிழ் (Tamil)', flag: '🪔' },
  { id: 'es', name: 'Español (Spanish)', flag: '💃' }
];

export const CATEGORIES = [
  { id: 'greetings', label: { ml: 'അഭിവാദ്യങ്ങൾ', hi: 'अभिवादन', ta: 'வாழ்த்துக்கள்', es: 'Saludos', en: 'Greetings' }, icon: '👋' },
  { id: 'health', label: { ml: 'ആരോഗ്യം / മരുന്ന്', hi: 'स्वास्थ्य और चिकित्सा', ta: 'மருத்துவம்', es: 'Salud', en: 'Health & Medical' }, icon: '🏥' },
  { id: 'shopping', label: { ml: 'കടയിൽ പോകൽ', hi: 'बाज़ार / खरीदारी', ta: 'கடைவீதி', es: 'Compras', en: 'Shopping' }, icon: '🛒' },
  { id: 'family', label: { ml: 'കുടുംബം', hi: 'परिवार', ta: 'குடும்பம்', es: 'Familia', en: 'Family' }, icon: '👨‍👩‍👧‍👦' }
];

export const LESSON_DATA = {
  greetings: [
    { id: 'g01', english: 'Good morning', translations: { ml: 'സുപ്രഭാതം', hi: 'शुभ प्रभात', ta: 'காலை வணக்கம்', es: 'Buenos días' }, context: 'Say this when you meet someone early in the morning.' },
    { id: 'g02', english: 'Good afternoon', translations: { ml: 'ശുഭ ഉച്ച', hi: 'शुभ दोपहर', ta: 'மதிய வணக்கம்', es: 'Buenas tardes' }, context: 'Greet someone during midday or afternoon hours.' },
    { id: 'g03', english: 'Good evening', translations: { ml: 'ശുഭ സന്ധ്യ', hi: 'शुभ शाम', ta: 'மாலை வணக்கம்', es: 'Buenas tardes' }, context: 'A warm greeting for the evening time.' },
    { id: 'g04', english: 'Good night', translations: { ml: 'ശുഭ രാത്രി', hi: 'शुभ रात्रि', ta: 'இனிய இரவு', es: 'Buenas noches' }, context: 'Say this when going to sleep or leaving at night.' },
    { id: 'g05', english: 'Hello', translations: { ml: 'നമസ്കാരം', hi: 'नमस्ते', ta: 'வணக்கம்', es: 'Hola' }, context: 'A simple friendly greeting for any time of day.' },
    { id: 'g06', english: 'How are you?', translations: { ml: 'സുഖമാണോ?', hi: 'आप कैसे हैं?', ta: 'எப்படி இருக்கிறீர்கள்?', es: '¿Cómo estás?' }, context: 'A polite way to ask about someone\'s well-being.' },
    { id: 'g07', english: 'I am fine, thank you', translations: { ml: 'ഞാൻ സുഖമാണ്, നന്ദി', hi: 'मैं ठीक हूँ, धन्यवाद', ta: 'நான் நலமாக இருக்கிறேன், நன்றி', es: 'Estoy bien, gracias' }, context: 'Reply when someone asks how you are.' },
    { id: 'g08', english: 'Nice to meet you', translations: { ml: 'നിങ്ങളെ കണ്ടതിൽ സന്തോഷം', hi: 'आपसे मिलकर ख़ुशी हुई', ta: 'உங்களை சந்தித்ததில் மகிழ்ச்சி', es: 'Mucho gusto' }, context: 'Say this when you are introduced to someone new.' },
    { id: 'g09', english: 'Goodbye', translations: { ml: 'വിട', hi: 'अलविदा', ta: 'விடை', es: 'Adiós' }, context: 'A farewell when you are leaving.' },
    { id: 'g10', english: 'See you later', translations: { ml: 'പിന്നെ കാണാം', hi: 'फिर मिलेंगे', ta: 'பிறகு பார்க்கலாம்', es: 'Hasta luego' }, context: 'A casual goodbye when you will meet again soon.' },
    { id: 'g11', english: 'Thank you', translations: { ml: 'നന്ദി', hi: 'धन्यवाद', ta: 'நன்றி', es: 'Gracias' }, context: 'Express gratitude for something done for you.' },
    { id: 'g12', english: 'Thank you very much', translations: { ml: 'വളരെ നന്ദി', hi: 'बहुत-बहुत धन्यवाद', ta: 'மிக்க நன்றி', es: 'Muchas gracias' }, context: 'Show deep gratitude and appreciation.' },
    { id: 'g13', english: 'You are welcome', translations: { ml: 'സ്വാഗതം', hi: 'कोई बात नहीं', ta: 'வரவேற்கிறோம்', es: 'De nada' }, context: 'The polite reply when someone thanks you.' },
    { id: 'g14', english: 'Please', translations: { ml: 'ദയവായി', hi: 'कृपया', ta: 'தயவுசெய்து', es: 'Por favor' }, context: 'Always say this to make a request politely.' },
    { id: 'g15', english: 'Excuse me', translations: { ml: 'ക്ഷമിക്കണം', hi: 'माफ करें', ta: 'மன்னிக்கவும்', es: 'Perdón' }, context: 'Use this to get someone\'s attention or to apologise.' },
    { id: 'g16', english: 'I am sorry', translations: { ml: 'എനിക്ക് ക്ഷമ ചോദിക്കണം', hi: 'मुझे माफ करें', ta: 'மன்னிக்கவும்', es: 'Lo siento' }, context: 'A sincere apology when you have made a mistake.' },
    { id: 'g17', english: 'Have a nice day', translations: { ml: 'നല്ലൊരു ദിവസം ആശംസിക്കുന്നു', hi: 'आपका दिन शुभ हो', ta: 'நல்ல நாளாக கழியட்டும்', es: 'Que tenga un buen día' }, context: 'A warm wish as you part ways during the day.' },
    { id: 'g18', english: 'Take care', translations: { ml: 'ശ്രദ്ധിച്ചു കൊള്ളൂ', hi: 'अपना ख्याल रखें', ta: 'கவனமாக இருங்கள்', es: 'Cuídese' }, context: 'Show you care about someone\'s health when saying goodbye.' },
  ],

  health: [
    { id: 'h01', english: 'I need a doctor', translations: { ml: 'എനിക്ക് ഒരു ഡോക്ടറെ കാണണം', hi: 'मुझे डॉक्टर की ज़रूरत है', ta: 'எனக்கு ஒரு மருத்துவர் தேவை', es: 'Necesito un médico' }, context: 'Say this in an emergency or when feeling unwell.' },
    { id: 'h02', english: 'Where is the pharmacy?', translations: { ml: 'മരുന്ന് കട എവിടെ?', hi: 'दवाइयों की दुकान कहाँ है?', ta: 'மருந்தகம் எங்கே?', es: '¿Dónde está la farmacia?' }, context: 'Ask this when you need to buy medicines.' },
    { id: 'h03', english: 'I have a headache', translations: { ml: 'എനിക്ക് തലവേദനയുണ്ട്', hi: 'मेरे सिर में दर्द है', ta: 'எனக்கு தலைவலி இருக்கிறது', es: 'Tengo dolor de cabeza' }, context: 'Describe a headache to a doctor or family member.' },
    { id: 'h04', english: 'I feel dizzy', translations: { ml: 'എനിക്ക് തലകറക്കം തോന്നുന്നു', hi: 'मुझे चक्कर आ रहा है', ta: 'எனக்கு தலைசுற்றல் உணர்கிறேன்', es: 'Me siento mareado' }, context: 'Use when you feel unsteady or the room is spinning.' },
    { id: 'h05', english: 'Please call an ambulance', translations: { ml: 'ദയവായി ആംബുലൻസ് വിളിക്കൂ', hi: 'कृपया एम्बुलेंस बुलाएं', ta: 'தயவுசெய்து ஆம்புலன்ஸ் அழையுங்கள்', es: 'Por favor llame a una ambulancia' }, context: 'Use in an emergency when you need immediate medical help.' },
    { id: 'h06', english: 'I need my medicine', translations: { ml: 'എനിക്ക് എന്റെ മരുന്ന് വേണം', hi: 'मुझे मेरी दवाई चाहिए', ta: 'எனக்கு என் மருந்து வேண்டும்', es: 'Necesito mi medicamento' }, context: 'Ask for your medication from family or a nurse.' },
    { id: 'h07', english: 'I have a fever', translations: { ml: 'എനിക്ക് പനിയുണ്ട്', hi: 'मुझे बुखार है', ta: 'எனக்கு காய்ச்சல் இருக்கிறது', es: 'Tengo fiebre' }, context: 'Tell a doctor or nurse when your temperature is high.' },
    { id: 'h08', english: 'My blood pressure is high', translations: { ml: 'എന്റെ ബ്ലഡ് പ്രഷർ കൂടുതലാണ്', hi: 'मेरा रक्तचाप बढ़ा हुआ है', ta: 'என் இரத்த அழுத்தம் அதிகம்', es: 'Mi presión arterial es alta' }, context: 'Important phrase to share with your doctor.' },
    { id: 'h09', english: 'Where is the hospital?', translations: { ml: 'ആശുപത്രി എവിടെ?', hi: 'अस्पताल कहाँ है?', ta: 'மருத்துவமனை எங்கே?', es: '¿Dónde está el hospital?' }, context: 'Ask someone for directions to the nearest hospital.' },
    { id: 'h10', english: 'I am allergic', translations: { ml: 'എനിക്ക് അലർജി ഉണ്ട്', hi: 'मुझे एलर्जी है', ta: 'எனக்கு ஒவ்வாமை இருக்கிறது', es: 'Soy alérgico' }, context: 'Alert the doctor or pharmacist about your allergy.' },
    { id: 'h11', english: 'Help me, please', translations: { ml: 'ദയവായി എന്നെ സഹായിക്കൂ', hi: 'कृपया मेरी मदद करें', ta: 'தயவுசெய்து என்னை உதவுங்கள்', es: 'Ayúdame, por favor' }, context: 'Call for assistance in an emergency situation.' },
    { id: 'h12', english: 'I feel pain here', translations: { ml: 'ഇവിടെ വേദനയുണ്ട്', hi: 'यहाँ दर्द हो रहा है', ta: 'இங்கே வலிக்கிறது', es: 'Me duele aquí' }, context: 'Point to the body area and say this to the doctor.' },
    { id: 'h13', english: 'I cannot sleep well', translations: { ml: 'എനിക്ക് ശരിയായി ഉറക്കം ലഭിക്കുന്നില്ല', hi: 'मुझे ठीक से नींद नहीं आती', ta: 'எனக்கு தூக்கம் சரியாக வரவில்லை', es: 'No puedo dormir bien' }, context: 'Describe sleep problems to your doctor.' },
    { id: 'h14', english: 'I feel better now', translations: { ml: 'ഇപ്പോൾ എനിക്ക് ആശ്വാസം തോന്നുന്നു', hi: 'मुझे अब बेहतर लग रहा है', ta: 'இப்போது எனக்கு சுகமாக இருக்கிறது', es: 'Me siento mejor ahora' }, context: 'Tell the doctor or family when you are recovering.' },
  ],

  shopping: [
    { id: 's01', english: 'How much is this?', translations: { ml: 'ഇതിന് എത്ര വിലയുണ്ട്?', hi: 'यह कितने का है?', ta: 'இதன் விலை என்ன?', es: '¿Cuánto cuesta esto?' }, context: 'Ask this to know the price of an item.' },
    { id: 's02', english: 'Do you accept cards?', translations: { ml: 'കാർഡ് സ്വീകരിക്കുമോ?', hi: 'क्या आप कार्ड स्वीकार करते हैं?', ta: 'கார்டு ஏற்றுக்கொள்வீர்களா?', es: '¿Aceptan tarjetas?' }, context: 'Ask before paying at a shop or restaurant.' },
    { id: 's03', english: 'I would like to buy this', translations: { ml: 'ഞാൻ ഇത് വാങ്ങാൻ ആഗ്രഹിക്കുന്നു', hi: 'मैं यह खरीदना चाहता हूँ', ta: 'நான் இதை வாங்க விரும்புகிறேன்', es: 'Quisiera comprar esto' }, context: 'Tell the shopkeeper you want to purchase the item.' },
    { id: 's04', english: 'Do you have a discount?', translations: { ml: 'ഡിസ്കൗണ്ട് ഉണ്ടോ?', hi: 'क्या कोई छूट है?', ta: 'தள்ளுபடி ஏதாவது இருக்கிறதா?', es: '¿Hay algún descuento?' }, context: 'Ask if there is a sale or reduced price available.' },
    { id: 's05', english: 'That is too expensive', translations: { ml: 'ഇത് വളരെ വിലകൂടിയതാണ്', hi: 'यह बहुत महंगा है', ta: 'இது மிகவும் விலை அதிகம்', es: 'Eso es muy caro' }, context: 'Say this politely when the price is beyond your budget.' },
    { id: 's06', english: 'Where is the cashier?', translations: { ml: 'ക്യാഷ്യർ എവിടെ?', hi: 'कैशियर कहाँ है?', ta: 'வரவு-செலவு பட்டியல் ஆளர் எங்கே?', es: '¿Dónde está la caja?' }, context: 'Ask a store employee where you go to pay.' },
    { id: 's07', english: 'Can I have a bag?', translations: { ml: 'ഒരു ബാഗ് ലഭിക്കുമോ?', hi: 'क्या मुझे एक थैला मिल सकता है?', ta: 'ஒரு பை கிடைக்குமா?', es: '¿Me puede dar una bolsa?' }, context: 'Request a carry bag for your purchases.' },
    { id: 's08', english: 'I need change', translations: { ml: 'എനിക്ക് ചില്ലറ വേണം', hi: 'मुझे खुल्ले पैसे चाहिए', ta: 'எனக்கு சில்லறை வேண்டும்', es: 'Necesito cambio' }, context: 'Ask the cashier for smaller notes or coins.' },
    { id: 's09', english: 'Can I return this?', translations: { ml: 'ഇത് തിരിച്ചു നൽകാൻ കഴിയുമോ?', hi: 'क्या मैं इसे वापस कर सकता हूँ?', ta: 'இதை திரும்பித் தர முடியுமா?', es: '¿Puedo devolver esto?' }, context: 'Ask when you want to return something you bought.' },
    { id: 's10', english: 'I want this one', translations: { ml: 'എനിക്ക് ഇത് വേണം', hi: 'मुझे यह चाहिए', ta: 'எனக்கு இது வேண்டும்', es: 'Quiero este' }, context: 'Point to the specific item you want to buy.' },
    { id: 's11', english: 'Where is the exit?', translations: { ml: 'പുറത്ത് കടക്കാനുള്ള വഴി എവിടെ?', hi: 'निकास कहाँ है?', ta: 'வெளியேறும் வழி எங்கே?', es: '¿Dónde está la salida?' }, context: 'Ask store staff when you cannot find the way out.' },
    { id: 's12', english: 'Do you have this in a larger size?', translations: { ml: 'ഇത് വലിയ സൈസിൽ ഉണ്ടോ?', hi: 'क्या यह बड़े आकार में है?', ta: 'இது பெரிய அளவில் இருக்கிறதா?', es: '¿Lo tienen en una talla más grande?' }, context: 'Ask when you need a bigger size for clothing.' },
  ],

  family: [
    { id: 'f01', english: 'This is my grandson', translations: { ml: 'ഇത് എന്റെ കൊച്ചുമകനാണ്', hi: 'यह मेरा पोता है', ta: 'இது என் பேரன்', es: 'Este es mi nieto' }, context: 'Use this to introduce your grandson to others.' },
    { id: 'f02', english: 'I love my family', translations: { ml: 'ഞാൻ എന്റെ കുടുംബത്തെ സ്നേഹിക്കുന്നു', hi: 'मैं अपने परिवार से प्यार करता हूँ', ta: 'நான் என் குடும்பத்தை நேசிக்கிறேன்', es: 'Amo a mi familia' }, context: 'A warm expression of love for your family.' },
    { id: 'f03', english: 'This is my daughter', translations: { ml: 'ഇത് എന്റെ മകളാണ്', hi: 'यह मेरी बेटी है', ta: 'இது என் மகள்', es: 'Esta es mi hija' }, context: 'Introduce your daughter to someone.' },
    { id: 'f04', english: 'This is my son', translations: { ml: 'ഇത് എന്റെ മകനാണ്', hi: 'यह मेरा बेटा है', ta: 'இது என் மகன்', es: 'Este es mi hijo' }, context: 'Introduce your son to someone you meet.' },
    { id: 'f05', english: 'I have grandchildren', translations: { ml: 'എനിക്ക് കൊച്ചുമക്കളുണ്ട്', hi: 'मेरे पोते-पोतियाँ हैं', ta: 'எனக்கு பேரக்குழந்தைகள் இருக்கிறார்கள்', es: 'Tengo nietos' }, context: 'Share the joy of having grandchildren.' },
    { id: 'f06', english: 'Come home', translations: { ml: 'വീട്ടിലേക്ക് വരൂ', hi: 'घर आओ', ta: 'வீட்டிற்கு வாருங்கள்', es: 'Ven a casa' }, context: 'Invite someone to come to your home.' },
    { id: 'f07', english: 'I miss you', translations: { ml: 'ഞാൻ നിങ്ങളെ ഓർക്കുന്നു', hi: 'मुझे तुम्हारी याद आती है', ta: 'நான் உன்னை நினைக்கிறேன்', es: 'Te extraño' }, context: 'Tell someone you are thinking of them fondly.' },
    { id: 'f08', english: 'Happy birthday', translations: { ml: 'ജന്മദിന ആശംസകൾ', hi: 'जन्मदिन की बधाई', ta: 'பிறந்தநாள் வாழ்த்துக்கள்', es: 'Feliz cumpleaños' }, context: 'Wish someone on their special birthday.' },
    { id: 'f09', english: 'You are my friend', translations: { ml: 'നീ എന്റെ കൂട്ടുകാരനാണ്', hi: 'तुम मेरे दोस्त हो', ta: 'நீ என் நண்பன்', es: 'Eres mi amigo' }, context: 'Express friendship and closeness to someone.' },
    { id: 'f10', english: 'We are family', translations: { ml: 'നാം ഒരു കുടുംബമാണ്', hi: 'हम एक परिवार हैं', ta: 'நாங்கள் ஒரு குடும்பம்', es: 'Somos familia' }, context: 'Express the bond of being a family together.' },
    { id: 'f11', english: 'How are the children?', translations: { ml: 'കുട്ടികൾ സുഖമാണോ?', hi: 'बच्चे कैसे हैं?', ta: 'குழந்தைகள் எப்படி இருக்கிறார்கள்?', es: '¿Cómo están los niños?' }, context: 'Ask a parent or grandparent about their children.' },
    { id: 'f12', english: 'I am proud of you', translations: { ml: 'ഞാൻ നിന്നിൽ അഭിമാനം കൊള്ളുന്നു', hi: 'मुझे तुम पर गर्व है', ta: 'நான் உன்னைப் பார்த்து பெருமைப்படுகிறேன்', es: 'Estoy orgulloso de ti' }, context: 'Tell your child or grandchild you are proud of them.' },
  ],
};