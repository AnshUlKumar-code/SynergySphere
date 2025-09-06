export interface StorageData {
  users: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    createdAt: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    createdAt: string
    tasks: Array<{
      id: string
      title: string
      description: string
      status: "todo" | "in-progress" | "done"
      assignee?: string
      dueDate?: string
      createdAt: string
      priority?: "low" | "medium" | "high"
    }>
  }>
  currentUser: string | null
}

const STORAGE_KEY = "projectflow-data"

export function getStorageData(): StorageData {
  if (typeof window === "undefined") {
    return { users: [], projects: [], currentUser: null }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }

  // Return default data with sample projects
  const defaultData: StorageData = {
    users: [],
    projects: [
      {
        id: "1",
        name: "Website Redesign",
        description: "Complete redesign of company website with modern UI/UX",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "1",
            title: "Create wireframes",
            description: "Design initial wireframes for all main pages",
            status: "done",
            priority: "high",
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "2",
            title: "Design homepage",
            description: "Create high-fidelity designs for the homepage",
            status: "in-progress",
            priority: "high",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "3",
            title: "Implement responsive design",
            description: "Ensure all pages work perfectly on mobile devices",
            status: "todo",
            priority: "medium",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        id: "2",
        name: "Mobile App Development",
        description: "Build native mobile app for iOS and Android",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: "4",
            title: "Setup development environment",
            description: "Configure React Native development environment",
            status: "done",
            priority: "high",
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "5",
            title: "Create authentication flow",
            description: "Implement login and registration screens",
            status: "in-progress",
            priority: "high",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
    ],
    currentUser: null,
  }

  setStorageData(defaultData)
  return defaultData
}

export function setStorageData(data: StorageData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error writing to localStorage:", error)
  }
}

export function updateStorageData(updater: (data: StorageData) => StorageData): void {
  const currentData = getStorageData()
  const newData = updater(currentData)
  setStorageData(newData)
}
