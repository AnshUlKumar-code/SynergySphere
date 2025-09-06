"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  isAI: boolean
  timestamp: Date
  projectContext?: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth()

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (message.isAI) {
    return (
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 max-w-[80%]">
          <div className="bg-muted rounded-lg p-3">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">AI Assistant</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="flex-1 max-w-[80%] flex flex-col items-end">
        <div className="bg-primary text-primary-foreground rounded-lg p-3">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">You</span>
          {message.projectContext && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{message.projectContext}</span>
            </>
          )}
        </div>
      </div>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
