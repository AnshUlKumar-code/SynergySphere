import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { CheckCircle, Users, BarChart3, MessageSquare, ArrowRight, Star } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: CheckCircle,
      title: "Task Management",
      description: "Organize tasks with intuitive Kanban boards and track progress effortlessly.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and team messaging.",
    },
    {
      icon: BarChart3,
      title: "Project Analytics",
      description: "Get insights into project progress and team productivity with detailed analytics.",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Get intelligent suggestions and automate routine tasks with our AI helper.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-space-grotesk text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              Project Management
              <span className="text-primary"> Reimagined</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              Streamline your workflow with our modern, intuitive project management platform. Built for teams who value
              simplicity and efficiency.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="font-medium">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-space-grotesk text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to manage projects
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to help your team stay organized and productive.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="relative overflow-hidden border-0 bg-card/50 backdrop-blur">
                    <CardContent className="p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="mt-4 font-space-grotesk text-lg font-semibold text-card-foreground">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-space-grotesk text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to transform your workflow?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of teams already using ProjectFlow to manage their projects more effectively.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/register">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-x-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>Trusted by 10,000+ teams worldwide</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
