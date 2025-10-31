"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CompanyPrepCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Company Preparation</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">Companies</div>
        <p className="text-xs text-muted-foreground mb-4">
          Practice company-specific interview questions and technical assessments
        </p>
        <Link href="/company-prep">
          <Button className="w-full">
            Start Preparation
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
