# English Companion Learning App

A web application designed to provide an accessible and engaging platform for elder users to learn English. The app features interactive lessons such as flashcards and a user-friendly interface.

##  Live Demo
Check out the live application here: **[https://my-elder-english-app.onrender.com/](https://my-elder-english-app.onrender.com/)**

##  Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express
- **Database & Authentication**: Firebase

##  Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Start the development server:**
   This command concurrently runs the Vite development server and the Express backend.
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

##  Features
- **User Authentication**: Secure login system.
- **Flashcard Decks**: Interactive flashcards to practice and learn English vocabulary.
- **Responsive Design**: Tailored for ease of use across multiple devices, with a focus on accessibility.
