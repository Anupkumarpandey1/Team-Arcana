
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Award, Globe, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizShareDialogProps {
  onClose: () => void;
  username: string;
  score: number;
  totalQuestions: number;
  quizId?: string;
}

const QuizShareDialog = ({ onClose, username, score, totalQuestions, quizId }: QuizShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `I just scored ${score}/${totalQuestions} on this quiz! Try to beat my score!`;

  // Create an absolute URL using the new format
  const baseUrl = window.location.origin;
  const shareUrl = quizId 
    ? `${baseUrl}/quiz/${quizId}` 
    : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);

    toast({
      title: "Link copied!",
      description: "Share it with your friends to challenge them!",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quiz Challenge',
          text: shareText,
          url: shareUrl,
        });

        toast({
          title: "Shared successfully!",
          description: "Challenge sent to your friends!",
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadResults = () => {
    const resultsText = `
Quiz Results for ${username}
--------------------------
Score: ${score}/${totalQuestions}
Percentage: ${((score / totalQuestions) * 100).toFixed(2)}%
Date: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Results downloaded!",
      description: "Your quiz results have been saved as a text file.",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-quiz-primary" />
            Congratulations, {username}!
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              Your score: <span className="text-quiz-primary">{score}/{totalQuestions}</span>
            </p>
            <p className="text-sm text-gray-600">
              Challenge your friends to beat your score!
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <div className="bg-gray-100 p-2 rounded-md flex-1 truncate text-sm break-all overflow-x-auto">
              <div className="max-w-full overflow-hidden text-ellipsis">{shareUrl}</div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm border border-blue-100">
            <div className="flex items-start">
              <Globe className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">How this works:</p>
                <p className="text-blue-700">
                  When others open this link, they'll take the same quiz after entering their name. All scores will be saved to the online leaderboard!
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between mt-4 pt-2 border-t flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline"
              onClick={handleDownloadResults}
              className="gap-2 w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Download Results
            </Button>
            <Button 
              onClick={handleShare}
              className="gap-2 w-full sm:w-auto"
            >
              <Share2 className="w-4 h-4" />
              Share Result
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizShareDialog;
