"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  getProjects,
  getProject,
  createProject as createProjectAPI,
  updateProject,
  deleteProject,
  createTask,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
  moveTask,
  getProjectStats,
  getAllProjectsStats,
  type Project,
  type Task,
} from "@/lib/mock-api"

interface ProjectContextType {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  createProject: (name: string, description: string) => Promise<boolean>
  selectProject: (projectId: string) => Promise<void>
  refreshProject: (projectId: string) => Promise<void>
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<boolean>
  deleteProject: (projectId: string) => Promise<boolean>
  addTask: (projectId: string, task: Omit<Task, "id" | "createdAt">) => Promise<boolean>
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<boolean>
  deleteTask: (projectId: string, taskId: string) => Promise<boolean>
  moveTask: (projectId: string, taskId: string, newStatus: Task["status"]) => Promise<boolean>
  getProjectStats: (projectId: string) => Promise<{
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    todoTasks: number
    overdueTasks: number
  }>
  getAllProjectsStats: () => Promise<{
    totalProjects: number
    totalTasks: number
    completedTasks: number
    overdueTasks: number
  }>
  refreshProjects: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await getProjects()
        setProjects(loadedProjects)
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const createProjectHandler = async (name: string, description: string): Promise<boolean> => {
    try {
      const newProject = await createProjectAPI(name, description)
      setProjects((prev) => [...prev, newProject])
      return true
    } catch (error) {
      console.error("Error creating project:", error)
      return false
    }
  }

  const selectProject = async (projectId: string): Promise<void> => {
    try {
      const project = await getProject(projectId)
      setCurrentProject(project)
    } catch (error) {
      console.error("Error selecting project:", error)
    }
  }

  const refreshProject = async (projectId: string): Promise<void> => {
    try {
      const project = await getProject(projectId)
      if (project) {
        setProjects((prev) => prev.map((p) => (p.id === projectId ? project : p)))
        if (currentProject?.id === projectId) {
          setCurrentProject(project)
        }
      }
    } catch (error) {
      console.error("Error refreshing project:", error)
    }
  }

  const refreshProjects = async (): Promise<void> => {
    try {
      const loadedProjects = await getProjects()
      setProjects(loadedProjects)
    } catch (error) {
      console.error("Error refreshing projects:", error)
    }
  }

  const addTask = async (projectId: string, taskData: Omit<Task, "id" | "createdAt">): Promise<boolean> => {
    try {
      const newTask = await createTask(projectId, taskData)
      if (newTask) {
        await refreshProject(projectId)
        return true
      }
      return false
    } catch (error) {
      console.error("Error adding task:", error)
      return false
    }
  }

  const updateTaskHandler = async (projectId: string, taskId: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      const updatedTask = await updateTaskAPI(projectId, taskId, updates)
      if (updatedTask) {
        await refreshProject(projectId)
        return true
      }
      return false
    } catch (error) {
      console.error("Error updating task:", error)
      return false
    }
  }

  const deleteTaskHandler = async (projectId: string, taskId: string): Promise<boolean> => {
    try {
      const success = await deleteTaskAPI(projectId, taskId)
      if (success) {
        await refreshProject(projectId)
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting task:", error)
      return false
    }
  }

  const moveTaskHandler = async (projectId: string, taskId: string, newStatus: Task["status"]): Promise<boolean> => {
    try {
      const updatedTask = await moveTask(projectId, taskId, newStatus)
      if (updatedTask) {
        await refreshProject(projectId)
        return true
      }
      return false
    } catch (error) {
      console.error("Error moving task:", error)
      return false
    }
  }

  const updateProjectHandler = async (projectId: string, updates: Partial<Project>): Promise<boolean> => {
    try {
      const updatedProject = await updateProject(projectId, updates)
      if (updatedProject) {
        setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)))
        if (currentProject?.id === projectId) {
          setCurrentProject(updatedProject)
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Error updating project:", error)
      return false
    }
  }

  const deleteProjectHandler = async (projectId: string): Promise<boolean> => {
    try {
      const success = await deleteProject(projectId)
      if (success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
        if (currentProject?.id === projectId) {
          setCurrentProject(null)
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting project:", error)
      return false
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        isLoading,
        createProject: createProjectHandler,
        selectProject,
        refreshProject,
        updateProject: updateProjectHandler,
        deleteProject: deleteProjectHandler,
        addTask,
        updateTask: updateTaskHandler,
        deleteTask: deleteTaskHandler,
        moveTask: moveTaskHandler,
        getProjectStats,
        getAllProjectsStats,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}

export type { Project, Task }
