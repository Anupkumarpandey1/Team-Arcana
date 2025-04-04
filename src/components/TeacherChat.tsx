
import React, { useState } from 'react';
import { BookOpen, Loader2, SendHorizonal, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTeacherResponse } from '@/lib/openai';
import { FormattedMessage } from './FormattedMessage';
import { Button } from './ui/button';
import { generateQuiz } from '@/lib/openai';
import { toast } from 'sonner';
import QuizDisplay from './QuizDisplay';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

interface QuizQuestion {
  question: string;
  options: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

interface QuizData {
  questions: QuizQuestion[];
}

const TeacherChat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState<number | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizData | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Get AI response
    setLoading(true);
    
    try {
      const response = await getTeacherResponse(userMessage);
      
      if (response) {
        // Add bot response to chat
        setMessages(prev => [...prev, { role: 'bot', content: response }]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error getting teacher response:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'Sorry, I couldn\'t process your request. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenerateQuiz = async (messageIndex: number) => {
    // Only allow generating quiz from bot messages
    if (messages[messageIndex].role !== 'bot') return;
    
    setGeneratingQuiz(messageIndex);
    setGeneratedQuiz(null); // Reset any previous quiz
    
    try {
      const content = messages[messageIndex].content;
      toast.info("Generating quiz based on the lesson...");
      
      // Pass the content directly to generateQuiz as the prompt
      const quiz = await generateQuiz(content, 3, 4);
      
      if (quiz) {
        // Set the generated quiz to display it
        setGeneratedQuiz(quiz);
        
        // Also send to parent window if available
        if (window.parent) {
          window.parent.postMessage({
            type: 'QUIZ_GENERATED',
            payload: quiz
          }, '*');
        }
        
        toast.success("Quiz generated successfully!");
      } else {
        toast.error("Failed to generate quiz. Please try again.");
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setGeneratingQuiz(null);
    }
  };
  
  const handleQuizReset = () => {
    setGeneratedQuiz(null);
  };

  return (
    <motion.div 
      className="premium-card h-full overflow auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-6 flex flex-col h-full" style={{ overflow: "auto" }}>
        {!generatedQuiz ? (
          <>
            <div className="flex items-center mb-6">
              <BookOpen className="text-quiz-primary mr-3" size={24} />
              <h2 className="text-2xl font-bold gradient-text">Master Teacher</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 p-6">
                  <p>Ask me anything about the quiz topic!</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={index}
                    className="flex flex-col"
                  >
                    <div 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-xl ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-r from-quiz-primary to-quiz-secondary text-white p-4' 
                            : 'bg-gray-100'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <FormattedMessage 
                            content={msg.content} 
                            className="p-4"
                          />
                        )}
                      </div>
                    </div>
                    
                    {msg.role === 'bot' && (
                      <div className="ml-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerateQuiz(index)} 
                          disabled={generatingQuiz !== null}
                          className="flex items-center gap-2"
                        >
                          {generatingQuiz === index ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              <span>Generating Quiz...</span>
                            </>
                          ) : (
                            <>
                              <BrainCircuit size={16} />
                              <span>Practice with Quiz</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about the topic..."
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:border-quiz-primary transition-all duration-200"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="p-4 rounded-xl bg-gradient-to-r from-quiz-primary to-quiz-secondary text-white"
              >
                <SendHorizonal size={20} />
              </button>
            </div>
          </>
        ) : (
          <QuizDisplay 
            quiz={generatedQuiz} 
            onReset={handleQuizReset} 
          />
        )}
      </div>
    </motion.div>
  );
};

export default TeacherChat;
