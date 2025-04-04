
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizDisplay from '@/components/QuizDisplay';
import LeaderboardDisplay from '@/components/LeaderboardDisplay';
import QuizShareDialog from '@/components/QuizShareDialog';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  getQuiz, 
  saveScore, 
  getLeaderboard, 
  type LeaderboardEntry, 
  type QuizData 
} from '@/services/quizService';

const LEADERBOARD_POLL_INTERVAL = 5000; // Poll for leaderboard updates every 5 seconds

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [username, setUsername] = useState<string>('');
  const [usernameRequired, setUsernameRequired] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  
  // Load quiz data on initial render
  useEffect(() => {
    if (!quizId) {
      console.error("No quizId found in URL");
      setError("No quiz ID found in the URL.");
      navigate('/');
      return;
    }
    
    console.log("QuizPage loaded with quizId:", quizId);
    
    // Check if we have a stored username for this quiz
    const storedUsername = localStorage.getItem(`quiz_username_${quizId}`);
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    loadLeaderboard(quizId);
    
    // Set up polling for leaderboard updates
    const intervalId = setInterval(() => {
      loadLeaderboard(quizId);
    }, LEADERBOARD_POLL_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [quizId, navigate]);
  
  const loadLeaderboard = async (id: string) => {
    if (!id) return;
    
    try {
      console.log("Loading leaderboard for quiz:", id);
      const leaderboardData = await getLeaderboard(id);
      setLeaderboard(sortLeaderboard(leaderboardData));
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
    
    if (!quizId) {
      console.error("No quizId available");
      setError("Quiz ID is missing");
      navigate('/');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching quiz with ID:", quizId);
      const quizData = await getQuiz(quizId);
      
      if (quizData && quizData.questions && quizData.questions.length > 0) {
        console.log("Quiz loaded successfully:", quizData);
        setQuiz(quizData);
        setUsernameRequired(false);
        setFetchAttempts(0); // Reset fetch attempts on success
        
        // Store username in localStorage with quizId
        localStorage.setItem(`quiz_username_${quizId}`, username);
      } else {
        console.error("Quiz not found or invalid format:", quizData);
        setError("The quiz could not be found. It may have been deleted or the link is incorrect.");
        
        // If we've tried a few times and still can't get the quiz, show an error
        if (fetchAttempts >= 2) {
          toast({
            title: "Quiz not found",
            description: "The shared quiz could not be found. Please try a different link or generate a new quiz.",
            variant: "destructive",
          });
        } else {
          // Try again after a delay
          setFetchAttempts(prev => prev + 1);
          setTimeout(() => {
            handleUsernameSubmit(e);
          }, 2000);
          return;
        }
      }
    } catch (error) {
      console.error("Error loading shared quiz:", error);
      setError("There was an error loading the quiz. Please try again later.");
      toast({
        title: "Error loading quiz",
        description: "There was a problem loading the shared quiz.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScoreSubmit = async (score: number, totalQuestions: number) => {
    if (!username || !quizId) {
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
      await saveScore(quizId, newEntry);
      await loadLeaderboard(quizId);
      setShowShareDialog(true);
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error saving score",
        description: "Failed to save your score to the leaderboard",
        variant: "destructive",
      });
    }
  };
  
  const handleShareClose = () => {
    setShowShareDialog(false);
  };
  
  if (usernameRequired) {
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
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
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
              onClick={() => navigate('/')}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {quiz && (
              <QuizDisplay 
                quiz={quiz} 
                onReset={() => navigate('/')} 
                username={username}
                onScoreSubmit={handleScoreSubmit}
              />
            )}
            {!quiz && !error && isLoading && (
              <div className="text-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-quiz-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-600">Loading quiz...</p>
              </div>
            )}
            {!quiz && error && (
              <div className="text-center py-20">
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                  {error}
                </div>
                <Button onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            )}
          </div>
          
          <div className="md:block">
            <div className="sticky top-4">
              <LeaderboardDisplay 
                leaderboard={leaderboard} 
                onBackToQuiz={() => {}} 
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-quiz-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
      
      {showShareDialog && quizId && (
        <QuizShareDialog 
          onClose={handleShareClose}
          username={username}
          score={leaderboard.find(entry => entry.username === username)?.score || 0}
          totalQuestions={leaderboard.find(entry => entry.username === username)?.totalQuestions || 0}
          quizId={quizId}
        />
      )}
    </div>
  );
};

export default QuizPage;
