import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingSection from '@/components/LandingSection';
import QuizGenerator from '@/components/QuizGenerator';
import QuizDisplay from '@/components/QuizDisplay';
import TeacherChat from '@/components/TeacherChat';
import LeaderboardDisplay from '@/components/LeaderboardDisplay';
import QuizShareDialog from '@/components/QuizShareDialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Share2, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  saveQuiz, 
  getQuiz, 
  saveScore, 
  getLeaderboard, 
  type LeaderboardEntry, 
  type QuizData 
} from '@/services/quizService';

const LEADERBOARD_POLL_INTERVAL = 5000; // Poll for leaderboard updates every 5 seconds

const Index = () => {
  const [showQuizSection, setShowQuizSection] = useState(false);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [username, setUsername] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [usernameRequired, setUsernameRequired] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState<string>('');
  const [liveLeaderboardVisible, setLiveLeaderboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for shared quizzes in URL
  useEffect(() => {
    const checkForSharedQuiz = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const sharedParam = urlParams.get('share');
        const quizId = urlParams.get('quizId');
        
        if (sharedParam === 'true' && quizId) {
          console.log("Found shared quiz in URL, redirecting to:", quizId);
          navigate(`/quiz/${quizId}`, { replace: true });
        }
      } catch (error) {
        console.error("Error processing URL parameters:", error);
        toast({
          title: "Error",
          description: "Failed to process the shared quiz link",
          variant: "destructive"
        });
      }
    };
    
    checkForSharedQuiz();
  }, [location, navigate, toast]);

  // Poll for leaderboard updates
  useEffect(() => {
    if (!currentQuizId) return;
    
    loadLeaderboard(currentQuizId);
    
    const intervalId = setInterval(() => {
      loadLeaderboard(currentQuizId);
    }, LEADERBOARD_POLL_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [currentQuizId]);

  const loadLeaderboard = async (quizId: string) => {
    try {
      const leaderboardData = await getLeaderboard(quizId);
      if (leaderboardData && leaderboardData.length > 0) {
        setLeaderboard(sortLeaderboard(leaderboardData));
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  const sortLeaderboard = (entries: LeaderboardEntry[]) => {
    return [...entries].sort((a, b) => {
      const aPercent = a.score / a.totalQuestions;
      const bPercent = b.score / b.totalQuestions;
      if (bPercent !== aPercent) return bPercent - aPercent;
      
      return b.timestamp - a.timestamp;
    });
  };

  const handleGetStarted = () => {
    setShowQuizSection(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizGenerated = async (quizData: QuizData) => {
    setQuiz(quizData);
    setUsernameRequired(true);
    
    try {
      const quizId = await saveQuiz(quizData, username || "Anonymous");
      console.log("Quiz stored successfully with ID:", quizId);
      setCurrentQuizId(quizId);
      setLiveLeaderboardVisible(true);
    } catch (error) {
      console.error("Error storing quiz data:", error);
      toast({
        title: "Error saving quiz",
        description: "Failed to save the quiz to the database",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setShowLeaderboard(false);
  };

  const handleScoreSubmit = async (score: number, totalQuestions: number) => {
    if (!username || !currentQuizId) {
      toast({
        title: "Error saving score",
        description: "Missing username or quiz ID",
        variant: "destructive",
      });
      return;
    }

    const newEntry: LeaderboardEntry = {
      username,
      score,
      totalQuestions,
      timestamp: Date.now(),
    };

    try {
      await saveScore(currentQuizId, newEntry);
      
      const updatedLeaderboard = await getLeaderboard(currentQuizId);
      const sortedLeaderboard = sortLeaderboard(updatedLeaderboard);
      setLeaderboard(sortedLeaderboard);
      
      setShowLeaderboard(true);
      setShowShareDialog(true);
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      toast({
        title: "Error saving score",
        description: "Failed to save your score to the leaderboard",
        variant: "destructive"
      });
    }
  };

  const handleShareClose = () => {
    setShowShareDialog(false);
  };

  const handleShareQuiz = () => {
    if (!currentQuizId) {
      toast({
        title: "Error sharing quiz",
        description: "Quiz ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    const shareUrl = new URL(window.location.origin);
    shareUrl.pathname = `/quiz/${currentQuizId}`;
    
    navigator.clipboard.writeText(shareUrl.toString());
    
    toast({
      title: "Quiz link copied!",
      description: "Share this link with friends to let them take the same quiz!",
    });
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }
    
    setUsernameRequired(false);
  };

  const toggleLiveLeaderboard = () => {
    setLiveLeaderboardVisible(prev => !prev);
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  if (showQuizSection && usernameRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <motion.div 
          className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <User className="w-12 h-12 mx-auto text-quiz-primary mb-2" />
            <h2 className="text-2xl font-bold gradient-text">Enter Your Name</h2>
            <p className="text-gray-600 mt-2">Please provide your name before taking the quiz</p>
          </div>
          
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-quiz-primary"
                autoFocus
              />
            </div>
            <div>
              <Button 
                type="submit" 
                className="w-full py-3" 
                disabled={isLoading}
              >
                {isLoading ? 'Loading Quiz...' : 'Continue to Quiz'}
              </Button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setShowQuizSection(false);
                setUsernameRequired(false);
              }}
              className="text-gray-600 hover:text-quiz-primary transition-colors"
              disabled={isLoading}
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatePresence mode="wait">
        {!showQuizSection ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={pageTransition}
          >
            <LandingSection onGetStarted={handleGetStarted} />
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={pageTransition}
            className="w-full mx-auto px-4 sm:px-6 py-8 sm:py-16"
          >
            <div className={`grid ${!quiz && !showLeaderboard ? 'md:grid-cols-2' : (quiz && liveLeaderboardVisible ? 'md:grid-cols-2' : '')} gap-6 md:gap-8`}>
              <div className="space-y-6 md:space-y-8">
                {!quiz && showLeaderboard ? (
                  <LeaderboardDisplay 
                    leaderboard={leaderboard} 
                    onBackToQuiz={() => setShowLeaderboard(false)} 
                  />
                ) : !quiz ? (
                  <QuizGenerator onQuizGenerated={handleQuizGenerated} />
                ) : (
                  <>
                    <QuizDisplay 
                      quiz={quiz} 
                      onReset={handleReset} 
                      username={username}
                      onScoreSubmit={handleScoreSubmit}
                    />
                    
                    {!showLeaderboard && (
                      <div className="flex justify-center gap-4 flex-wrap">
                        <Button
                          variant="outline"
                          onClick={handleShareQuiz}
                          className="gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share This Quiz
                        </Button>
                        
                        <Button
                          variant="secondary"
                          onClick={toggleLiveLeaderboard}
                          className="md:hidden"
                        >
                          {liveLeaderboardVisible ? "Hide Leaderboard" : "Show Leaderboard"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {!quiz && !showLeaderboard && (
                <div className="h-[600px] md:h-[800px]">
                  <TeacherChat />
                </div>
              )}
              
              {quiz && leaderboard.length > 0 && liveLeaderboardVisible && (
                <div className="md:block">
                  <div className="sticky top-4">
                    <LeaderboardDisplay 
                      leaderboard={leaderboard} 
                      onBackToQuiz={() => {}} 
                    />
                    <div className="md:hidden mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={toggleLiveLeaderboard}
                      >
                        Hide Leaderboard
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {quiz && leaderboard.length === 0 && liveLeaderboardVisible && (
                <div className="md:block">
                  <div className="sticky top-4">
                    <LeaderboardDisplay 
                      leaderboard={[]} 
                      onBackToQuiz={() => {}} 
                    />
                    <div className="md:hidden mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={toggleLiveLeaderboard}
                      >
                        Hide Leaderboard
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 md:mt-16 text-center">
              <button
                onClick={() => {
                  setShowQuizSection(false);
                  setUsername('');
                  setQuiz(null);
                  setShowLeaderboard(false);
                }}
                className="text-gray-600 hover:text-quiz-primary transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showShareDialog && (
        <QuizShareDialog 
          onClose={handleShareClose}
          username={username}
          score={leaderboard.find(entry => entry.username === username)?.score || 0}
          totalQuestions={leaderboard.find(entry => entry.username === username)?.totalQuestions || 0}
          quizId={currentQuizId}
        />
      )}
    </div>
  );
};

export default Index;
