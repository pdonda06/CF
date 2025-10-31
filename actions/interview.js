"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { commonTechnicalQuestions } from "@/data/surat-companies";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  // Check if API key is available
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    throw new Error("AI service is not configured");
  }

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    console.log("Generating quiz with prompt:", prompt.substring(0, 100) + "...");
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("Raw AI response:", text.substring(0, 200) + "...");
    
    // Clean the response text
    let cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    console.log("Cleaned text:", cleanedText.substring(0, 200) + "...");
    
    const quiz = JSON.parse(cleanedText);
    
    // Validate the response structure
    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      throw new Error("Invalid response structure from AI");
    }
    
    // Validate each question
    for (const question of quiz.questions) {
      if (!question.question || !question.options || !Array.isArray(question.options) || 
          question.options.length !== 4 || !question.correctAnswer || !question.explanation) {
        throw new Error("Invalid question structure from AI");
      }
    }

    console.log("Successfully generated quiz with", quiz.questions.length, "questions");
    return quiz.questions;
    
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    // Fallback to static questions if AI generation fails
    console.log("Falling back to static questions due to AI generation failure");
    
    try {
      // Return a subset of static questions as fallback
      const fallbackQuestions = commonTechnicalQuestions.slice(0, 10).map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer],
        explanation: `This is a ${q.difficulty} level question about ${q.category}. The correct answer is ${q.options[q.correctAnswer]}.`
      }));
      
      console.log("Using fallback questions:", fallbackQuestions.length);
      return fallbackQuestions;
      
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      
      // Provide more specific error messages
      if (error.message.includes("API key")) {
        throw new Error("AI service authentication failed. Please check your API key.");
      } else if (error.message.includes("quota") || error.message.includes("limit")) {
        throw new Error("AI service quota exceeded. Please try again later.");
      } else if (error.message.includes("JSON")) {
        throw new Error("Failed to parse AI response. Please try again.");
      } else {
        throw new Error(`Failed to generate quiz questions: ${error.message}`);
      }
    }
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}

// Generate dynamic aptitude questions using Gemini AI
export async function generateAptitudeQuiz(category = 'mixed', difficulty = 'mixed', count = 10) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Check if API key is available
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    throw new Error("AI service is not configured");
  }

  const categoryDescriptions = {
    quantitative: "mathematical reasoning, arithmetic, algebra, geometry, statistics, and probability",
    logical: "logical reasoning, pattern recognition, sequences, analogies, and critical thinking",
    verbal: "language comprehension, vocabulary, grammar, reading comprehension, and verbal reasoning",
    technical: "technical problem-solving, data structures, algorithms, system design, and programming concepts",
    mixed: "a combination of quantitative, logical, verbal, and technical aptitude questions"
  };

  const difficultyDescriptions = {
    easy: "beginner level questions suitable for entry-level positions",
    medium: "intermediate level questions suitable for mid-level positions", 
    hard: "advanced level questions suitable for senior positions",
    mixed: "a balanced mix of easy, medium, and hard questions"
  };

  const prompt = `
    Generate ${count} aptitude interview questions for ${categoryDescriptions[category]}.
    Difficulty level: ${difficultyDescriptions[difficulty]}.
    
    Each question should be multiple choice with exactly 4 options.
    Make questions practical and relevant to real-world scenarios.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string (the correct option text)",
          "explanation": "string (detailed explanation of why this answer is correct)",
          "difficulty": "easy|medium|hard",
          "category": "string (specific topic within the main category)"
        }
      ]
    }
  `;

  try {
    console.log("Generating aptitude quiz with prompt:", prompt.substring(0, 100) + "...");
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("Raw AI response:", text.substring(0, 200) + "...");
    
    // Clean the response text
    let cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    console.log("Cleaned text:", cleanedText.substring(0, 200) + "...");
    
    const quiz = JSON.parse(cleanedText);
    
    // Validate the response structure
    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      throw new Error("Invalid response structure from AI");
    }
    
    // Validate each question
    for (const question of quiz.questions) {
      if (!question.question || !question.options || !Array.isArray(question.options) || 
          question.options.length !== 4 || !question.correctAnswer || !question.explanation) {
        throw new Error("Invalid question structure from AI");
      }
    }

    console.log("Successfully generated aptitude quiz with", quiz.questions.length, "questions");
    return quiz.questions;
    
  } catch (error) {
    console.error("Error generating aptitude quiz:", error);
    
    // Fallback to static questions if AI generation fails
    console.log("Falling back to static aptitude questions due to AI generation failure");
    
    try {
      const { getMixedAptitudeQuestions, getAptitudeQuestionsByCategory } = await import("@/data/aptitude-questions");
      
      let fallbackQuestions;
      if (category === 'mixed') {
        fallbackQuestions = getMixedAptitudeQuestions(['quantitative', 'logical', 'verbal'], count);
      } else {
        fallbackQuestions = getAptitudeQuestionsByCategory(category, count);
      }
      
      // Convert to the expected format
      const formattedQuestions = fallbackQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer],
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category
      }));
      
      console.log("Using fallback aptitude questions:", formattedQuestions.length);
      return formattedQuestions;
      
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      
      // Provide more specific error messages
      if (error.message.includes("API key")) {
        throw new Error("AI service authentication failed. Please check your API key.");
      } else if (error.message.includes("quota") || error.message.includes("limit")) {
        throw new Error("AI service quota exceeded. Please try again later.");
      } else if (error.message.includes("JSON")) {
        throw new Error("Failed to parse AI response. Please try again.");
      } else {
        throw new Error(`Failed to generate aptitude questions: ${error.message}`);
      }
    }
  }
}

// Debug function to test AI connection
export async function testAIConnection() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { success: false, error: "GEMINI_API_KEY is not set" };
    }

    const testPrompt = "Generate a simple JSON response: {\"test\": \"success\"}";
    const result = await model.generateContent(testPrompt);
    const response = result.response;
    const text = response.text();
    
    return { 
      success: true, 
      response: text,
      apiKeySet: !!process.env.GEMINI_API_KEY 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      apiKeySet: !!process.env.GEMINI_API_KEY 
    };
  }
}
