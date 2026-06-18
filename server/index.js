import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env if needed

const app = express();
const PORT = process.env.PORT || 3001;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

app.use(cors());
app.use(express.json());

// Helper to fetch from Groq
const fetchGroq = async (messages, response_format = null) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API Key is missing');
  }

  const model = process.env.GROQ_MODEL || process.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';

  const body = {
    model,
    messages,
    temperature: 0.7,
  };
  
  if (response_format) {
    body.response_format = response_format;
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error: ${errorText}`);
  }

  return response.json();
};

app.post('/api/flashcards', async (req, res) => {
  try {
    const { nativeLang, englishLevel, categoryId, quizSize } = req.body;

    const systemPrompt = `You are an AI generating flashcards for an English learning app for seniors.
The target native language is ${nativeLang.name} (${nativeLang.id}).
The user's English proficiency level is: ${englishLevel || 'none'}.
The specific category for these flashcards is: "${categoryId}". 

Generate EXACTLY ${quizSize} unique flashcards STRICTLY related to the "${categoryId}" category. Do NOT generate generic words outside of this category.
Ensure high variety and randomness so the user doesn't see the same words if they practice multiple times. Choose less common but still practical words/phrases within the category.
The content must remain highly relevant and useful to older adults navigating daily life.

- If 'none' or 'basic': Provide simple, single vocabulary words or very short phrases relevant to ${categoryId} (e.g., if shopping: "Cart", "How much?").
- If 'intermediate': Provide practical sentences relevant to ${categoryId} (e.g., if shopping: "Where is the checkout?", "I need milk.").
- If 'advanced': Provide more complex conversational phrases relevant to ${categoryId} (e.g., if shopping: "Do you offer a senior discount for these items?").

You MUST respond ONLY with a valid JSON object matching this schema:
{
  "cards": [
    {
      "id": "gen_1",
      "english": "English phrase",
      "translations": { "${nativeLang.id}": "Translation in native language" },
      "context": "Short contextual tip on when to use this"
    }
  ]
}
Ensure the JSON is perfectly formatted. Do not include markdown code blocks.`;

    const messages = [{ role: 'system', content: systemPrompt }];
    const data = await fetchGroq(messages, { type: "json_object" });
    const content = JSON.parse(data.choices[0].message.content);

    res.json(content);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, nativeLang, englishLevel } = req.body;

    const systemPrompt = `You are an English language dictionary and pronunciation tool for an older adult whose native language is ${nativeLang.name}.
Their English level is: ${englishLevel || 'none'}.

CRITICAL INSTRUCTION: YOU ARE NOT A CHATBOT. YOU MUST NOT HAVE CONVERSATIONS. Do not answer questions, do not give advice, do not include any greetings or filler text. 

NO MATTER WHAT THE USER TYPES (whether it is a single word, a phrase, a sentence, or a question), you MUST translate/teach it and respond STRICTLY and ONLY in this exact 3-line format. Do not add any other text:

Meaning: The English word/sentence and its meaning in ${nativeLang.name}.
Pronunciation: The English word/sentence spelled out using ${nativeLang.name} letters so they know how to read it phonetically.
Example: A simple, practical English sentence using the concept, followed by its ${nativeLang.name} translation.

Example response if the user types "Hospital" or "I want to go to the hospital":
Meaning: ആശുപത്രി (Hospital)
Pronunciation: ഹോസ്പിറ്റൽ
Example: I am going to the hospital. (ഞാൻ ആശുപത്രിയിൽ പോകുന്നു)`;

    // Ensure system prompt is first
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const data = await fetchGroq(fullMessages);
    const aiMessage = data.choices[0].message.content;

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve the React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
