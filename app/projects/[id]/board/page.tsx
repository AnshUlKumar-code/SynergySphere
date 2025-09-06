"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { TaskModal } from "@/components/task-modal"
import { AITaskAssistant } from "@/components/ai-task-assistant"
import { AIProjectSummary } from "@/components/ai-project-summary"
import { KanbanColumn } from "@/components/kanban-column"
import { DragDropProvider } from "@/components/drag-drop-context"
import { AnimatedPage, FadeInUp } from "@/components/animated-page"
import { LoadingState } from "@/components/ui/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import { useProjects, type Task } from "@/contexts/project-context"
import { useToast } from "@/hooks/use-toast"
import { toastMessages } from "@/lib/toast-utils"
import { ArrowLeft, Plus, FolderKanban } from "lucide-react"

export default function ProjectBoardPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const { projects, selectProject, currentProject, addTask } = useProjects()
  const { toast } = useToast()
  const router = useRouter()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingState message="Loading project board..." />
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

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  const handleAITaskGenerated = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const success = await addTask(currentProject.id, taskData)
    if (success) {
      toastMessages.ai.taskGenerated()
    } else {
      toastMessages.ai.error()
    }
  }

  const columns = [
    {
      title: "To Do",
      status: "todo" as const,
      tasks: todoTasks,
      color: "bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200/50 dark:border-orange-800/50",
      headerColor: "text-orange-700 dark:text-orange-300",
    },
    {
      title: "In Progress",
      status: "in-progress" as const,
      tasks: inProgressTasks,
      color: "bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/50",
      headerColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Done",
      status: "done" as const,
      tasks: doneTasks,
      color: "bg-green-50/50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/50",
      headerColor: "text-green-700 dark:text-green-300",
    },
  ]

  return (
    <DragDropProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        <AnimatedPage className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <FadeInUp>
            <div className="mb-8">
              <Link
                href={`/projects/${currentProject.id}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Project
              </Link>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <FolderKanban className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-space-grotesk text-3xl font-bold text-foreground">{currentProject.name}</h1>
                    <p className="text-muted-foreground mt-1">Kanban Board</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsTaskModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* AI Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <FadeInUp delay={0.1}>
              <AITaskAssistant onTaskGenerated={handleAITaskGenerated} />
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <AIProjectSummary project={currentProject} />
            </FadeInUp>
          </div>

          {/* Kanban Board */}
          <FadeInUp delay={0.3}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {columns.map((column, index) => (
                <FadeInUp key={column.status} delay={0.4 + index * 0.1}>
                  <KanbanColumn
                    title={column.title}
                    status={column.status}
                    tasks={column.tasks}
                    color={column.color}
                    headerColor={column.headerColor}
                    projectId={currentProject.id}
                    onAddTask={() => setIsTaskModalOpen(true)}
                    onEditTask={handleEditTask}
                  />
                </FadeInUp>
              ))}
            </div>
          </FadeInUp>
        </AnimatedPage>

        {/* Task Modal */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseModal}
          projectId={currentProject.id}
          editingTask={editingTask}
        />
      </div>
    </DragDropProvider>
  )
}
