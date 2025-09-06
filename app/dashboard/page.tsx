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
import { Plus, FolderKanban, CheckCircle, Clock, AlertCircle, TrendingUp, Users } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { projects } = useProjects()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

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

  // Calculate dashboard stats
  const totalProjects = projects.length
  const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0)
  const completedTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter((task) => task.status === "done").length,
    0,
  )
  const inProgressTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter((task) => task.status === "in-progress").length,
    0,
  )
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get recent projects (last 3)
  const recentProjects = projects.slice(-3).reverse()

  // Get overdue tasks (mock - in real app would check actual dates)
  const overdueTasks = projects.reduce((acc, project) => {
    const overdue = project.tasks.filter((task) => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      const today = new Date()
      return dueDate < today && task.status !== "done"
    })
    return acc + overdue.length
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-space-grotesk text-3xl font-bold text-foreground">Welcome back, {user.name}</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
          </div>
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">{completedTasks} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-space-grotesk">Recent Projects</CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/projects">View All</Link>
                  </Button>
                </div>
                <CardDescription>Your most recently created projects</CardDescription>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project) => {
                      const projectCompletedTasks = project.tasks.filter((task) => task.status === "done").length
                      const projectTotalTasks = project.tasks.length
                      const projectProgress =
                        projectTotalTasks > 0 ? Math.round((projectCompletedTasks / projectTotalTasks) * 100) : 0

                      return (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FolderKanban className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Progress value={projectProgress} className="w-20" />
                                <span className="text-xs text-muted-foreground">{projectProgress}%</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {projectTotalTasks} tasks
                              </Badge>
                            </div>
                          </div>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/projects/${project.id}`}>View</Link>
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No projects yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create your first project to get started</p>
                    <Button asChild>
                      <Link href="/projects/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/projects">
                    <FolderKanban className="mr-2 h-4 w-4" />
                    View All Projects
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            {overdueTasks > 0 && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="font-space-grotesk text-destructive flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Attention Needed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    You have {overdueTasks} overdue task{overdueTasks > 1 ? "s" : ""} that need attention.
                  </p>
                  <Button asChild size="sm" className="mt-3">
                    <Link href="/projects">Review Tasks</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tasks completed</span>
                  <Badge variant="secondary">{completedTasks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Projects active</span>
                  <Badge variant="secondary">{totalProjects}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall progress</span>
                  <Badge variant="secondary">{completionRate}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
