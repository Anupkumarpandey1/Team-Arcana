import { toast } from "sonner";
import { 
  OPENAI_API_KEY, 
  OPENAI_API_URL, 
  GEMINI_API_KEY,
  GEMINI_API_URL,
  AI_MODELS, 
  DEFAULT_QUIZ_PARAMS 
} from "./config";
import { getVideoDetails, getVideoSummary, getProcessedSummary } from "./youtube";

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

export async function generateQuiz(
  prompt: string, 
  numQuestions: number = DEFAULT_QUIZ_PARAMS.numQuestions, 
  numOptions: number = DEFAULT_QUIZ_PARAMS.numOptions,
  language: 'english' | 'hindi' | 'hinglish' = 'english'
): Promise<QuizData | null> {
  try {
    // Determine if the prompt is a summary from the API
    let promptText = prompt;
    let isVideoSummary = false;
    
    // Check if the prompt is a JSON string from the API
    try {
      const parsedPrompt = JSON.parse(prompt);
      if (parsedPrompt && parsedPrompt.summary) {
        promptText = `Video Summary: ${parsedPrompt.summary}`;
        isVideoSummary = true;
      }
    } catch (e) {
      // Not JSON, use as is
      promptText = prompt;
    }

    console.log("Generating quiz with prompt:", promptText.substring(0, 100) + "...");

    let languageInstructions = '';
    if (language === 'hindi') {
      languageInstructions = '- Generate the quiz in Hindi language, including questions, options, and explanations';
    } else if (language === 'hinglish') {
      languageInstructions = '- Generate the quiz in Hinglish language (mix of Hindi and English words like "kya kar rhe ho"), including questions, options, and explanations. Use Roman script with Hindi words rather than Devanagari script.';
    }

    const promptTemplate = `You are a quiz generator. Generate a multiple choice quiz about: "${promptText}"
     
    IMPORTANT: Return ONLY a valid JSON object. Do not include any markdown formatting, backticks, or other text.
    
    The quiz must follow these rules:
    - Create exactly ${numQuestions} questions
    - Each question must have exactly ${numOptions} options
    - Only one option should be correct
    - Make questions challenging but fair
    - Include a mix of different difficulty levels
    - For each correct answer, provide a detailed explanation of why it's correct
    - The quiz MUST be about information contained in the provided content ONLY
    - Be very specific to the details provided, don't make up general information
    - Only generate questions about facts directly stated in the content, not general knowledge
    - Ensure questions reference specific details, concepts, or ideas from the content
    ${isVideoSummary ? '- This is a YouTube video summary, so make questions that test comprehension of the video content' : ''}
    ${languageInstructions}
    
    The response must be a JSON object with this exact structure:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": [
            {
              "text": "Option text here",
              "correct": boolean,
              "explanation": "Detailed explanation for the correct answer"
            }
          ]
        }
      ]
    }
    
    Remember: Return ONLY the JSON object, no other text or formatting.`;

    // Use Gemini API for quiz generation
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptTemplate }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API error response:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content returned from API');
    }

    // Clean any potential markdown formatting
    const cleanedContent = content.replace(/```json\n|\n```|```/g, '').trim();
    
    try {
      const quizData = JSON.parse(cleanedContent);
      // Validate the quiz data structure
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz format received from AI');
      }

      // Validate that each question has exactly one correct answer
      quizData.questions.forEach((question: any, index: number) => {
        if (!Array.isArray(question.options)) {
          throw new Error(`Question ${index + 1} has invalid options format`);
        }
        
        const correctAnswers = question.options.filter((opt: any) => opt.correct).length;
        if (correctAnswers !== 1) {
          throw new Error(`Question ${index + 1} has ${correctAnswers} correct answers instead of 1`);
        }
      });

      return quizData;
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      throw new Error('Failed to parse quiz data');
    }
  } catch (error) {
    console.error('Quiz generation error:', error);
    toast.error('Failed to generate quiz. Please try again.');
    return null;
  }
}

export async function getTeacherResponse(question: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  try {
    let languageInstructions = '';
    if (language === 'hindi') {
      languageInstructions = 'Provide the explanation in Hindi language.';
    } else if (language === 'hinglish') {
      languageInstructions = 'Provide the explanation in Hinglish language (mix of Hindi and English words like "kya kar rhe ho"). Use Roman script with Hindi words rather than Devanagari script.';
    }

    const prompt = `You are a Master Teacher, an expert educator who explains concepts clearly and thoroughly. 
    Provide a detailed, well-structured explanation for this question: "${question}"
    
    Please format your response with the following rules:
    - Use capitalized words for main headings (these will be rendered as H2 elements)
    - Use capitalized phrases ending with a colon for subheadings (these will be rendered as H3 elements)
    - Use bullet points (start with * or -) for unordered lists
    - Use numbered points (1., 2., etc.) for ordered lists
    - Use **double asterisks** around text you want to emphasize as important
    - Leave blank lines between paragraphs and sections
    
    VERY IMPORTANT: DO NOT include the user's question as a heading or title in your response. Start directly with your educational content.
    
    ${languageInstructions}
    
    Example formatting:
    MAIN HEADING
    
    Paragraph text here.
    
    SUBHEADING:
    
    * First bullet point
    * Second bullet point with **emphasized text**
    
    1. First numbered item
    2. Second numbered item
    
    Make your response educational, insightful, and clearly formatted.`;

    // Use Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content returned from API');
    }

    return content;
  } catch (error) {
    console.error('Teacher response error:', error);
    toast.error('Failed to get teacher response. Please try again.');
    return null;
  }
}

export async function extractFromYouTube(youtubeUrl: string): Promise<string | null> {
  toast.info("Extracting content from YouTube video...");
  const content = await getVideoDetails(youtubeUrl);
  
  if (content) {
    toast.success("Successfully extracted video content");
    return content;
  } else {
    toast.error("Could not extract video content");
    return null;
  }
}

export async function getSummaryFromYouTube(youtubeUrl: string): Promise<string | null> {
  toast.info("Fetching video summary from API...");
  const summary = await getVideoSummary(youtubeUrl);
  
  if (summary) {
    toast.success("Summary fetched successfully");
    return summary;
  } else {
    toast.error("Could not generate summary");
    return null;
  }
}

export async function getProcessedSummaryFromYouTube(rawApiResponse: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  toast.info("Processing summary with Gemini...");
  const processedSummary = await getProcessedSummary(rawApiResponse, language);
  
  if (processedSummary) {
    toast.success("Summary processed successfully");
    return processedSummary;
  } else {
    toast.error("Could not process summary");
    return null;
  }
}

export async function analyzeImageWithGemini(
  imageData: string, 
  language: 'english' | 'hindi' | 'hinglish' = 'english',
  fileType: string | null = null
): Promise<string | null> {
  toast.info("Analyzing image with Gemini...");
  
  try {
    // Create prompt based on file type
    let promptText = "Analyze this image and extract all the textual information.";
    
    let languageInstructions = '';
    if (language === 'hindi') {
      languageInstructions = 'Return the extracted content in Hindi language.';
    } else if (language === 'hinglish') {
      languageInstructions = 'Return the extracted content in Hinglish language (mix of Hindi and English words like "kya kar rhe ho"). Use Roman script with Hindi words rather than Devanagari script.';
    }
    
    promptText += " " + languageInstructions;
    
    // Create the request to Gemini with the image data
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: promptText
            },
            {
              inline_data: {
                mime_type: fileType || "image/jpeg",
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("API error details:", errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini response:", data);
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content returned from Gemini API');
    }

    toast.success("Image analyzed successfully");
    return content;
  } catch (error) {
    console.error('Image analysis error:', error);
    toast.error('Failed to analyze image. Please try a different image or check your network connection.');
    return null;
  }
}

export async function processExtractedText(text: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  toast.info("Processing text with Gemini...");
  
  try {
    let languageInstructions = '';
    if (language === 'hindi') {
      languageInstructions = 'Format and return the processed text in Hindi.';
    } else if (language === 'hinglish') {
      languageInstructions = 'Format and return the processed text in Hinglish (mix of Hindi and English words like "kya kar rhe ho"). Use Roman script with Hindi words rather than Devanagari script.';
    }

    const prompt = `The following is text extracted from an image. 
    Please clean and organize this text into a coherent, well-structured summary:
    
    "${text}"
    
    Format the response with:
    - CAPITALIZED WORDS for main headings
    - CAPITALIZED PHRASES WITH COLON: for subheadings
    - Use bullet points (* or -) for lists where appropriate
    - Use numbered points (1., 2., etc.) for sequential information
    - Use **double asterisks** for important concepts
    - Leave blank lines between paragraphs and sections
    
    ${languageInstructions}
    
    Return only the processed text without any additional commentary.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content returned from API');
    }

    toast.success("Text processed successfully");
    return content;
  } catch (error) {
    console.error('Text processing error:', error);
    toast.error('Failed to process text');
    return null;
  }
}
