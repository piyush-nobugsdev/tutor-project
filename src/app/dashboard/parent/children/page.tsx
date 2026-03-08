'use client'

import { useState, useEffect, useTransition } from 'react'
import { createChild, getChildren, deleteChild } from '@/app/actions/children'
import type { Child } from '@/types/database.ts'

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1)

// ─── Grade badge colour ───────────────────────────────────────────────────────

function gradeBadgeClass(grade: number) {
  if (grade <= 4) return 'bg-green-100 text-green-700'
  if (grade <= 8) return 'bg-blue-100 text-blue-700'
  return 'bg-purple-100 text-purple-700'
}

// ─── Child Card ───────────────────────────────────────────────────────────────

function ChildCard({
  child,
  onDelete,
  deleting,
}: {
  child: Child
  onDelete: (id: string) => void
  deleting: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600">
          {child.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="font-medium text-gray-900">{child.name}</p>
          <p className="text-sm text-gray-500">Added {new Date(child.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${gradeBadgeClass(child.grade_level)}`}>
          Grade {child.grade_level}
        </span>

        <button
          onClick={() => onDelete(child.id)}
          disabled={deleting}
          className="text-sm text-red-500 hover:text-red-700 disabled:opacity-40"
          aria-label={`Remove ${child.name}`}
        >
          {deleting ? '...' : 'Remove'}
        </button>
      </div>
    </div>
  )
}

// ─── Add Child Form ───────────────────────────────────────────────────────────

function AddChildForm({ onSuccess }: { onSuccess: (child: Child) => void }) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const { data, error } = await createChild({
        name,
        grade_level: Number(grade),
        parent_id: ''
      })

      if (error) {
        setError(error)
        return
      }

      if (data) {
        onSuccess(data)
        setName('')
        setGrade('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-600">
        Add Child Profile
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* Name */}
        <div className="flex-1">
          <label htmlFor="child-name" className="mb-1 block text-sm font-medium text-gray-700">
            Child's Name
          </label>
          <input
            id="child-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aarav"
            required
            minLength={2}
            maxLength={60}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Grade */}
        <div className="w-full sm:w-36">
          <label htmlFor="child-grade" className="mb-1 block text-sm font-medium text-gray-700">
            Grade
          </label>
          <select
            id="child-grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="" disabled>Select</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60 sm:self-end"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving…
            </>
          ) : (
            '+ Add Child'
          )}
        </button>
      </div>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load children on mount
  useEffect(() => {
    getChildren().then(({ data, error }) => {
      if (error) setFetchError(error)
      else setChildren(data ?? [])
      setLoading(false)
    })
  }, [])

  function handleChildAdded(child: Child) {
    setChildren((prev) => [child, ...prev])
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this child profile? This cannot be undone.')) return
    setDeletingId(id)
    const { error } = await deleteChild(id)
    if (error) {
      alert(error)
    } else {
      setChildren((prev) => prev.filter((c) => c.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Child Profiles</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add your children here — you'll select them when posting tutoring jobs.
        </p>
      </div>

      {/* Add form */}
      <div className="mb-8">
        <AddChildForm onSuccess={handleChildAdded} />
      </div>

      {/* List */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Your Children ({children.length})
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            Loading…
          </div>
        ) : fetchError ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {fetchError}
          </div>
        ) : children.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center text-sm text-gray-400">
            No children added yet. Use the form above to get started.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onDelete={handleDelete}
                deleting={deletingId === child.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}