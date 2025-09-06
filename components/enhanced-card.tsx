"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EnhancedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glassmorphism?: boolean
  neumorphism?: boolean
  delay?: number
}

export function EnhancedCard({
  children,
  className,
  hover = true,
  glassmorphism = false,
  neumorphism = false,
  delay = 0,
}: EnhancedCardProps) {
  const cardStyles = cn(
    "transition-all duration-300",
    {
      // Glassmorphism effect
      "bg-background/80 backdrop-blur-md border-white/20 shadow-xl": glassmorphism,
      // Neumorphism effect
      "bg-gradient-to-br from-background to-muted/50 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.1)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.05)] border-0":
        neumorphism,
      // Hover effects
      "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1": hover && !neumorphism,
      "hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.15)] dark:hover:shadow-[12px_12px_24px_rgba(0,0,0,0.4),-12px_-12px_24px_rgba(255,255,255,0.08)]":
        hover && neumorphism,
    },
    className,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      className={cardStyles}
    >
      <Card className="border-0 shadow-none bg-transparent">{children}</Card>
    </motion.div>
  )
}

interface EnhancedCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function EnhancedCardHeader({ children, className }: EnhancedCardHeaderProps) {
  return <CardHeader className={className}>{children}</CardHeader>
}

interface EnhancedCardContentProps {
  children: React.ReactNode
  className?: string
}

export function EnhancedCardContent({ children, className }: EnhancedCardContentProps) {
  return <CardContent className={className}>{children}</CardContent>
}

interface EnhancedCardTitleProps {
  children: React.ReactNode
  className?: string
}

export function EnhancedCardTitle({ children, className }: EnhancedCardTitleProps) {
  return <CardTitle className={className}>{children}</CardTitle>
}
