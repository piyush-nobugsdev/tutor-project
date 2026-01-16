export default function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <header>Tutor Dashboard</header>
      <main>{children}</main>
    </div>
  )
}
