export default function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <header>Parent Dashboard</header>
      <main>{children}</main>
    </div>
  )
}
