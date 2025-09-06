"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  assignee?: string
  dueDate?: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  tasks: Task[]
}

interface ProjectContextType {
  projects: Project[]
  currentProject: Project | null
  createProject: (name: string, description: string) => void
  selectProject: (projectId: string) => void
  addTask: (projectId: string, task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void
  deleteTask: (projectId: string, taskId: string) => void
  moveTask: (projectId: string, taskId: string, newStatus: Task["status"]) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem("projectflow-projects")
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects)
      setProjects(parsedProjects)
    }
  }, [])

  useEffect(() => {
    // Save projects to localStorage whenever they change
    localStorage.setItem("projectflow-projects", JSON.stringify(projects))
  }, [projects])

  const createProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      tasks: [],
    }

    setProjects((prev) => [...prev, newProject])
  }

  const selectProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    setCurrentProject(project || null)
  }

  const addTask = (projectId: string, taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    setProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, tasks: [...project.tasks, newTask] } : project)),
    )
  }

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
            }
          : project,
      ),
    )
  }

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, tasks: project.tasks.filter((task) => task.id !== taskId) } : project,
      ),
    )
  }

  const moveTask = (projectId: string, taskId: string, newStatus: Task["status"]) => {
    updateTask(projectId, taskId, { status: newStatus })
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        createProject,
        selectProject,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
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
