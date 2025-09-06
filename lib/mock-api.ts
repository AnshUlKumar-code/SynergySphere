import { getStorageData, updateStorageData } from "./storage"

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  assignee?: string
  dueDate?: string
  createdAt: string
  priority?: "low" | "medium" | "high"
}

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  tasks: Task[]
}

// User API functions
export async function loginUser(email: string, password: string): Promise<User | null> {
  await delay()

  const data = getStorageData()
  let user = data.users.find((u) => u.email === email)

  if (!user && email && password) {
    // Create user if doesn't exist (for demo purposes)
    user = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date().toISOString(),
    }

    updateStorageData((prev) => ({
      ...prev,
      users: [...prev.users, user!],
      currentUser: user!.id,
    }))
  } else if (user) {
    updateStorageData((prev) => ({
      ...prev,
      currentUser: user!.id,
    }))
  }

  return user || null
}

export async function registerUser(name: string, email: string, password: string): Promise<User | null> {
  await delay()

  if (!name || !email || !password) return null

  const data = getStorageData()
  const existingUser = data.users.find((u) => u.email === email)

  if (existingUser) {
    throw new Error("User already exists")
  }

  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    createdAt: new Date().toISOString(),
  }

  updateStorageData((prev) => ({
    ...prev,
    users: [...prev.users, newUser],
    currentUser: newUser.id,
  }))

  return newUser
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(100)

  const data = getStorageData()
  if (!data.currentUser) return null

  return data.users.find((u) => u.id === data.currentUser) || null
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  await delay()

  let updatedUser: User | null = null

  updateStorageData((prev) => ({
    ...prev,
    users: prev.users.map((user) => {
      if (user.id === userId) {
        updatedUser = { ...user, ...updates }
        return updatedUser
      }
      return user
    }),
  }))

  return updatedUser
}

export async function logoutUser(): Promise<void> {
  await delay(100)

  updateStorageData((prev) => ({
    ...prev,
    currentUser: null,
  }))
}

// Project API functions
export async function getProjects(): Promise<Project[]> {
  await delay(300)

  const data = getStorageData()
  return data.projects
}

export async function getProject(projectId: string): Promise<Project | null> {
  await delay(200)

  const data = getStorageData()
  return data.projects.find((p) => p.id === projectId) || null
}

export async function createProject(name: string, description: string): Promise<Project> {
  await delay()

  const newProject: Project = {
    id: Date.now().toString(),
    name,
    description,
    createdAt: new Date().toISOString(),
    tasks: [],
  }

  updateStorageData((prev) => ({
    ...prev,
    projects: [...prev.projects, newProject],
  }))

  return newProject
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
  await delay()

  let updatedProject: Project | null = null

  updateStorageData((prev) => ({
    ...prev,
    projects: prev.projects.map((project) => {
      if (project.id === projectId) {
        updatedProject = { ...project, ...updates }
        return updatedProject
      }
      return project
    }),
  }))

  return updatedProject
}

export async function deleteProject(projectId: string): Promise<boolean> {
  await delay()

  updateStorageData((prev) => ({
    ...prev,
    projects: prev.projects.filter((p) => p.id !== projectId),
  }))

  return true
}

// Task API functions
export async function getTasks(projectId: string): Promise<Task[]> {
  await delay(200)

  const project = await getProject(projectId)
  return project?.tasks || []
}

export async function createTask(projectId: string, taskData: Omit<Task, "id" | "createdAt">): Promise<Task | null> {
  await delay()

  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  let createdTask: Task | null = null

  updateStorageData((prev) => ({
    ...prev,
    projects: prev.projects.map((project) => {
      if (project.id === projectId) {
        createdTask = newTask
        return { ...project, tasks: [...project.tasks, newTask] }
      }
      return project
    }),
  }))

  return createdTask
}

export async function updateTask(projectId: string, taskId: string, updates: Partial<Task>): Promise<Task | null> {
  await delay()

  let updatedTask: Task | null = null

  updateStorageData((prev) => ({
    ...prev,
    projects: prev.projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map((task) => {
            if (task.id === taskId) {
              updatedTask = { ...task, ...updates }
              return updatedTask
            }
            return task
          }),
        }
      }
      return project
    }),
  }))

  return updatedTask
}

export async function deleteTask(projectId: string, taskId: string): Promise<boolean> {
  await delay()

  updateStorageData((prev) => ({
    ...prev,
    projects: prev.projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter((task) => task.id !== taskId),
        }
      }
      return project
    }),
  }))

  return true
}

export async function moveTask(projectId: string, taskId: string, newStatus: Task["status"]): Promise<Task | null> {
  return updateTask(projectId, taskId, { status: newStatus })
}

// Analytics functions
export async function getProjectStats(projectId: string): Promise<{
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  overdueTasks: number
}> {
  await delay(200)

  const project = await getProject(projectId)
  if (!project) {
    return { totalTasks: 0, completedTasks: 0, inProgressTasks: 0, todoTasks: 0, overdueTasks: 0 }
  }

  const now = new Date()
  const totalTasks = project.tasks.length
  const completedTasks = project.tasks.filter((t) => t.status === "done").length
  const inProgressTasks = project.tasks.filter((t) => t.status === "in-progress").length
  const todoTasks = project.tasks.filter((t) => t.status === "todo").length
  const overdueTasks = project.tasks.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done").length

  return { totalTasks, completedTasks, inProgressTasks, todoTasks, overdueTasks }
}

export async function getAllProjectsStats(): Promise<{
  totalProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
}> {
  await delay(300)

  const projects = await getProjects()
  const totalProjects = projects.length
  const allTasks = projects.flatMap((p) => p.tasks)
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter((t) => t.status === "done").length

  const now = new Date()
  const overdueTasks = allTasks.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done").length

  return { totalProjects, totalTasks, completedTasks, overdueTasks }
}
