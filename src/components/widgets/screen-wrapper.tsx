import React from 'react'

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col h-full w-full p-4">{children}</div>
}

export default ScreenWrapper
