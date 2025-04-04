
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface LeaderboardEntry {
  id?: string;
  quiz_id?: string;
  username: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}

// Save a new quiz to Supabase
export async function saveQuiz(quizData: QuizData, creatorName: string = ""): Promise<string> {
  try {
    // Convert to correct type for database storage
    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        creator_name: creatorName,
        questions: quizData.questions as any
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error saving quiz:", error);
      throw new Error(`Failed to save quiz: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after saving quiz");
    }

    console.log("Quiz saved successfully with ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("Exception when saving quiz:", error);
    throw error;
  }
}

// Get a quiz by ID
export async function getQuiz(quizId: string): Promise<QuizData | null> {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('questions')
      .eq('id', quizId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("Quiz not found:", quizId);
        return null;
      }
      console.error("Error fetching quiz:", error);
      throw new Error(`Failed to fetch quiz: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return { questions: data.questions as unknown as QuizQuestion[] };
  } catch (error) {
    console.error("Exception when fetching quiz:", error);
    throw error;
  }
}

// Save a score to the leaderboard
export async function saveScore(quizId: string, entry: LeaderboardEntry): Promise<void> {
  try {
    const { error } = await supabase
      .from('scores')
      .insert({
        quiz_id: quizId,
        username: entry.username,
        score: entry.score,
        total_questions: entry.totalQuestions,
        timestamp: new Date(entry.timestamp).toISOString()
      });

    if (error) {
      console.error("Error saving score:", error);
      throw new Error(`Failed to save score: ${error.message}`);
    }

    console.log("Score saved successfully for quiz:", quizId);
  } catch (error) {
    console.error("Exception when saving score:", error);
    throw error;
  }
}

// Get leaderboard entries for a quiz
export async function getLeaderboard(quizId: string): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('id, quiz_id, username, score, total_questions, timestamp')
      .eq('quiz_id', quizId)
      .order('score', { ascending: false });

    if (error) {
      console.error("Error fetching leaderboard:", error);
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(item => ({
      id: item.id,
      quiz_id: item.quiz_id,
      username: item.username,
      score: item.score,
      totalQuestions: item.total_questions,
      timestamp: new Date(item.timestamp).getTime()
    }));
  } catch (error) {
    console.error("Exception when fetching leaderboard:", error);
    throw error;
  }
}
