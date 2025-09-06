"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { ChatMessage } from "@/components/chat-message"
import { useAuth } from "@/contexts/auth-context"
import { useProjects } from "@/contexts/project-context"
import { Send, Bot, Sparkles, FolderKanban } from "lucide-react"

interface Message {
  id: string
  content: string
  isAI: boolean
  timestamp: Date
  projectContext?: string
}

export default function MessagesPage() {
  const { user, isLoading } = useAuth()
  const { projects, currentProject, selectProject } = useProjects()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your AI project assistant. I can help you with task suggestions, project planning, and productivity tips. How can I assist you today?",
      isAI: true,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (projectId) {
      selectProject(projectId)
    }
  }, [projectId, selectProject])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Project-specific responses
    if (currentProject) {
      const completedTasks = currentProject.tasks.filter((task) => task.status === "done").length
      const totalTasks = currentProject.tasks.length
      const inProgressTasks = currentProject.tasks.filter((task) => task.status === "in-progress").length

      if (message.includes("progress") || message.includes("status")) {
        return `Your project "${currentProject.name}" has ${completedTasks} out of ${totalTasks} tasks completed (${Math.round((completedTasks / totalTasks) * 100)}% progress). ${inProgressTasks > 0 ? `You have ${inProgressTasks} tasks in progress.` : ""} ${totalTasks === 0 ? "Consider adding some tasks to get started!" : ""}`
      }

      if (
        message.includes("task") &&
        (message.includes("suggest") || message.includes("add") || message.includes("create"))
      ) {
        const suggestions = [
          `For "${currentProject.name}", consider adding a task for user research and requirements gathering.`,
          `You might want to add a task for testing and quality assurance in "${currentProject.name}".`,
          `Consider creating a task for documentation and user guides for "${currentProject.name}".`,
          `A good next task for "${currentProject.name}" could be setting up monitoring and analytics.`,
          `You should add a task for performance optimization in "${currentProject.name}".`,
        ]
        return suggestions[Math.floor(Math.random() * suggestions.length)]
      }
    }

    // General responses
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! I'm here to help you manage your projects more effectively. What would you like to work on today?"
    }

    if (message.includes("help")) {
      return "I can help you with:\n• Project planning and task breakdown\n• Productivity tips and best practices\n• Task prioritization strategies\n• Team collaboration advice\n• Progress tracking insights\n\nWhat specific area would you like help with?"
    }

    if (message.includes("productivity") || message.includes("efficient")) {
      return "Here are some productivity tips:\n• Break large tasks into smaller, manageable chunks\n• Use the Kanban board to visualize your workflow\n• Set realistic deadlines and stick to them\n• Focus on one task at a time to avoid context switching\n• Review and adjust your priorities regularly"
    }

    if (message.includes("team") || message.includes("collaboration")) {
      return "For better team collaboration:\n• Assign clear ownership to each task\n• Use descriptive task titles and detailed descriptions\n• Set up regular check-ins and progress reviews\n• Encourage transparent communication\n• Celebrate completed milestones together"
    }

    if (message.includes("priority") || message.includes("important")) {
      return "To prioritize tasks effectively:\n• Focus on high-impact, low-effort tasks first\n• Consider deadlines and dependencies\n• Align tasks with your project goals\n• Use the MoSCoW method (Must have, Should have, Could have, Won't have)\n• Review priorities weekly"
    }

    if (message.includes("deadline") || message.includes("time")) {
      return "Time management tips:\n• Set realistic deadlines with buffer time\n• Break down large tasks with intermediate milestones\n• Use time-blocking to focus on specific tasks\n• Track time spent on different activities\n• Don't forget to account for testing and review time"
    }

    if (message.includes("stuck") || message.includes("blocked")) {
      return "When you're stuck:\n• Break the problem into smaller parts\n• Ask for help from team members\n• Take a short break and come back with fresh eyes\n• Document what you've tried so far\n• Consider alternative approaches or solutions"
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting point! Could you tell me more about what specific aspect you'd like help with?",
      "I'd be happy to help! Can you provide more context about your current project or challenge?",
      "Great question! Let me suggest some approaches that might work for your situation.",
      "Based on your projects, I think focusing on task organization and clear priorities would be beneficial.",
      "That sounds like a common challenge in project management. Here's what I'd recommend...",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isAI: false,
      timestamp: new Date(),
      projectContext: currentProject?.name,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: getAIResponse(inputMessage),
      isAI: true,
      timestamp: new Date(),
      projectContext: currentProject?.name,
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickPrompts = [
    "How can I improve my productivity?",
    "Suggest tasks for my current project",
    "Help me prioritize my work",
    "Tips for team collaboration",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-space-grotesk text-3xl font-bold text-foreground">AI Assistant</h1>
              <p className="text-muted-foreground mt-1">Get intelligent help with your project management</p>
            </div>
          </div>

          {currentProject && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Currently discussing: {currentProject.name}</p>
                    <p className="text-sm text-muted-foreground">{currentProject.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="font-space-grotesk flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Chat with AI Assistant
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
              >
                Online
              </Badge>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about project management..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Tips for better conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <h4 className="font-medium mb-1">Be specific</h4>
              <p className="text-muted-foreground">
                Ask about specific projects, tasks, or challenges for more targeted advice.
              </p>
            </div>
            <div className="text-sm">
              <h4 className="font-medium mb-1">Provide context</h4>
              <p className="text-muted-foreground">
                Mention your project details, team size, or deadlines for better recommendations.
              </p>
            </div>
            <div className="text-sm">
              <h4 className="font-medium mb-1">Ask follow-up questions</h4>
              <p className="text-muted-foreground">
                Don't hesitate to ask for clarification or more detailed explanations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
