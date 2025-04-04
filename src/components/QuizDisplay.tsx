
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuizOption {
  text: string;
  correct: boolean;
  explanation: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

interface QuizData {
  questions: QuizQuestion[];
}

interface QuizDisplayProps {
  quiz: QuizData;
  onReset: () => void;
  username?: string;
  onScoreSubmit?: (score: number, totalQuestions: number) => void;
}

const QuizDisplay = ({ quiz, onReset, username, onScoreSubmit }: QuizDisplayProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  useEffect(() => {
    // Reset state when a new quiz is loaded
    setSelectedAnswers({});
    setScore(null);
    setShowExplanation({});
    setScoreSubmitted(false);
  }, [quiz]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (score !== null) return; // Prevent changing answers after submission
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const toggleExplanation = (questionIndex: number) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  const submitQuiz = () => {
    if (Object.keys(selectedAnswers).length < quiz.questions.length) {
      // Not all questions answered
      return;
    }
    
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (q.options[selectedAnswers[index]]?.correct) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setScore(null);
    setShowExplanation({});
    setScoreSubmitted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score! / quiz.questions.length) * 100;
    if (percentage === 100) return "Perfect score! Excellent work!";
    if (percentage >= 80) return "Great job! You've mastered this topic!";
    if (percentage >= 60) return "Good effort! Keep learning!";
    if (percentage >= 40) return "Nice try! Review the explanations to improve!";
    return "Keep practicing! Review the material and try again!";
  };

  const handleSubmitScore = () => {
    if (score !== null && onScoreSubmit && !scoreSubmitted) {
      onScoreSubmit(score, quiz.questions.length);
      setScoreSubmitted(true);
    }
  };

  return (
    <motion.div 
      className="premium-card overflow-visible"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 sm:p-8">
        {username && (
          <div className="mb-4 py-2 px-4 bg-blue-50 rounded-lg text-gray-700 inline-block">
            Taking quiz as: <span className="font-semibold">{username}</span>
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-6 gradient-text">Your Quiz</h2>
        
        <div className="space-y-8">
          {quiz.questions.map((question, qIndex) => (
            <motion.div 
              key={qIndex}
              className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: qIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-quiz-dark mb-4">
                {qIndex + 1}. {question.question}
              </h3>
              
              <div className="space-y-3 mb-3">
                {question.options.map((option, oIndex) => (
                  <motion.div 
                    key={oIndex}
                    whileHover={score === null ? { scale: 1.01 } : {}}
                    whileTap={score === null ? { scale: 0.99 } : {}}
                  >
                    <button
                      onClick={() => handleAnswerSelect(qIndex, oIndex)}
                      className={cn(
                        "w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 border",
                        score === null ? "hover:bg-gray-100 cursor-pointer" : "cursor-default",
                        selectedAnswers[qIndex] === oIndex 
                          ? (score !== null && !option.correct
                              ? "bg-red-50 border-red-300" 
                              : "bg-blue-50 border-blue-300")
                          : (score !== null && option.correct
                              ? "bg-green-50 border-green-300"
                              : "bg-white border-gray-200")
                      )}
                      disabled={score !== null}
                    >
                      <div className="flex items-center">
                        <div className={cn(
                          "w-5 h-5 rounded-full mr-3 flex-shrink-0 flex items-center justify-center border",
                          selectedAnswers[qIndex] === oIndex 
                            ? (score !== null && !option.correct
                                ? "border-red-500 bg-red-100" 
                                : "border-blue-500 bg-blue-100")
                            : (score !== null && option.correct
                                ? "border-green-500 bg-green-100"
                                : "border-gray-300 bg-white")
                        )}>
                          {score !== null && option.correct && (
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {score !== null && selectedAnswers[qIndex] === oIndex && !option.correct && (
                            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="break-words">{option.text}</span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {score !== null && (
                <div className="mt-4">
                  <button
                    onClick={() => toggleExplanation(qIndex)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showExplanation[qIndex] ? "Hide Explanation" : "Show Explanation"}
                  </button>
                  
                  <AnimatePresence>
                    {showExplanation[qIndex] && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-4 bg-green-50 rounded-lg text-sm text-green-800 border border-green-100">
                          <p className="font-semibold mb-1">Explanation:</p>
                          <p className="break-words">
                            {question.options.find(opt => opt.correct)?.explanation || 
                             "No explanation provided for this question."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {score === null ? (
          <motion.button
            onClick={submitQuiz}
            className={cn(
              "w-full premium-button mt-8 py-4",
              Object.keys(selectedAnswers).length < quiz.questions.length ? "opacity-70" : ""
            )}
            whileHover={Object.keys(selectedAnswers).length === quiz.questions.length ? { scale: 1.02 } : {}}
            whileTap={Object.keys(selectedAnswers).length === quiz.questions.length ? { scale: 0.98 } : {}}
            disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
          >
            {Object.keys(selectedAnswers).length < quiz.questions.length 
              ? `Answer all questions (${Object.keys(selectedAnswers).length}/${quiz.questions.length})` 
              : "Submit Quiz"}
          </motion.button>
        ) : (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-quiz-primary to-quiz-secondary p-4 sm:p-8 rounded-2xl text-white text-center">
              <div className="mb-2">
                <Trophy className="w-12 h-12 sm:w-14 sm:h-14 mx-auto" />
              </div>
              <h3 className="text-xl sm:text-3xl font-bold mb-2">
                Your Score: {score} out of {quiz.questions.length}
              </h3>
              <p className="text-white/90 mb-6">
                {getScoreMessage()}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="bg-white text-quiz-primary px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium 
                           hover:bg-blue-50 transition-colors duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={onReset}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium 
                           hover:bg-white/30 transition-colors duration-200"
                >
                  New Quiz
                </button>
                {!scoreSubmitted && username && (
                  <Button
                    onClick={handleSubmitScore}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium 
                              hover:bg-white/30 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Save Score
                  </Button>
                )}
                {scoreSubmitted && (
                  <Button
                    className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium flex items-center gap-2"
                    disabled
                  >
                    <Check className="w-4 h-4" />
                    Score Saved
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizDisplay;
