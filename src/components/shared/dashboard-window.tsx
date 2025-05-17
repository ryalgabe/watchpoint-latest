import React from 'react'
import { DashboardProvider } from './context/dashboard-context'
import { DashboardHeader } from './dashboard/dashboard-header'
import { DashboardSidebar } from './dashboard/dashboard-sidebar'

export default function DashboardWindow({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  )
}
