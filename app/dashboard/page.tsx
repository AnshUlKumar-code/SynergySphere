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
import { Plus, FolderKanban, CheckCircle, Clock, AlertCircle, TrendingUp, Users, Sparkles, Calendar, Target, BarChart3, Zap } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
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

  // Calculate today's date for greeting
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Navbar />

      <AnimatedPage className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <FadeInUp>
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 rounded-3xl p-8 border border-white/20 dark:border-slate-800/50 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h1 className="font-space-grotesk text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                    {greeting}, {user.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl">
                    Ready to tackle your goals? Here's your project overview and what needs your attention today.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/projects/new">
                      <Plus className="mr-2 h-5 w-5" />
                      New Project
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Enhanced Stats Cards */}
        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <StaggerItem>
              <EnhancedCard className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <EnhancedCardHeader className="relative">
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Projects</EnhancedCardTitle>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <FolderKanban className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="relative">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{totalProjects}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active projects</p>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>

            <StaggerItem>
              <EnhancedCard className="group relative overflow-hidden bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <EnhancedCardHeader className="relative">
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Tasks</EnhancedCardTitle>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="relative">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{totalTasks}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">{completedTasks} completed</Badge>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>

            <StaggerItem>
              <EnhancedCard className="group relative overflow-hidden bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <EnhancedCardHeader className="relative">
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">In Progress</EnhancedCardTitle>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="relative">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{inProgressTasks}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active tasks</p>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>

            <StaggerItem>
              <EnhancedCard className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <EnhancedCardHeader className="relative">
                  <div className="flex items-center justify-between pb-2">
                    <EnhancedCardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Success Rate</EnhancedCardTitle>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="relative">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{completionRate}%</div>
                  <Progress 
                    value={completionRate} 
                    className="h-3 bg-slate-200 dark:bg-slate-700"
                  />
                </EnhancedCardContent>
              </EnhancedCard>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Recent Projects */}
          <FadeInUp delay={0.2} className="xl:col-span-2">
            <EnhancedCard className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl">
              <EnhancedCardHeader className="border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <EnhancedCardTitle className="font-space-grotesk text-xl text-slate-900 dark:text-white">
                        Recent Projects
                      </EnhancedCardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Your most recently created projects
                      </CardDescription>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Link href="/projects">
                      <span className="mr-2">View All</span>
                      <TrendingUp className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </EnhancedCardHeader>
              <EnhancedCardContent className="p-6">
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => {
                      const projectCompletedTasks = project.tasks.filter((task) => task.status === "done").length
                      const projectTotalTasks = project.tasks.length
                      const projectProgress =
                        projectTotalTasks > 0 ? Math.round((projectCompletedTasks / projectTotalTasks) * 100) : 0

                      return (
                        <FadeInUp key={project.id} delay={0.1 * index}>
                          <div className="group relative p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 via-purple-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FolderKanban className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {project.name}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                                      {project.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4 flex items-center gap-6">
                                  <div className="flex items-center gap-3 flex-1">
                                    <Progress 
                                      value={projectProgress} 
                                      className="flex-1 h-2 bg-slate-200 dark:bg-slate-700" 
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem]">
                                      {projectProgress}%
                                    </span>
                                  </div>
                                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                                    {projectTotalTasks} {projectTotalTasks === 1 ? 'task' : 'tasks'}
                                  </Badge>
                                </div>
                              </div>
                              <Button asChild variant="ghost" size="sm" className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={/projects/${project.id}}>
                                  <span className="sr-only">View project</span>
                                  <TrendingUp className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </FadeInUp>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FolderKanban className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">No projects yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                      Create your first project to start organizing your tasks and tracking progress
                    </p>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            <FadeInUp delay={0.3}>
              <SmartTaskSuggestions projects={projects} />
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <EnhancedCard className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl">
                <EnhancedCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <EnhancedCardTitle className="font-space-grotesk text-slate-900 dark:text-white">
                      Quick Actions
                    </EnhancedCardTitle>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-3">
                  <Button asChild className="w-full justify-start h-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-slate-700 dark:hover:to-slate-600" variant="outline">
                    <Link href="/projects/new">
                      <Plus className="mr-3 h-4 w-4" />
                      Create New Project
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start h-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-slate-700 dark:hover:to-slate-600" variant="outline">
                    <Link href="/projects">
                      <FolderKanban className="mr-3 h-4 w-4" />
                      View All Projects
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start h-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 hover:from-purple-100 hover:to-pink-100 dark:hover:from-slate-700 dark:hover:to-slate-600" variant="outline">
                    <Link href="/messages">
                      <Sparkles className="mr-3 h-4 w-4" />
                      AI Assistant
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start h-12 bg-gradient-to-r from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border-0 hover:from-orange-100 hover:to-red-100 dark:hover:from-slate-700 dark:hover:to-slate-600" variant="outline">
                    <Link href="/profile">
                      <Users className="mr-3 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </EnhancedCardContent>
              </EnhancedCard>
            </FadeInUp>

            {overdueTasks > 0 && (
              <FadeInUp delay={0.5}>
                <EnhancedCard className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border border-red-200 dark:border-red-800 shadow-xl">
                  <EnhancedCardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                      <EnhancedCardTitle className="font-space-grotesk text-red-700 dark:text-red-300">
                        Attention Needed
                      </EnhancedCardTitle>
                    </div>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      You have <span className="font-semibold">{overdueTasks}</span> overdue task{overdueTasks > 1 ? "s" : ""} that need your attention.
                    </p>
                    <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                      <Link href="/projects">
                        <Clock className="mr-2 h-4 w-4" />
                        Review Tasks
                      </Link>
                    </Button>
                  </EnhancedCardContent>
                </EnhancedCard>
              </FadeInUp>
            )}

            <FadeInUp delay={0.6}>
              <EnhancedCard className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-xl">
                <EnhancedCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <EnhancedCardTitle className="font-space-grotesk text-slate-900 dark:text-white">
                      This Week
                    </EnhancedCardTitle>
                  </div>
                </EnhancedCardHeader>
                <EnhancedCardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tasks completed</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300">
                      {completedTasks}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Projects active</span>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
                      {totalProjects}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall progress</span>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300">
                      {completionRate}%
                    </Badge>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </FadeInUp>
          </div>
        </div>
      </AnimatedPage>
    </div>
  )
}
