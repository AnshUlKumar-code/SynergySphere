"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { AnimatedPage, FadeInUp, StaggerContainer, StaggerItem } from "@/components/animated-page"
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/enhanced-card"
import { LoadingState } from "@/components/ui/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import { useProjects } from "@/contexts/project-context"
import { Plus, FolderKanban, Search, Calendar, MoreHorizontal, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
  const { user, isLoading } = useAuth()
  const { projects } = useProjects()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingState message="Loading your projects..." />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AnimatedPage className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <FadeInUp>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-space-grotesk text-3xl font-bold text-foreground flex items-center gap-2">
                <FolderKanban className="h-8 w-8 text-primary" />
                Projects
              </h1>
              <p className="text-muted-foreground mt-1">Manage and organize all your projects in one place.</p>
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

        {/* Search */}
        <FadeInUp delay={0.1}>
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glassmorphism border-primary/20"
            />
          </div>
        </FadeInUp>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const completedTasks = project.tasks.filter((task) => task.status === "done").length
                const totalTasks = project.tasks.length
                const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                const createdDate = new Date(project.createdAt).toLocaleDateString()

                return (
                  <StaggerItem key={project.id}>
                    <EnhancedCard
                      glassmorphism
                      className="h-full hover:shadow-xl transition-all duration-300 border-primary/10"
                      delay={index * 0.1}
                    >
                      <EnhancedCardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
                            >
                              <FolderKanban className="h-5 w-5 text-white" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <EnhancedCardTitle className="font-space-grotesk text-lg truncate">
                                {project.name}
                              </EnhancedCardTitle>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}`}>View Project</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/projects/${project.id}/board`}>Task Board</Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </EnhancedCardHeader>
                      <EnhancedCardContent>
                        <div className="space-y-4">
                          {/* Progress */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-muted-foreground">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary" className="text-xs">
                                {totalTasks} tasks
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {completedTasks} done
                              </Badge>
                            </div>
                          </div>

                          {/* Created Date */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Created {createdDate}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button asChild className="flex-1 bg-transparent" variant="outline">
                              <Link href={`/projects/${project.id}`}>View</Link>
                            </Button>
                            <Button asChild className="flex-1 bg-gradient-to-r from-primary to-secondary text-white">
                              <Link href={`/projects/${project.id}/board`}>
                                <Sparkles className="mr-1 h-3 w-3" />
                                Board
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </EnhancedCardContent>
                    </EnhancedCard>
                  </StaggerItem>
                )
              })}
            </div>
          </StaggerContainer>
        ) : (
          <FadeInUp delay={0.2}>
            <div className="text-center py-12">
              {searchQuery ? (
                <div>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No projects found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No projects match your search for "{searchQuery}"
                  </p>
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-medium mb-2">No projects yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first project to start organizing your work
                  </p>
                  <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                    <Link href="/projects/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Project
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </FadeInUp>
        )}
      </AnimatedPage>
    </div>
  )
}
