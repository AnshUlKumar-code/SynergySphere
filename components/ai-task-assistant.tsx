"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Plus } from "lucide-react"
import { generateTaskFromPrompt } from "@/lib/ai-mock"
import type { Task } from "@/lib/mock-api"

interface AITaskAssistantProps {
  onTaskGenerated: (task: Omit<Task, "id" | "createdAt">) => void
  className?: string
}

export function AITaskAssistant({ onTaskGenerated, className }: AITaskAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTask, setGeneratedTask] = useState<{
    task: Omit<Task, "id" | "createdAt">
    aiResponse: string
  } | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const result = await generateTaskFromPrompt(prompt)
      setGeneratedTask(result)
    } catch (error) {
      console.error("Error generating task:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddTask = () => {
    if (generatedTask) {
      onTaskGenerated(generatedTask.task)
      setGeneratedTask(null)
      setPrompt("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isGenerating) {
      handleGenerate()
    }
  }

  const examplePrompts = [
    "Create a task for designing a landing page",
    "Add a task to implement user authentication",
    "Generate a task for writing unit tests",
    "Create a task for database setup",
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Task Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe the task you need (e.g., 'Create a task for designing a landing page')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isGenerating}
          />
          <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>

        {!generatedTask && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        )}

        {generatedTask && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground italic">{generatedTask.aiResponse}</p>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium">{generatedTask.task.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{generatedTask.task.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    generatedTask.task.priority === "high"
                      ? "destructive"
                      : generatedTask.task.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {generatedTask.task.priority} priority
                </Badge>
                {generatedTask.task.dueDate && (
                  <Badge variant="outline">Due {new Date(generatedTask.task.dueDate).toLocaleDateString()}</Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddTask} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
                <Button variant="outline" size="sm" onClick={() => setGeneratedTask(null)}>
                  Generate Another
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
