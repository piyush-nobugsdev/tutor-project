'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const signInWithGitHub = async () => {
    const supabase = createSupabaseBrowserClient()

    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={signInWithGitHub}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Sign in with GitHub
      </button>
    </main>
  )
}

