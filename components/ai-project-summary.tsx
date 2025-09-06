"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText, Sparkles } from "lucide-react"
import { summarizeProject, generateProjectInsights } from "@/lib/ai-mock"
import type { Project } from "@/lib/mock-api"

interface AIProjectSummaryProps {
  project: Project
  className?: string
}

export function AIProjectSummary({ project, className }: AIProjectSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [insights, setInsights] = useState<{ insights: string[]; recommendations: string[] } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    try {
      const [summaryResult, insightsResult] = await Promise.all([
        summarizeProject(project),
        generateProjectInsights(project),
      ])
      setSummary(summaryResult)
      setInsights(insightsResult)
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          AI Project Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!summary ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Get an AI-powered analysis of your project progress, insights, and recommendations.
            </p>
            <Button onClick={handleGenerateSummary} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Project...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-sm">{summary}</div>
            </div>

            {insights && (
              <div className="space-y-4">
                {insights.insights.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Insights
                    </h4>
                    <ul className="space-y-1">
                      {insights.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {insights.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSummary(null)
                setInsights(null)
              }}
            >
              Generate New Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
