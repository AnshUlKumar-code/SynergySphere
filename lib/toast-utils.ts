import { toast } from "@/hooks/use-toast"

export const showSuccessToast = (title: string, description?: string) => {
  toast({
    variant: "success",
    title,
    description,
  })
}

export const showErrorToast = (title: string, description?: string) => {
  toast({
    variant: "destructive",
    title,
    description,
  })
}

export const showInfoToast = (title: string, description?: string) => {
  toast({
    title,
    description,
  })
}

// Specific toast messages for common actions
export const toastMessages = {
  project: {
    created: () => showSuccessToast("Project Created", "Your new project has been created successfully."),
    updated: () => showSuccessToast("Project Updated", "Project details have been saved."),
    deleted: () => showSuccessToast("Project Deleted", "The project has been removed."),
    error: () => showErrorToast("Project Error", "Something went wrong. Please try again."),
  },
  task: {
    created: () => showSuccessToast("Task Created", "New task has been added to your project."),
    updated: () => showSuccessToast("Task Updated", "Task details have been saved."),
    deleted: () => showSuccessToast("Task Deleted", "The task has been removed."),
    moved: (status: string) => showSuccessToast("Task Moved", `Task moved to ${status}.`),
    error: () => showErrorToast("Task Error", "Something went wrong. Please try again."),
  },
  auth: {
    loginSuccess: () => showSuccessToast("Welcome back!", "You have been logged in successfully."),
    loginError: () => showErrorToast("Login Failed", "Invalid credentials. Please try again."),
    registerSuccess: () => showSuccessToast("Account Created", "Welcome to ProjectFlow!"),
    registerError: () => showErrorToast("Registration Failed", "Please check your details and try again."),
    logoutSuccess: () => showInfoToast("Logged Out", "You have been logged out successfully."),
  },
  ai: {
    taskGenerated: () => showSuccessToast("AI Task Generated", "Your task has been created using AI assistance."),
    summaryGenerated: () => showSuccessToast("Summary Generated", "AI has analyzed your project."),
    error: () => showErrorToast("AI Error", "AI service is temporarily unavailable."),
  },
}
