"use client"

import { useEffect } from "react"
import { AppToaster } from "@/components/ui/AppToaster"
import { startMSW } from "@/mocks"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startMSW()
  }, [])

  return (
    <>
      {children}
      <AppToaster />
    </>
  )
}