"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { TaskModal } from "@/components/task-modal"
import { TaskCard } from "@/components/task-card"
import { useAuth } from "@/contexts/auth-context"
import { useProjects, type Task } from "@/contexts/project-context"
import { ArrowLeft, Plus, FolderKanban } from "lucide-react"

export default function ProjectBoardPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const { projects, selectProject, currentProject, moveTask } = useProjects()
  const router = useRouter()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (params.id) {
      selectProject(params.id)
    }
  }, [params.id, selectProject])

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

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Project not found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const todoTasks = currentProject.tasks.filter((task) => task.status === "todo")
  const inProgressTasks = currentProject.tasks.filter((task) => task.status === "in-progress")
  const doneTasks = currentProject.tasks.filter((task) => task.status === "done")

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      moveTask(currentProject.id, draggedTask.id, newStatus)
    }
    setDraggedTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const columns = [
    {
      title: "To Do",
      status: "todo" as const,
      tasks: todoTasks,
      color: "bg-orange-100 dark:bg-orange-900/20",
      headerColor: "text-orange-700 dark:text-orange-300",
    },
    {
      title: "In Progress",
      status: "in-progress" as const,
      tasks: inProgressTasks,
      color: "bg-blue-100 dark:bg-blue-900/20",
      headerColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Done",
      status: "done" as const,
      tasks: doneTasks,
      color: "bg-green-100 dark:bg-green-900/20",
      headerColor: "text-green-700 dark:text-green-300",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/projects/${currentProject.id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-space-grotesk text-3xl font-bold text-foreground">{currentProject.name}</h1>
                <p className="text-muted-foreground mt-1">Kanban Board</p>
              </div>
            </div>
            <Button onClick={() => setIsTaskModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.status}
              className={`rounded-lg p-4 ${column.color} min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className={`font-space-grotesk text-lg font-semibold ${column.headerColor}`}>{column.title}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks.length}
                  </Badge>
                </div>
                {column.status === "todo" && (
                  <Button size="sm" variant="ghost" onClick={() => setIsTaskModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDragStart={handleDragStart}
                    projectId={currentProject.id}
                  />
                ))}

                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                    {column.status === "todo" && (
                      <Button size="sm" variant="ghost" className="mt-2" onClick={() => setIsTaskModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add first task
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        projectId={currentProject.id}
        editingTask={editingTask}
      />
    </div>
  )
}
