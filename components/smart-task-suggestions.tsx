"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Lightbulb, ExternalLink } from "lucide-react"
import { getSmartTaskSuggestions } from "@/lib/ai-mock"
import type { Project, Task } from "@/lib/mock-api"
import Link from "next/link"

interface SmartTaskSuggestionsProps {
  projects: Project[]
  className?: string
}

export function SmartTaskSuggestions({ projects, className }: SmartTaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    urgentTasks: Array<Task & { projectName: string; projectId: string }>
    priorityTasks: Array<Task & { projectName: string; projectId: string }>
    suggestions: string[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSuggestions = async () => {
      if (projects.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        const result = await getSmartTaskSuggestions(projects)
        setSuggestions(result)
      } catch (error) {
        console.error("Error loading suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSuggestions()
  }, [projects])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Analyzing your projects...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!suggestions || projects.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Create some projects and tasks to get AI-powered suggestions!
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} overdue`
    } else if (diffDays === 0) {
      return "Due today"
    } else if (diffDays === 1) {
      return "Due tomorrow"
    } else {
      return `Due in ${diffDays} days`
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Suggestions */}
        {suggestions.suggestions.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              AI Insights
            </h4>
            <div className="space-y-2">
              {suggestions.suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Urgent Tasks */}
        {suggestions.urgentTasks.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Urgent Tasks
            </h4>
            <div className="space-y-2">
              {suggestions.urgentTasks.map((task) => (
                <div
                  key={`${task.projectId}-${task.id}`}
                  className="p-3 border border-destructive/20 rounded-lg bg-destructive/5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm truncate">{task.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{task.projectName}</p>
                      {task.dueDate && (
                        <Badge variant="destructive" className="mt-2 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDueDate(task.dueDate)}
                        </Badge>
                      )}
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/projects/${task.projectId}/board`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority Tasks */}
        {suggestions.priorityTasks.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              High Priority Tasks
            </h4>
            <div className="space-y-2">
              {suggestions.priorityTasks.slice(0, 3).map((task) => (
                <div
                  key={`${task.projectId}-${task.id}`}
                  className="p-3 border border-secondary/20 rounded-lg bg-secondary/5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm truncate">{task.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{task.projectName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          High Priority
                        </Badge>
                        {task.dueDate && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDueDate(task.dueDate)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/projects/${task.projectId}/board`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
