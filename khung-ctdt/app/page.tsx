// File: app/page.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/build-curriculum')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <p className="text-lg text-slate-600">Loading...</p>
    </div>
  )
}