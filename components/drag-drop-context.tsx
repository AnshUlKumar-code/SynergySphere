"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DragDropContextType {
  draggedItem: any | null
  dragOverColumn: string | null
  setDraggedItem: (item: any | null) => void
  setDragOverColumn: (column: string | null) => void
  isDragging: boolean
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<any | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const isDragging = draggedItem !== null

  return (
    <DragDropContext.Provider
      value={{
        draggedItem,
        dragOverColumn,
        setDraggedItem,
        setDragOverColumn,
        isDragging,
      }}
    >
      {children}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}
