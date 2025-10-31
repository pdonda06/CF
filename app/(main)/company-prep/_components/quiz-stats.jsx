"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Target, TrendingUp, Award } from "lucide-react";

export default function QuizStats({ questions, answers, score }) {
  // Calculate category-wise performance
  const categoryStats = {};
  const difficultyStats = { easy: 0, medium: 0, hard: 0 };
  const difficultyCorrect = { easy: 0, medium: 0, hard: 0 };

  questions.forEach((question, index) => {
    const isCorrect = answers[index] === question.correctAnswer;
    
    // Category stats
    if (!categoryStats[question.category]) {
      categoryStats[question.category] = { total: 0, correct: 0 };
    }
    categoryStats[question.category].total++;
    if (isCorrect) {
      categoryStats[question.category].correct++;
    }

    // Difficulty stats
    difficultyStats[question.difficulty]++;
    if (isCorrect) {
      difficultyCorrect[question.difficulty]++;
    }
  });

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) return { variant: "default", text: "Excellent" };
    if (percentage >= 80) return { variant: "secondary", text: "Good" };
    if (percentage >= 60) return { variant: "outline", text: "Fair" };
    return { variant: "destructive", text: "Needs Improvement" };
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{score}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{questions.length}</div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getPerformanceColor((score / questions.length) * 100)}`}>
                {((score / questions.length) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(score / questions.length) * 100} className="h-2" />
          </div>
          <div className="mt-2 text-center">
            <Badge variant={getPerformanceBadge((score / questions.length) * 100).variant}>
              {getPerformanceBadge((score / questions.length) * 100).text}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = (stats.correct / stats.total) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <span className={`text-sm font-bold ${getPerformanceColor(percentage)}`}>
                      {stats.correct}/{stats.total} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance by Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(difficultyStats).map(([difficulty, total]) => {
              const correct = difficultyCorrect[difficulty];
              const percentage = total > 0 ? (correct / total) * 100 : 0;
              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {difficulty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {correct}/{total} questions
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${getPerformanceColor(percentage)}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const percentage = (stats.correct / stats.total) * 100;
              if (percentage < 70) {
                return (
                  <div key={category} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Focus on {category}:</strong> Consider reviewing concepts in this area to improve your performance.
                    </p>
                  </div>
                );
              }
              return null;
            })}
            {Object.entries(difficultyStats).map(([difficulty, total]) => {
              const correct = difficultyCorrect[difficulty];
              const percentage = total > 0 ? (correct / total) * 100 : 0;
              if (percentage < 60 && total > 0) {
                return (
                  <div key={difficulty} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Practice {difficulty} questions:</strong> You may need more practice with {difficulty} level questions.
                    </p>
                  </div>
                );
              }
              return null;
            })}
            {Object.values(categoryStats).every(stats => (stats.correct / stats.total) * 100 >= 80) && 
             Object.values(difficultyStats).every((total, index) => {
               const difficulty = Object.keys(difficultyStats)[index];
               const correct = difficultyCorrect[difficulty];
               return total === 0 || (correct / total) * 100 >= 70;
             }) && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Excellent performance!</strong> You're well-prepared for interviews at this company.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
