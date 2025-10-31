import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      
      {/* Quiz Type Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Choose Your Preparation Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/interview/mock">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Target className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-lg">Technical Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  AI-generated technical questions based on your skills and industry
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/aptitude">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Brain className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-lg">Aptitude Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Dynamic aptitude questions covering quantitative, logical, and verbal reasoning
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/company-prep">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-lg">Company Prep</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Company-specific questions and preparation for top Surat tech companies
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/interview/mock">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle className="text-lg">Mock Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Simulate real interview conditions with comprehensive assessments
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
