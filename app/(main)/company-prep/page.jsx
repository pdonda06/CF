"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { suratCompanies, commonTechnicalQuestions } from "@/data/surat-companies";
import Link from "next/link";
import { ExternalLink, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function CompanyPrep() {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Company-Specific Preparation</h1>
        <p className="text-muted-foreground">
          Prepare for interviews at top Surat tech companies with custom interview questions and assessments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suratCompanies.map((company) => (
          <Card key={company.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                <div className="text-lg font-semibold">
                  {company.name.split(' ')[0][0]}
                </div>
              </div>
                <div className="flex gap-2">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Website
                    </Button>
                  </a>
                  <Link href={`/company-prep/${company.id}`}>
                    <Button size="sm">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      Prepare
                    </Button>
                  </Link>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
              <p className="text-muted-foreground text-sm">{company.description}</p>
            </div>
            <div className="px-6 py-4 bg-muted/50">
              <div className="flex justify-between text-sm">
                <span>{company.quiz.length} Interview Questions</span>
                <span>{commonTechnicalQuestions.length} Technical Questions</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
