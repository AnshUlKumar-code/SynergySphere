import type { Task, Project } from "@/lib/mock-api"

// Mock AI responses for task generation
const taskTemplates = {
  design: [
    { title: "Create wireframes", description: "Design initial wireframes and user flow", priority: "high" as const },
    { title: "Design mockups", description: "Create high-fidelity visual designs", priority: "medium" as const },
    {
      title: "Create design system",
      description: "Establish colors, typography, and component library",
      priority: "medium" as const,
    },
    { title: "User research", description: "Conduct user interviews and usability testing", priority: "high" as const },
  ],
  development: [
    {
      title: "Setup development environment",
      description: "Configure project structure and dependencies",
      priority: "high" as const,
    },
    {
      title: "Implement core functionality",
      description: "Build main features and business logic",
      priority: "high" as const,
    },
    {
      title: "Add responsive design",
      description: "Ensure compatibility across all device sizes",
      priority: "medium" as const,
    },
    { title: "Write unit tests", description: "Create comprehensive test coverage", priority: "medium" as const },
  ],
  marketing: [
    {
      title: "Create content strategy",
      description: "Plan content calendar and messaging",
      priority: "medium" as const,
    },
    {
      title: "Social media campaign",
      description: "Design and launch social media presence",
      priority: "medium" as const,
    },
    { title: "SEO optimization", description: "Optimize content for search engines", priority: "low" as const },
    { title: "Analytics setup", description: "Implement tracking and measurement tools", priority: "high" as const },
  ],
  planning: [
    {
      title: "Define project scope",
      description: "Establish clear project boundaries and deliverables",
      priority: "high" as const,
    },
    {
      title: "Create timeline",
      description: "Develop detailed project schedule with milestones",
      priority: "high" as const,
    },
    {
      title: "Risk assessment",
      description: "Identify potential risks and mitigation strategies",
      priority: "medium" as const,
    },
    {
      title: "Stakeholder alignment",
      description: "Ensure all stakeholders agree on objectives",
      priority: "high" as const,
    },
  ],
}

const aiResponses = [
  "I've analyzed your request and created a task that should help move your project forward.",
  "Based on best practices, I've generated a task with appropriate priority and timeline.",
  "Here's a task I've created to address your needs. Feel free to modify the details as needed.",
  "I've crafted this task based on common project patterns and your specific requirements.",
  "This task should help you achieve your goal. I've set a reasonable priority based on the context.",
]

// Simulate AI processing delay
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

export async function generateTaskFromPrompt(prompt: string): Promise<{
  task: Omit<Task, "id" | "createdAt">
  aiResponse: string
}> {
  await delay(1500) // Simulate AI thinking time

  const lowerPrompt = prompt.toLowerCase()

  // Determine category based on keywords
  let category: keyof typeof taskTemplates = "planning"
  if (
    lowerPrompt.includes("design") ||
    lowerPrompt.includes("ui") ||
    lowerPrompt.includes("ux") ||
    lowerPrompt.includes("mockup") ||
    lowerPrompt.includes("wireframe")
  ) {
    category = "design"
  } else if (
    lowerPrompt.includes("code") ||
    lowerPrompt.includes("develop") ||
    lowerPrompt.includes("build") ||
    lowerPrompt.includes("implement") ||
    lowerPrompt.includes("program")
  ) {
    category = "development"
  } else if (
    lowerPrompt.includes("market") ||
    lowerPrompt.includes("promote") ||
    lowerPrompt.includes("campaign") ||
    lowerPrompt.includes("social") ||
    lowerPrompt.includes("seo")
  ) {
    category = "marketing"
  }

  // Get random template from category
  const templates = taskTemplates[category]
  const template = templates[Math.floor(Math.random() * templates.length)]

  // Generate task based on prompt and template
  let title = template.title
  let description = template.description

  // Try to extract specific details from the prompt
  if (lowerPrompt.includes("landing page")) {
    title = "Design landing page"
    description = "Create an engaging landing page design that converts visitors"
  } else if (lowerPrompt.includes("login") || lowerPrompt.includes("auth")) {
    title = "Implement authentication"
    description = "Build secure user login and registration system"
  } else if (lowerPrompt.includes("database")) {
    title = "Setup database"
    description = "Design and implement database schema and connections"
  } else if (lowerPrompt.includes("api")) {
    title = "Build API endpoints"
    description = "Create RESTful API endpoints for data management"
  } else if (lowerPrompt.includes("test")) {
    title = "Write tests"
    description = "Create comprehensive test suite for quality assurance"
  } else if (lowerPrompt.includes("deploy")) {
    title = "Deploy application"
    description = "Set up production deployment and CI/CD pipeline"
  }

  // Set due date based on priority
  let dueDate: string | undefined
  const now = new Date()
  if (template.priority === "high") {
    dueDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
  } else if (template.priority === "medium") {
    dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week
  } else {
    dueDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks
  }

  const task: Omit<Task, "id" | "createdAt"> = {
    title,
    description,
    status: "todo",
    priority: template.priority,
    dueDate,
  }

  const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

  return { task, aiResponse }
}

export async function summarizeProject(project: Project): Promise<string> {
  await delay(2000) // Simulate AI analysis time

  const { tasks } = project
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "done").length
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
  const todoTasks = tasks.filter((t) => t.status === "todo").length

  const now = new Date()
  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done").length
  const highPriorityTasks = tasks.filter((t) => t.priority === "high" && t.status !== "done").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  let summary = `**${project.name}** is currently ${completionRate}% complete with ${totalTasks} total tasks.\n\n`

  // Progress breakdown
  summary += `**Progress Breakdown:**\n`
  summary += `• ✅ Completed: ${completedTasks} tasks\n`
  summary += `• 🔄 In Progress: ${inProgressTasks} tasks\n`
  summary += `• 📋 To Do: ${todoTasks} tasks\n\n`

  // Alerts and recommendations
  if (overdueTasks > 0) {
    summary += `⚠️ **Attention:** ${overdueTasks} task${overdueTasks > 1 ? "s are" : " is"} overdue and need${overdueTasks === 1 ? "s" : ""} immediate attention.\n\n`
  }

  if (highPriorityTasks > 0) {
    summary += `🔥 **High Priority:** ${highPriorityTasks} high-priority task${highPriorityTasks > 1 ? "s" : ""} require${highPriorityTasks === 1 ? "s" : ""} focus.\n\n`
  }

  // Project health assessment
  if (completionRate >= 80) {
    summary += `🎉 **Status:** Project is nearing completion! Great progress on all fronts.`
  } else if (completionRate >= 60) {
    summary += `📈 **Status:** Project is making solid progress. Keep up the momentum!`
  } else if (completionRate >= 40) {
    summary += `⚡ **Status:** Project is in active development. Consider prioritizing high-impact tasks.`
  } else if (completionRate >= 20) {
    summary += `🚀 **Status:** Project is in early stages. Focus on establishing core foundations.`
  } else {
    summary += `🌱 **Status:** Project is just getting started. Consider breaking down large tasks into smaller, manageable pieces.`
  }

  return summary
}

export async function getSmartTaskSuggestions(projects: Project[]): Promise<{
  urgentTasks: Array<Task & { projectName: string; projectId: string }>
  priorityTasks: Array<Task & { projectName: string; projectId: string }>
  suggestions: string[]
}> {
  await delay(1000)

  const now = new Date()
  const allTasks = projects.flatMap((project) =>
    project.tasks.map((task) => ({
      ...task,
      projectName: project.name,
      projectId: project.id,
    })),
  )

  // Find urgent tasks (overdue or due soon)
  const urgentTasks = allTasks
    .filter((task) => {
      if (task.status === "done") return false
      if (!task.dueDate) return false

      const dueDate = new Date(task.dueDate)
      const timeDiff = dueDate.getTime() - now.getTime()
      const daysDiff = timeDiff / (1000 * 3600 * 24)

      return daysDiff <= 2 // Due within 2 days or overdue
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5)

  // Find high priority tasks
  const priorityTasks = allTasks
    .filter((task) => task.status !== "done" && task.priority === "high")
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      return a.dueDate ? -1 : 1
    })
    .slice(0, 5)

  // Generate smart suggestions
  const suggestions: string[] = []

  if (urgentTasks.length > 0) {
    suggestions.push(
      `You have ${urgentTasks.length} urgent task${urgentTasks.length > 1 ? "s" : ""} that need immediate attention.`,
    )
  }

  const inProgressTasks = allTasks.filter((task) => task.status === "in-progress")
  if (inProgressTasks.length > 5) {
    suggestions.push("Consider focusing on completing current in-progress tasks before starting new ones.")
  }

  const tasksWithoutDueDates = allTasks.filter((task) => task.status !== "done" && !task.dueDate)
  if (tasksWithoutDueDates.length > 3) {
    suggestions.push("Adding due dates to your tasks will help with better time management and prioritization.")
  }

  const projectsWithoutRecentActivity = projects.filter((project) => {
    const recentTasks = project.tasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      const daysSince = (now.getTime() - taskDate.getTime()) / (1000 * 3600 * 24)
      return daysSince <= 7
    })
    return recentTasks.length === 0 && project.tasks.some((task) => task.status !== "done")
  })

  if (projectsWithoutRecentActivity.length > 0) {
    suggestions.push(
      `${projectsWithoutRecentActivity.length} project${projectsWithoutRecentActivity.length > 1 ? "s" : ""} haven't had recent activity. Consider reviewing and updating them.`,
    )
  }

  if (suggestions.length === 0) {
    suggestions.push("Great job! Your projects are well-organized and on track.")
  }

  return { urgentTasks, priorityTasks, suggestions }
}

export async function generateProjectInsights(project: Project): Promise<{
  insights: string[]
  recommendations: string[]
}> {
  await delay(1500)

  const { tasks } = project
  const insights: string[] = []
  const recommendations: string[] = []

  // Task distribution analysis
  const statusCounts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  }

  if (statusCounts["in-progress"] > statusCounts.todo + statusCounts.done) {
    insights.push("High number of tasks in progress - team might be multitasking heavily")
    recommendations.push("Consider limiting work-in-progress to improve focus and completion rate")
  }

  // Priority distribution
  const priorityCounts = {
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  }

  if (priorityCounts.high > tasks.length * 0.5) {
    insights.push("Over 50% of tasks are marked as high priority")
    recommendations.push("Review task priorities to ensure proper focus on truly critical items")
  }

  // Timeline analysis
  const now = new Date()
  const upcomingDeadlines = tasks.filter((task) => {
    if (!task.dueDate || task.status === "done") return false
    const dueDate = new Date(task.dueDate)
    const daysDiff = (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    return daysDiff <= 7 && daysDiff > 0
  })

  if (upcomingDeadlines.length > 0) {
    insights.push(`${upcomingDeadlines.length} task${upcomingDeadlines.length > 1 ? "s" : ""} due within the next week`)
  }

  // Completion velocity
  const completedThisWeek = tasks.filter((task) => {
    if (task.status !== "done") return false
    const completedDate = new Date(task.createdAt) // Using createdAt as proxy for completion
    const daysSince = (now.getTime() - completedDate.getTime()) / (1000 * 3600 * 24)
    return daysSince <= 7
  })

  if (completedThisWeek.length > 0) {
    insights.push(`${completedThisWeek.length} task${completedThisWeek.length > 1 ? "s" : ""} completed this week`)
  }

  // Default insights if none generated
  if (insights.length === 0) {
    insights.push("Project is well-balanced with good task distribution")
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue with current workflow - project appears to be on track")
  }

  return { insights, recommendations }
}
