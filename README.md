# 🎓 LearnFlow – AI-Powered Learning Platform

## 📌 Project Overview

*LearnFlow* is an AI-driven educational platform designed to enhance and personalize the learning experience. It comprises two main modules:

### 🛡 1. Battleground
Transform *YouTube videos, **documents, or **topics* into interactive AI-generated *quizzes*. Features include:
- Personalized quizzes to reinforce learning.
- Instant feedback to assess understanding.
- Real-time interaction with the *Master Teacher AI Assistant* for tailored guidance.

*Live Demo*: [Battleground Module](https://learnflowai1.netlify.app/)

### 🏕 2. Barrack
Convert any content into:
- *Flashcards* for quick revisions.
- *Study Notes* to summarize key points.
- *Multiplayer Quizzes* for collaborative learning.

Barrack promotes faster learning, real-time collaboration, and makes studying engaging and fun.

*Live Demo*: [Barrack Module](https://learnflowai2.netlify.app/)

> Built with *React, **TypeScript, **Vite, and **Tailwind CSS. Powered by the **Gemini API* for AI functionalities and utilizes *Mermaid* for flowchart visualizations.

---

## ⚙ Installation and Setup

Follow these steps to set up the project locally:

### 📦 Prerequisites
- Node.js (v18 or higher recommended)
- Git
- A Gemini API key (for AI features)

### 🛡️ Setting Up Battleground

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Anupkumarpandey1/Team-Arcana.git
   cd Team-Arcana
   ```
2. **Install Dependencies**:

```bash
npm install
```
3. **Set Up Environment Variables**:

Create a .env file in the root directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
4. **Run the Development Server**:

```bash
npm run dev
```
The application will be running at http://localhost:5173.

###🏕️ Setting Up Barrack
Navigate to the Parent Directory (to avoid nesting repositories):

bash
Copy
Edit
cd ..
Clone the Repository:

bash
Copy
Edit
git clone https://github.com/Rudramani1/BARRACKS.git
cd BARRACKS
Install Dependencies:

bash
Copy
Edit
npm install
Set Up Environment Variables:

Similarly, create a .env file in the root directory and add your Gemini API key:

env
Copy
Edit
VITE_GEMINI_API_KEY=your_gemini_api_key_here
Run the Development Server:

bash
Copy
Edit
npm run dev
The application will be running at http://localhost:5173.

Note: Ensure that both applications run on different ports to avoid conflicts. You can specify a different port when starting the development server by running:

bash
Copy
Edit
npm run dev -- --port=5174
This command will start the server on port 5174.

## 🧰 Tech Stack

- *Frontend*: React + TypeScript + Vite
- *Styling*: Tailwind CSS
- *AI Integration*: Gemini API (for content summarization, quiz generation, and AI assistant)
- *Visualization*: Mermaid.js (for creating flowcharts and diagrams)
- *Real-time Collaboration*: Supabase

---

## 📸 Screenshots / Demo

(Include screenshots or demo GIFs showcasing the Battleground and Barrack modules.)


---
