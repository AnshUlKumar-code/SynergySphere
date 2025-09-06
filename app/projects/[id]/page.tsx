"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useProjects } from "@/contexts/project-context"
import { ArrowLeft, FolderKanban, Plus, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const { projects, selectProject, currentProject } = useProjects()
  const router = useRouter()

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

  const completedTasks = currentProject.tasks.filter((task) => task.status === "done").length
  const inProgressTasks = currentProject.tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = currentProject.tasks.filter((task) => task.status === "todo").length
  const totalTasks = currentProject.tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const createdDate = new Date(currentProject.createdAt).toLocaleDateString()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-space-grotesk text-3xl font-bold text-foreground">{currentProject.name}</h1>
                <p className="text-muted-foreground mt-1">{currentProject.description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href={`/projects/${currentProject.id}/board`}>View Board</Link>
              </Button>
              <Button asChild>
                <Link href={`/projects/${currentProject.id}/board`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">All tasks in project</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{todoTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks to do</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Project Overview</CardTitle>
                <CardDescription>Track your project progress and key metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {/* Recent Tasks */}
                <div>
                  <h3 className="font-medium mb-3">Recent Tasks</h3>
                  {currentProject.tasks.length > 0 ? (
                    <div className="space-y-3">
                      {currentProject.tasks
                        .slice(-5)
                        .reverse()
                        .map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  task.status === "done"
                                    ? "bg-green-500"
                                    : task.status === "in-progress"
                                      ? "bg-blue-500"
                                      : "bg-orange-500"
                                }`}
                              />
                              <div>
                                <p className="font-medium text-sm">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.description}</p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                task.status === "done"
                                  ? "default"
                                  : task.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {task.status === "in-progress"
                                ? "In Progress"
                                : task.status === "done"
                                  ? "Done"
                                  : "To Do"}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No tasks yet</p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href={`/projects/${currentProject.id}/board`}>Add First Task</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{createdDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tasks:</span>
                  <span>{totalTasks}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Progress:</span>
                  <span>{progress}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href={`/projects/${currentProject.id}/board`}>
                    <FolderKanban className="mr-2 h-4 w-4" />
                    Open Kanban Board
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href={`/messages?project=${currentProject.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Project Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
