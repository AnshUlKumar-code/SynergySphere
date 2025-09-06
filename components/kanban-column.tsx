"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedTaskCard } from "@/components/enhanced-task-card"
import { useDragDrop } from "@/components/drag-drop-context"
import { useProjects, type Task } from "@/contexts/project-context"
import { useToast } from "@/hooks/use-toast"
import { toastMessages } from "@/lib/toast-utils"
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface KanbanColumnProps {
  title: string
  status: Task["status"]
  tasks: Task[]
  color: string
  headerColor: string
  projectId: string
  onAddTask: () => void
  onEditTask: (task: Task) => void
}

export function KanbanColumn({
  title,
  status,
  tasks,
  color,
  headerColor,
  projectId,
  onAddTask,
  onEditTask,
}: KanbanColumnProps) {
  const { moveTask } = useProjects()
  const { draggedItem, dragOverColumn, setDragOverColumn } = useDragDrop()
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
    setDragOverColumn(status)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set drag over to false if we're leaving the column entirely
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
      setDragOverColumn(null)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragOverColumn(null)

    if (draggedItem && draggedItem.status !== status) {
      const success = await moveTask(projectId, draggedItem.id, status)
      if (success) {
        toastMessages.task.moved(status.replace("-", " "))
      } else {
        toastMessages.task.error()
      }
    }
  }

  const getColumnIcon = () => {
    switch (status) {
      case "todo":
        return <AlertCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "done":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const isHighlighted = dragOverColumn === status && draggedItem?.status !== status

  return (
    <motion.div
      layout
      className={`rounded-lg p-4 transition-all duration-300 min-h-[600px] ${color} ${
        isDragOver && isHighlighted ? "ring-2 ring-primary ring-offset-2 scale-[1.02]" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Column Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <span className={headerColor}>{getColumnIcon()}</span>
          <h2 className={`font-space-grotesk text-lg font-semibold ${headerColor}`}>{title}</h2>
          <motion.div
            key={tasks.length}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </motion.div>
        </div>
        {status === "todo" && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button size="sm" variant="ghost" onClick={onAddTask}>
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Drop Zone Indicator */}
      <AnimatePresence>
        {isDragOver && isHighlighted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 p-4 border-2 border-dashed border-primary rounded-lg bg-primary/5"
          >
            <p className="text-center text-sm text-primary font-medium">Drop task here</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <EnhancedTaskCard key={task.id} task={task} onEdit={onEditTask} projectId={projectId} index={index} />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              {getColumnIcon()}
            </motion.div>
            <p className="text-sm mt-2">No tasks in {title.toLowerCase()}</p>
            {status === "todo" && (
              <Button size="sm" variant="ghost" className="mt-2" onClick={onAddTask}>
                <Plus className="mr-2 h-4 w-4" />
                Add first task
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
