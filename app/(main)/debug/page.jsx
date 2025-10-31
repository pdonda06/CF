"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { testAIConnection } from "@/actions/interview";

export default function DebugPage() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const result = await testAIConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI Connection Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleTest} disabled={loading}>
            {loading ? "Testing..." : "Test AI Connection"}
          </Button>

          {testResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <Badge variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? "Success" : "Failed"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span>API Key Set:</span>
                <Badge variant={testResult.apiKeySet ? "default" : "destructive"}>
                  {testResult.apiKeySet ? "Yes" : "No"}
                </Badge>
              </div>

              {testResult.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {testResult.error}
                  </p>
                </div>
              )}

              {testResult.response && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Response:</strong> {testResult.response}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
            <ul className="text-sm space-y-1">
              <li>1. Check if GEMINI_API_KEY is set in your environment variables</li>
              <li>2. Verify the API key is valid and has sufficient quota</li>
              <li>3. Check the browser console for detailed error logs</li>
              <li>4. Ensure your network connection is stable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
