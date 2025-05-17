'use client'

import { createContext, useContext, useState } from 'react'

interface DashboardContextType {
  isSidebarOpen: boolean
  setIsSidebarOpen: (value: boolean) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <DashboardContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
