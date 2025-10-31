"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAptitudeQuiz } from "@/actions/interview";
import { aptitudeCategories } from "@/data/aptitude-questions";
import { Brain, Target, Clock, Trophy, Shuffle } from "lucide-react";
import Link from "next/link";
import AptitudeStats from "./_components/aptitude-stats";

export default function AptitudeQuiz() {
  const [selectedCategory, setSelectedCategory] = useState("mixed");
  const [selectedDifficulty, setSelectedDifficulty] = useState("mixed");
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateAptitudeQuiz(
        selectedCategory, 
        selectedDifficulty, 
        questionCount
      );
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setAnswers([]);
      setScore(0);
      setShowResults(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setShowResults(false);
    setError(null);
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 80) return { level: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 70) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-50" };
  };

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    const performance = getPerformanceLevel(percentage);
    
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl">Aptitude Quiz Results</CardTitle>
            <p className="text-muted-foreground">
              {aptitudeCategories[selectedCategory]?.name || "Mixed Aptitude"} Assessment
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className={`p-6 rounded-lg ${performance.bg}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${performance.color}`}>
                  {percentage.toFixed(1)}%
                </div>
                <div className={`text-xl font-semibold mb-2 ${performance.color}`}>
                  {performance.level}
                </div>
                <div className="text-muted-foreground">
                  {score} out of {questions.length} questions correct
                </div>
              </div>
              <Progress value={percentage} className="h-3 mt-4" />
            </div>

            {/* Category and Difficulty Info */}
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="text-sm">
                {aptitudeCategories[selectedCategory]?.name || "Mixed"}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Level
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button onClick={resetQuiz} size="lg" className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                New Quiz
              </Button>
              <Button onClick={() => window.location.reload()} size="lg" variant="outline">
                Try Again
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analytics */}
        <div className="mt-8">
          <AptitudeStats 
            questions={questions} 
            answers={answers} 
            score={score}
            category={selectedCategory}
          />
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Aptitude Quiz
                </CardTitle>
                <p className="text-muted-foreground">
                  {aptitudeCategories[selectedCategory]?.name || "Mixed Aptitude"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={progress} className="w-24 h-2" />
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold flex-1">{question.question}</h2>
                <div className="flex gap-2 ml-4">
                  <Badge variant="secondary" className="text-xs">
                    {question.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {question.category}
                  </Badge>
                </div>
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto hover:bg-primary/5"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{score} Correct</span>
              <span>{currentQuestion} of {questions.length} Complete</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Aptitude Assessment</CardTitle>
          <p className="text-muted-foreground">
            Test your cognitive abilities with dynamic AI-generated questions
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Quiz Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Aptitude</SelectItem>
                  <SelectItem value="quantitative">Quantitative</SelectItem>
                  <SelectItem value="logical">Logical Reasoning</SelectItem>
                  <SelectItem value="verbal">Verbal Reasoning</SelectItem>
                  <SelectItem value="technical">Technical Aptitude</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Difficulty</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Questions</label>
              <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(aptitudeCategories).map(([key, category]) => (
              <div key={key} className="p-4 border rounded-lg">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
              </div>
            ))}
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button 
              onClick={startQuiz} 
              size="lg" 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Start Aptitude Quiz
                </>
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4">
              <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">AI-Generated</h3>
              <p className="text-sm text-muted-foreground">Dynamic questions powered by Gemini AI</p>
            </div>
            <div className="text-center p-4">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Personalized</h3>
              <p className="text-sm text-muted-foreground">Customized difficulty and categories</p>
            </div>
            <div className="text-center p-4">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Comprehensive</h3>
              <p className="text-sm text-muted-foreground">Multiple aptitude categories covered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
