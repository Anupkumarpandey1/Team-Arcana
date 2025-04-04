

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LearnFlow - README</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 2rem;
      background: #f9f9f9;
      color: #333;
    }
    header, section {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    pre {
      background: #eee;
      padding: 1rem;
      overflow-x: auto;
    }
    code {
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul {
      list-style: disc;
      margin-left: 2rem;
    }
  </style>
</head>
<body>

  <header>
    <h1>Welcome to LearnFlow!</h1>
    <p>LearnFlow is your one-stop website to create flashcards, quick notes, quizzes, and even host multiplayer quiz games.</p>
    <p><strong>Live Demo:</strong> <a href="https://learnflowai1.netlify.app/" target="_blank">https://learnflowai1.netlify.app/</a></p>
  </header>

  <section>
    <h2>Project Information</h2>
    <p>This project allows you to:</p>
    <ul>
      <li>Create and organize <strong>flashcards</strong> and <strong>quick notes</strong></li>
      <li>Build interactive <strong>quizzes</strong></li>
      <li>Host real-time <strong>multiplayer quiz games</strong></li>
    </ul>
    <p>All these features are designed to help you learn and test your knowledge in a fun and interactive way.</p>
  </section>

  <section>
    <h2>How to Edit the Code</h2>
    <p>You have multiple ways to edit this project:</p>
    
    <h3>1. Use LearnFlow (Recommended)</h3>
    <p>
      Visit the <a href="https://learnflowai1.netlify.app/" target="_blank">LearnFlow project page</a> and edit your application directly in the browser. Changes made on LearnFlow are automatically committed to the repository.
    </p>
    
    <h3>2. Use Your Preferred IDE Locally</h3>
    <p>If you prefer working locally, follow these steps:</p>
    <pre><code># Clone the repository
git clone &lt;YOUR_GIT_URL&gt;

# Navigate to the project directory
cd &lt;YOUR_PROJECT_NAME&gt;

# Install dependencies
npm install

# Start the development server
npm run dev
    </code></pre>
    
    <h3>3. Edit Directly on GitHub</h3>
    <p>
      You can also edit files directly on GitHub:
      <br>
      - Navigate to the file you want to edit.
      <br>
      - Click the <strong>Edit</strong> (pencil) icon.
      <br>
      - Make your changes and commit them.
    </p>
  </section>

  <section>
    <h2>Tech Stack</h2>
    <p>This project is built using modern web technologies:</p>
    <ul>
      <li><strong>Vite</strong> - Fast build tool</li>
      <li><strong>TypeScript</strong> - Typed JavaScript</li>
      <li><strong>React</strong> - UI library</li>
      <li><strong>shadcn/ui</strong> - Pre-built, customizable UI components</li>
      <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
    </ul>
  </section>

  <section>
    <h2>How to Deploy</h2>
    <p>
      To deploy your project, simply open the LearnFlow interface and click <strong>Share → Publish</strong>. This will make your changes live instantly.
    </p>
  </section>

  <section>
    <h2>Custom Domains</h2>
    <p>
      At the moment, LearnFlow does not support custom domains directly. If you want to host your project on your own domain, we recommend deploying it using Netlify. For more details, please see our guide on <a href="https://docs.learnflow.dev/tips-tricks/custom-domain/" target="_blank">Custom Domains</a>.
    </p>
  </section>

  <footer>
    <p>&copy; 2025 LearnFlow. All rights reserved.</p>
  </footer>

</body>
</html>

