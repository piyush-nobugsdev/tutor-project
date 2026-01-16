export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Tutor Platform</h1>
      <p className="mt-4">Find tutors or start teaching</p>

      <div className="mt-6 flex gap-4">
        <a href="/auth?role=parent" className="rounded bg-black px-4 py-2 text-white">
          Sign up as Parent
        </a>
        <a href="/auth?role=tutor" className="rounded border px-4 py-2">
          Sign up as Tutor
        </a>
      </div>
    </main>
  )
}
