export default function ManageMembersLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {children}
      {modal}
    </div>
  )
}
