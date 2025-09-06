"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProjects, type Task } from "@/contexts/project-context"
import { useDragDrop } from "@/components/drag-drop-context"
import { useToast } from "@/hooks/use-toast"
import { toastMessages } from "@/lib/toast-utils"
import { MoreHorizontal, Calendar, User, Trash2, Edit, Clock, GripVertical, AlertTriangle } from "lucide-react"

interface EnhancedTaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  projectId: string
  index: number
}

export function EnhancedTaskCard({ task, onEdit, projectId, index }: EnhancedTaskCardProps) {
  const { deleteTask } = useProjects()
  const { draggedItem, setDraggedItem, isDragging } = useDragDrop()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem(task)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", task.id)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      const success = await deleteTask(projectId, task.id)
      if (success) {
        toastMessages.task.deleted()
      } else {
        toastMessages.task.error()
      }
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done"
  const dueDateFormatted = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null
  const isBeingDragged = draggedItem?.id === task.id

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500"
      case "medium":
        return "border-l-4 border-l-yellow-500"
      case "low":
        return "border-l-4 border-l-green-500"
      default:
        return "border-l-4 border-l-gray-300"
    }
  }

  const getPriorityBadgeVariant = (priority?: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isBeingDragged ? 0.5 : 1,
        y: 0,
        scale: isBeingDragged ? 1.05 : 1,
        rotate: isBeingDragged ? 2 : 0,
        zIndex: isBeingDragged ? 50 : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`cursor-move transition-all duration-200 hover:shadow-lg ${
          isOverdue ? "border-destructive shadow-destructive/20" : ""
        } ${getPriorityColor(task.priority)} glassmorphism`}
      >
        <CardContent className="p-4">
          {/* Drag Handle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="flex items-center justify-between mb-2"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Task Title */}
          <div className="flex items-start gap-2 mb-2">
            {isOverdue && <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />}
            <h3 className="font-medium text-sm leading-tight line-clamp-2 flex-1">{task.title}</h3>
          </div>

          {/* Task Description */}
          {task.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>}

          {/* Priority Badge */}
          {task.priority && (
            <div className="mb-3">
              <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                {task.priority} priority
              </Badge>
            </div>
          )}

          {/* Task Meta */}
          <div className="space-y-2">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{task.assignee}</span>
              </div>
            )}

            {dueDateFormatted && (
              <div className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                <span className="text-xs">{dueDateFormatted}</span>
              </div>
            )}
          </div>

          {/* Overdue Badge */}
          {isOverdue && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
              <Badge variant="destructive" className="text-xs animate-pulse">
                Overdue
              </Badge>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
