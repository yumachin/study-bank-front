"use client"

import { useEffect } from "react"
import { startMSW } from "@/mocks"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startMSW()
  }, [])

  return <>{children}</>
}