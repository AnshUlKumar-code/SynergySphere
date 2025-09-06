"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { AnimatedPage, FadeInUp, StaggerContainer, StaggerItem } from "@/components/animated-page"
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/enhanced-card"
import { SmartTaskSuggestions } from "@/components/smart-task-suggestions"
import { LoadingState } from "@/components/ui/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import { useProjects } from "@/contexts/project-context"
import { Plus, FolderKanban, CheckCircle, Clock, AlertCircle, TrendingUp, Users, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { projects, getAllProjectsStats } = useProjects()
  const router = useRouter()
  const [dashboardStats, setDashboardStats] = useState<{
    totalProjects: number
    totalTasks: number
    completedTasks: number
    overdueTasks: number
  } | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const loadStats = async () => {
      if (projects.length > 0) {
        const stats = await getAllProjectsStats()
        setDashboardStats(stats)
      }
    }
    loadStats()
  }, [projects, getAllProjectsStats])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingState message="Loading your dashboard..." />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalProjects = dashboardStats?.totalProjects || projects.length
  const totalTasks = dashboardStats?.totalTasks || projects.reduce((acc, project) => acc + project.tasks.length, 0)
  const completedTasks =
    dashboardStats?.completedTasks ||
    projects.reduce((acc, project) => acc + project.tasks.filter((task) => task.status === "done").length, 0)
  const overdueTasks = dashboardStats?.overdueTasks || 0
  const inProgressTasks = projects.reduce(
    (acc, project) => acc + project.tasks.filter((task) => task.status === "in-progress").length,
    0,
  )
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const recentProjects = projects.slice(-3).reverse()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AnimatedPage className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <FadeInUp>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-space-grotesk text-3xl font-bold text-foreground">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </FadeInUp>

        {/* Stats Cards */}
        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StaggerItem>
              <EnhancedCard glassmorphism className="border-primary/20">
                <EnhancedCardHeader>
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-medium">Total Projects</EnhancedCardTitle>
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="text-2xl font-bold text-primary">{totalProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active projects</p>
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>

            <StaggerItem>
              <EnhancedCard glassmorphism className="border-green-500/20">
                <EnhancedCardHeader>
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-medium">Total Tasks</EnhancedCardTitle>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground mt-1">{completedTasks} completed</p>
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>

            <StaggerItem>
              <EnhancedCard glassmorphism className="border-orange-500/20">
                <EnhancedCardHeader>
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-medium">In Progress</EnhancedCardTitle>
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{inProgressTasks}</div>
                  <p className="text-xs text-muted-foreground mt-1">Tasks in progress</p>
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>

            <StaggerItem>
              <EnhancedCard glassmorphism className="border-secondary/20">
                <EnhancedCardHeader>
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-medium">Completion Rate</EnhancedCardTitle>
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="text-2xl font-bold text-secondary">{completionRate}%</div>
                  <Progress value={completionRate} className="w-full mt-2" />
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <FadeInUp delay={0.2} className="lg:col-span-2">
            <EnhancedCard neumorphism>
              <EnhancedCardHeader>
                <div className="flex items-center justify-between">
                  <EnhancedCardTitle className="font-space-grotesk flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recent Projects
                  </EnhancedCardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/projects">View All</Link>
                  </Button>
                </div>
                <CardDescription>Your most recently created projects</CardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => {
                      const projectCompletedTasks = project.tasks.filter((task) => task.status === "done").length
                      const projectTotalTasks = project.tasks.length
                      const projectProgress =
                        projectTotalTasks > 0 ? Math.round((projectCompletedTasks / projectTotalTasks) * 100) : 0

                      return (
                        <FadeInUp key={project.id} delay={0.1 * index}>
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-300 hover:shadow-md">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                  <FolderKanban className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-medium truncate">{project.name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
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
                        </FadeInUp>
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
              </EnhancedCardContent>
            </EnhancedCard>
          </FadeInUp>

          {/* Sidebar */}
          <div className="space-y-6">
            <FadeInUp delay={0.3}>
              <SmartTaskSuggestions projects={projects} />
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <EnhancedCard glassmorphism>
                <EnhancedCardHeader>
                  <EnhancedCardTitle className="font-space-grotesk">Quick Actions</EnhancedCardTitle>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-3">
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
                    <Link href="/messages">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Assistant
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                    <Link href="/profile">
                      <Users className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </EnhancedCardContent>
              </EnhancedCard>
            </FadeInUp>

            {overdueTasks > 0 && (
              <FadeInUp delay={0.5}>
                <EnhancedCard className="border-destructive/50 bg-destructive/5">
                  <EnhancedCardHeader>
                    <EnhancedCardTitle className="font-space-grotesk text-destructive flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Attention Needed
                    </EnhancedCardTitle>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <p className="text-sm">
                      You have {overdueTasks} overdue task{overdueTasks > 1 ? "s" : ""} that need attention.
                    </p>
                    <Button asChild size="sm" className="mt-3">
                      <Link href="/projects">Review Tasks</Link>
                    </Button>
                  </EnhancedCardContent>
                </EnhancedCard>
              </FadeInUp>
            )}

            <FadeInUp delay={0.6}>
              <EnhancedCard neumorphism>
                <EnhancedCardHeader>
                  <EnhancedCardTitle className="font-space-grotesk">This Week</EnhancedCardTitle>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-3">
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
                    <Badge
