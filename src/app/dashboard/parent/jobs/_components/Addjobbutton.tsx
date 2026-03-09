'use client'

import { useState } from 'react'
import AddJobModal from './Addjobmodal'

interface Child {
  id: string
  name: string
  grade_level: number
}

export default function AddJobButton({ children }: { children: Child[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Job
      </button>

      {open && (
        <AddJobModal
          children={children}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false)
            // Reload the page to show the new job with its count
            window.location.reload()
          }}
        />
      )}
    </>
  )
}