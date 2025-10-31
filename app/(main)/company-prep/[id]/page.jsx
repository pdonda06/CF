"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { suratCompanies, commonTechnicalQuestions, getRandomQuestions, getMixedDifficultyQuestions } from "@/data/surat-companies";
import { ArrowLeft, CheckCircle2, XCircle, Shuffle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import QuizStats from "../_components/quiz-stats";

export default function CompanyQuiz({ params }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizMode, setQuizMode] = useState("mixed"); // mixed, company-only, technical-only
  const [userAnswers, setUserAnswers] = useState([]);

  const company = suratCompanies.find((c) => c.id === parseInt(params.id));
  
  // Initialize questions based on mode
  useEffect(() => {
    let questions = [];
    switch (quizMode) {
      case "company-only":
        questions = getRandomQuestions(company.quiz, 10);
        break;
      case "technical-only":
        questions = getRandomQuestions(commonTechnicalQuestions, 10);
        break;
      case "mixed":
      default:
        const allQuestions = [...company.quiz, ...commonTechnicalQuestions];
        questions = getMixedDifficultyQuestions(allQuestions, 12);
        break;
    }
    setSelectedQuestions(questions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setUserAnswers([]);
  }, [company, quizMode]);

  const handleAnswer = (selectedAnswer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (selectedAnswer === selectedQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const shuffleQuestions = () => {
    const allQuestions = [...company.quiz, ...commonTechnicalQuestions];
    const newQuestions = getMixedDifficultyQuestions(allQuestions, 12);
    setSelectedQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setUserAnswers([]);
  };

  if (!company) {
    return <div>Company not found</div>;
  }

  if (showResults) {
    const percentage = (score / selectedQuestions.length) * 100;
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <Link href="/company-prep">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Company</span>
              <span className="font-semibold">{company.name}</span>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Quiz Results</h2>
            <p className="text-muted-foreground">
              You've completed the preparation quiz for {company.name}
            </p>
            <Badge variant="outline" className="mt-2">
              {quizMode === "mixed" ? "Mixed Questions" : 
               quizMode === "company-only" ? "Company Specific" : "Technical Only"}
            </Badge>
          </div>

          <div className="bg-muted/30 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">{score}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{selectedQuestions.length}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{percentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>
          </div>

          <Progress value={percentage} className="h-2 mb-6" />

          <div className="flex gap-3 justify-center">
            <Button onClick={shuffleQuestions} size="lg" className="flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              New Questions
            </Button>
            <Button onClick={() => window.location.reload()} size="lg" variant="outline">
              Try Again
            </Button>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                Visit Company Website
              </Button>
            </a>
          </div>
        </Card>

        {/* Detailed Statistics */}
        <div className="mt-8">
          <QuizStats 
            questions={selectedQuestions} 
            answers={userAnswers} 
            score={score} 
          />
        </div>
      </div>
    );
  }

  if (selectedQuestions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Questions...</h2>
            <p className="text-muted-foreground">Preparing your personalized quiz</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Link href="/company-prep">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Company</span>
              <span className="font-semibold">{company.name}</span>
            </div>
            <Select value={quizMode} onValueChange={setQuizMode}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed Questions</SelectItem>
                <SelectItem value="company-only">Company Specific</SelectItem>
                <SelectItem value="technical-only">Technical Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {selectedQuestions.length}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{((currentQuestion / selectedQuestions.length) * 100).toFixed(0)}%</span>
              <Progress
                value={(currentQuestion / selectedQuestions.length) * 100}
                className="w-24"
              />
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold flex-1">
              {selectedQuestions[currentQuestion].question}
            </h2>
            <div className="flex gap-2 ml-4">
              <Badge variant="secondary" className="text-xs">
                {selectedQuestions[currentQuestion].difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedQuestions[currentQuestion].category}
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            {selectedQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start p-4 h-auto hover:bg-primary/5"
                onClick={() => handleAnswer(index)}
              >
                <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{score} Correct</span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={shuffleQuestions}
              className="flex items-center gap-1"
            >
              <Shuffle className="h-3 w-3" />
              Shuffle
            </Button>
            <span>{currentQuestion} of {selectedQuestions.length} Complete</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
